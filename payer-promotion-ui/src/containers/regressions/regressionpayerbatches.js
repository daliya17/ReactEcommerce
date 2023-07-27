import {
  Typography,
  withStyles,
  Tooltip,
  Tabs,
  Tab,
  IconButton
} from '@material-ui/core';
import {
  PictureAsPdf,
  Code,
  Description,
  Assessment,
  Edit,
  FileCopy
} from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { resetPayerSelection } from '../../actions/payers';
import { resetRegressionPayerSelection } from '../../actions/regressionpayers';
import { resetRegressionSelection } from '../../actions/regressions';
import Path from '../../lib/path';
import Selector from '../../lib/selectors';
import * as ActionCreators from '../../actions/regressionpayerbatches';
import Lib from '../../lib';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import * as Colors from '../comparisons/colors';
import { batchStatuses } from '../../schema/regressionpayerbatches';
import Popup from '../../lib/popup';
import { getScoreColumns, TableHeader } from './scoreColumns';
import popup from '../../lib/popup';
import OverFlowCell from '../../components/OverFlowCell';
import moment from 'moment';
import { displayDate } from '../../components/displayDate';
import AddEditNotes from './addeditnotes';
import { remitAdviceFormatLabels } from '../../constants/RemitAdviceFormat';
import RecordAnalysis from './recordanalysis';
import Analysis from '../../constants/Analysis.json';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state) {
  return {
    ...Selector.getSelectedRegressionPayerBatches(state)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetPayerSelection,
      resetRegressionSelection,
      resetRegressionPayerSelection,
      resetRegressionPayerBatchSelection:
        ActionCreators.resetRegressionPayerBatchSelection,
      updateRegressionPayerBatchSelection:
        ActionCreators.updateRegressionPayerBatchSelection,
      fetchRegressionPayerBatches: ActionCreators.fetchRegressionPayerBatches,
      initiatePosting: ActionCreators.initiatePosting,
      updateSelectedBatchFormatTabIndex:
        ActionCreators.updateSelectedBatchFormatTabIndex,
      viewPostingResult: ActionCreators.viewPostingResult,
      viewMera: ActionCreators.viewMera,
      viewSupplementData: ActionCreators.viewSupplementData,
      viewBatchPDF: ActionCreators.viewBatchPDF,
      viewPayer: ActionCreators.viewPayer
    },
    dispatch
  );
}

const styles = {
  ...Colors.textColors
};

const mappedStatusColors = {
  [batchStatuses[1]]: 'differentTxt',
  [batchStatuses[2]]: 'removedTxt',
  [batchStatuses[3]]: 'addedTxt'
};

class RegressionPayerBatches extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      addNotesOpen: false,
      editMode: false,
      currentNotesText: '',
      analysisDialogOpen: false,

      hoverOverId: -1,
      regressionDataIds: []
    };
  }

  isInSidePane() {
    return !!Path.getSelectedRegressionPayerBatch();
  }

  initiatePosting = selectedIndexes => {
    const maxBatchesAllowed = 5;
    if (selectedIndexes && selectedIndexes.length > maxBatchesAllowed) {
      popup.alert(
        'maximum of ' +
          maxBatchesAllowed +
          ' batches are allowed in single request'
      );
      return;
    }

    const batches = Selector.getSelectedTypeByFormat(
      this.props.batches,
      this.props.selectedBatchFormatTabIndex
    );

    const selectedRegressionDataIds = batches
      .filter((batch, batchIndex) => {
        return (
          batch.regressionBatchStatus === 'FINISHED' &&
          !batch.postingStatus &&
          selectedIndexes.indexOf(batchIndex.toString()) !== -1
        );
      })
      .map(batch => {
        return batch.regressionDataId;
      });

    if (selectedRegressionDataIds.length === 0) {
      popup.alert('No valid batch is selected.');
      return;
    }
    this.props.initiatePosting(
      this.props.regressionId,
      this.props.payerId,
      selectedRegressionDataIds
    );
  };

  handleAddNotes = selectedIndexes => {
    const regressionDataIds = Lib.getSelectedRegressionData(
      this.props.batches,
      this.props.selectedBatchFormatTabIndex,
      selectedIndexes
    );

    if (regressionDataIds.length === 0) {
      popup.alert('No valid batch is selected.');
      return;
    }

    this.setState({
      addNotesOpen: true,
      editMode: false,
      regressionDataIds
    });
  };

  handleViewPostingResult = indexs => {
    const index = indexs[0];
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const batches = Selector.getSelectedTypeByFormat(
      this.props.batches,
      this.props.selectedBatchFormatTabIndex
    );
    const paymentBatchIdentifier = Lib.getBatchIdentifier(batches, index);

    this.props.viewPostingResult(regressionId, payerId, paymentBatchIdentifier);
  };

  isViewPostingResultDisabled = indexes => {
    const batches = Selector.getSelectedTypeByFormat(
      this.props.batches,
      this.props.selectedBatchFormatTabIndex
    );
    const index = indexes[0];
    return !(batches[index] && batches[index].postingStatus === 'COMPLETED');
  };

  handleAnalysisOutput = selectedIndexes => {
    const regressionDataIds = Lib.getSelectedRegressionData(
      this.props.batches,
      this.props.selectedBatchFormatTabIndex,
      selectedIndexes
    );

    if (regressionDataIds.length === 0) {
      popup.alert('No valid batch is selected.');
      return;
    }

    this.setState({
      analysisDialogOpen: true,
      regressionDataIds
    });
  };

  getActions() {
    if (
      Lib.getFormatByIndex(
        this.props.selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.null
      ) ||
      this.isInSidePane()
    ) {
      return [];
    }

    if (
      Lib.getFormatByIndex(
        this.props.selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.JSON
      )
    ) {
      this.actions = [
        {
          id: 'initiateposting',
          label: 'Initiate Posting',
          selectionType: 'multiple',
          handler: this.initiatePosting
        },
        {
          id: 'viewpostingresult',
          label: 'View Posting Result',
          selectionType: 'single',
          handler: this.handleViewPostingResult,
          disabled: this.isViewPostingResultDisabled
        }
      ];
    } else if (
      Lib.getFormatByIndex(
        this.props.selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.ANSI835
      )
    ) {
      this.actions = [
        {
          id: 'addNotes',
          label: 'Add Notes',
          selectionType: 'multiple',
          handler: this.handleAddNotes
        },
        {
          id: 'analysis',
          label: 'Analysis',
          selectionType: 'multiple',
          handler: this.handleAnalysisOutput
        }
      ];
    }
    return this.actions;
  }

  handleTabChange = (event, newValue) => {
    if (newValue === this.props.selectedBatchFormatTabIndex) {
      return;
    }

    this.props.updateSelectedBatchFormatTabIndex(newValue);
  };

  handleSelection = index => {
    if (
      Lib.getFormatByIndex(
        this.props.selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.null
      ) ||
      Lib.getFormatByIndex(
        this.props.selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.ANSI835
      )
    ) {
      return;
    }

    if (index !== this.props.selectedRegressionPayerBatchIndex) {
      const {
        batches,
        regressionId,
        selectedBatchFormatTabIndex,
        payerId
      } = this.props;

      const rows = Selector.getSelectedTypeByFormat(
        batches,
        selectedBatchFormatTabIndex
      );
      const selectedBatch = rows[index];

      // Check if the batch regression finished successfully
      if (selectedBatch.regressionBatchStatus !== batchStatuses[3]) {
        Popup.alert(
          'Regression for this payment batch has not finished successfully'
        );
      }

      this.props.updateRegressionPayerBatchSelection(index);
      // Once the regression payer batch is selected, update the path
      const paymentBatchIdentifier = Lib.getBatchIdentifier(rows, index);
      if (paymentBatchIdentifier) {
        Path.redirect(
          Path.getNavigatedBatchComparisonsPath(
            regressionId,
            payerId,
            paymentBatchIdentifier
          )
        );
      }
    }
  };

  setScroller = node => {
    if (!this.node) {
      Lib.scrollIntoView(node, this.selectedRow);
    }
    this.scroller = node;
  };

  setSelectedRow = node => {
    if (!this.selectedRow) {
      Lib.scrollIntoView(this.scroller, node);
    }
    this.selectedRow = node;
  };

  getColumnDefinitions() {
    const { selectedBatchFormatTabIndex } = this.props;
    let definitions = [
      {
        id: 'paymentBatchIdentifier',
        label: 'Payment Batch',
        disablePadding: this.isInSidePane(),
        filterable: true
      }
    ];

    if (!this.isInSidePane()) {
      definitions = [
        ...definitions,
        {
          id: 'layoutId',
          label: 'Layout ID',
          render: row => <OverFlowCell displayText={row.layoutId} />,
          filterable: true
        }
      ];

      definitions = [
        ...definitions,
        {
          id: 'remitType',
          label: 'Remit Type',
          filterable: true
        }
      ];

      if (
        Lib.getFormatByIndex(
          selectedBatchFormatTabIndex,
          remitAdviceFormatLabels.JSON
        )
      ) {
        definitions = [
          ...definitions,
          {
            id: 'totalFields',
            label: 'Total Fields #',
            numeric: true
          }
        ];
      }
    }

    if (
      Lib.getFormatByIndex(
        selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.JSON
      )
    ) {
      definitions = [...definitions, ...getScoreColumns(!this.isInSidePane())];
    }

    definitions = [
      ...definitions,
      {
        id: 'status',
        label: 'Status',
        render: this.renderStatus,
        filterable: true
      }
    ];

    if (
      (Lib.getFormatByIndex(
        selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.JSON
      ) ||
        Lib.getFormatByIndex(
          selectedBatchFormatTabIndex,
          remitAdviceFormatLabels.ANSI835
        )) &&
      !this.isInSidePane()
    ) {
      definitions = [
        ...definitions,
        {
          id: 'postingStatus',
          label: 'Posting',
          filterable: true
        },
        {
          id: 'postingIntializedDate',
          label: 'Posting Triggered On',
          render: this.renderPostingInitializedDate,
          filterable: true
        },
        {
          id: 'postingRegressionDiffsCount',
          label: (
            <TableHeader
              label="Posting Diffs"
              title="Posting Regression Diffs Count"
            />
          ),
          numeric: true
        }
      ];
    }

    if (
      Lib.getFormatByIndex(
        selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.ANSI835
      ) &&
      !this.isInSidePane()
    ) {
      definitions = [
        ...definitions,
        {
          id: 'analysis',
          label: 'Analysis',
          filterable: true,
          render: this.renderAnalysis
        },
        {
          id: 'notes',
          label: 'Notes',
          filterable: true,
          render: this.renderNotes
        },
        {
          id: 'postingResult',
          filterable: false,
          render: this.renderPostingResultLink
        },
        {
          id: 'mera',
          filterable: false,
          render: this.renderMeraLink
        },
        {
          id: 'supplementdata',
          filterable: false,
          render: this.renderXMLLink
        },
        {
          id: 'identifiedPayer',
          filterable: false,
          render: this.renderPayerLink
        }
      ];
    }

    if (
      (Lib.getFormatByIndex(
        selectedBatchFormatTabIndex,
        remitAdviceFormatLabels.null
      ) ||
        Lib.getFormatByIndex(
          selectedBatchFormatTabIndex,
          remitAdviceFormatLabels.ANSI835
        )) &&
      !this.isInSidePane()
    ) {
      definitions = [
        ...definitions,
        {
          id: 'image',
          filterable: false,
          render: this.renderImagePDF
        }
      ];
    }

    return definitions;
  }

  renderPostingInitializedDate = row => {
    const { classes } = this.props;
    if (row.sentToPostingDate && this.isDateIsInPastWeeks(row)) {
      const greyedoutTxtClassName = 'greyedoutTxt';
      return displayDate(row.sentToPostingDate, classes[greyedoutTxtClassName]);
    }
    return row.sentToPostingDate && displayDate(row.sentToPostingDate);
  };

  renderNotes = row => {
    return (
      <div
        onMouseLeave={this.mouseLeave}
        onMouseEnter={this.mouseEnter(row.id)}
      >
        {row.notes}

        {row.notes && row.id === this.state.hoverOverId ? (
          <IconButton
            onClick={this.handleEditNotes(row)}
            disableFocusRipple="true"
            disableRipple="true"
          >
            <Edit fontSize="small" />
          </IconButton>
        ) : (
          ''
        )}
      </div>
    );
  };

  mouseEnter = rowId => event => {
    this.setState({ hoverOverId: rowId });
  };

  mouseLeave = () => {
    this.setState({ hoverOverId: -1 });
  };

  renderImagePDF = row => {
    return (
      <Tooltip
        disableFocusListener
        disableTouchListener
        title="View PDF"
        placement="bottom"
      >
        <IconButton onClick={this.handlePDFIconClicked(row)}>
          <PictureAsPdf />
        </IconButton>
      </Tooltip>
    );
  };

  renderMeraLink = row => {
    return (
      <Tooltip
        disableFocusListener
        disableTouchListener
        title="View 835"
        placement="bottom"
      >
        <IconButton onClick={this.handleMeraIconClicked(row)}>
          <Description />
        </IconButton>
      </Tooltip>
    );
  };

  renderXMLLink = row => {
    return (
      <Tooltip
        disableFocusListener
        disableTouchListener
        title="View Supplement Data"
        placement="bottom"
      >
        <IconButton onClick={this.handleSupplementDataIconClicked(row)}>
          <Code />
        </IconButton>
      </Tooltip>
    );
  };

  renderPostingResultLink = row => {
    return (
      <Tooltip
        disableFocusListener
        disableTouchListener
        title="View Posting Result"
        placement="bottom"
      >
        <IconButton
          disabled={row.postingStatus !== 'COMPLETED'}
          onClick={this.handlePostingIconClicked(row)}
        >
          <Assessment />
        </IconButton>
      </Tooltip>
    );
  };

  renderPayerLink = row => {
    return (
        <Tooltip
            disableFocusListener
            disableTouchListener
            title="View Identified Payers"
            placement="bottom"
        >
          <IconButton
              onClick={this.handlePayerIconClicked(row)}
          >
            <FileCopy />
          </IconButton>
        </Tooltip>
    );
  };

  handleEditNotes = row => event =>  {
    
    this.setState({
      addNotesOpen: true,
      editMode: true,
      currentNotesText: row.notes,
      regressionDataIds: [row.regressionDataId]
    });
  };

  handlePostingIconClicked = row => event => {
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const paymentBatchIdentifier = Lib.getPaymentBatchIdentifier(row);

    this.props.viewPostingResult(regressionId, payerId, paymentBatchIdentifier);
  };

  handleSupplementDataIconClicked = row => event => {
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const paymentBatchIdentifier = Lib.getPaymentBatchIdentifier(row);

    this.props.viewSupplementData(
      regressionId,
      payerId,
      paymentBatchIdentifier
    );
  };

  handleMeraIconClicked = row => event => {
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const paymentBatchIdentifier = Lib.getPaymentBatchIdentifier(row);

    this.props.viewMera(regressionId, payerId, paymentBatchIdentifier);
  };

  handlePDFIconClicked = row => event => {
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const paymentBatchIdentifier = Lib.getPaymentBatchIdentifier(row);
    this.props.viewBatchPDF(regressionId, payerId, paymentBatchIdentifier);
  };

  handlePayerIconClicked = row => event => {
    const regressionId = this.props.regressionId;
    const payerId = this.props.payerId;
    const paymentBatchIdentifier = Lib.getPaymentBatchIdentifier(row);
    this.props.viewPayer(regressionId, payerId, paymentBatchIdentifier);
  };

  isDateIsInPastWeeks(batch) {
    const today = moment();
    const startOfWeek = today.startOf('week');
    const postingInitializedDate = moment(batch.sentToPostingDate);
    const daydifference = startOfWeek.diff(postingInitializedDate, 'days');
    return daydifference > 0;
  }

  renderStatus = row => {
    const { classes } = this.props;
    return (
      row.status && (
        <Tooltip title={row.errorReason ? row.errorReason : row.status}>
          <span
            className={
              mappedStatusColors[row.regressionBatchStatus]
                ? classes[mappedStatusColors[row.regressionBatchStatus]]
                : ''
            }
          >
            {row.status}
          </span>
        </Tooltip>
      )
    );
  };

  renderAnalysis = row => {
    if (row.analysis) {
      return Analysis.find(({ id }) => id === row.analysis)['name'];
    }
    return row.analysis;
  };

  renderBreadcrumb() {
    const {
      selectedRegression,
      selectedPayer,
      regressionId,
      payerId
    } = this.props;

    return (
      <div className="breadcrumb">
        <Typography variant="body2">
          <Link
            to={Path.RegressionsRoute}
            onClick={() => this.props.resetRegressionSelection()}
          >
            {'Regressions'}
          </Link>
          {' / ' + selectedRegression.name + ' / '}
          <Link
            to={Path.getRegressionPayersPath(regressionId)}
            onClick={() => this.props.resetRegressionPayerSelection()}
          >
            {'Payers'}
          </Link>
          {' / ' + selectedPayer.payerName + (this.isInSidePane() ? ' / ' : '')}
          {this.isInSidePane() ? (
            <Link
              to={Path.getRegressionPayerBatchesPath(regressionId, payerId)}
              onClick={() => this.props.resetRegressionPayerBatchSelection()}
            >
              {remitAdviceFormatLabels.JSON.toUpperCase()}
            </Link>
          ) : (
            ''
          )}
        </Typography>
      </div>
    );
  }

  handleOnClose = () => {
    this.setState({
      addNotesOpen: false,
      analysisDialogOpen: false,
      currentNotesText: '',
      regressionDataIds: []
    });
  };

  render() {
    const {
      batches,
      selectedRegressionPayerIndex,
      selectedRegressionPayerBatchIndex,
      selectedBatchFormatTabIndex,
      regressionId,
      payerId
    } = this.props;

    if (selectedRegressionPayerIndex < 0) {
      return (
        <React.Fragment>
          <Typography className="margin" variant="body1">
            {'Payer not found'}
          </Typography>
        </React.Fragment>
      );
    }

    const selected =
      selectedRegressionPayerBatchIndex >= 0
        ? [selectedRegressionPayerBatchIndex]
        : [];

    const formatBatchCount = Lib.getRegressionFormatBatchCount(batches);

    const formatLabels = Lib.getFormatLabels(formatBatchCount);

    return (
      <React.Fragment>
        {this.renderBreadcrumb()}
        <Typography className="headline" variant="headline">
          {'Payment Batches'}
        </Typography>
        {!this.isInSidePane() ? (
          <Tabs
            value={selectedBatchFormatTabIndex}
            onChange={this.handleTabChange}
          >
            {Object.keys(formatLabels).map(format => (
              <Tab key={format} label={formatLabels[format]} />
            ))}
          </Tabs>
        ) : (
          ''
        )}
        <div className="tabcontainer scrollable" ref={this.setScroller}>
          {this.state.addNotesOpen ? (
            <AddEditNotes
              open={this.state.addNotesOpen}
              editMode={this.state.editMode}
              currentNotesText={this.state.currentNotesText}
              regressionDataIds={this.state.regressionDataIds}
              onClose={this.handleOnClose}
            />
          ) : (
            ''
          )}
          {this.state.analysisDialogOpen ? (
            <RecordAnalysis
              open={this.state.analysisDialogOpen}
              regressionDataIds={this.state.regressionDataIds}
              onClose={this.handleOnClose}
            />
          ) : (
            ''
          )}
          <ReduxTable
            className={'dense-padding'}
            name={Strings.regressionPayerBatchesTable}
            actions={this.getActions()}
            columns={this.getColumnDefinitions()}
            rows={Selector.getBatchesToDisplay(
              batches,
              selectedBatchFormatTabIndex,
              this.isInSidePane()
            )}
            selected={selected}
            onSelect={this.handleSelection}
            filterable={!this.isInSidePane()}
            selectedRowRef={this.setSelectedRow}
            order="desc"
            orderBy="id"
            refreshable
            onRefresh={() =>
              this.props.fetchRegressionPayerBatches(regressionId, payerId)
            }
            highlightAlternateRow={!this.isInSidePane()}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RegressionPayerBatches));
