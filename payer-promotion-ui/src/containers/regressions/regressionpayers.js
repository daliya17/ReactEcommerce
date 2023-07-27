import { Typography, Tooltip, Tabs, Tab } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/regressionpayers';
import { resetRegressionSelection } from '../../actions/regressions';
import Path from '../../lib/path';
import Selector from '../../lib/selectors';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import Lib from '../../lib';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import { getScoreColumns, TableHeader } from './scoreColumns';
import { remitAdviceFormatLabels } from '../../constants/RemitAdviceFormat';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state) {
  return {
    ...Selector.getSelectedRegressionPayers(state)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetRegressionSelection,
      updateRegressionPayerSelection:
        ActionCreators.updateRegressionPayerSelection,
      fetchRegressionPayers: ActionCreators.fetchRegressionPayers,
      updateSelectedPayerFormatTabIndex:
        ActionCreators.updateSelectedPayerFormatTabIndex
    },
    dispatch
  );
}

class RegressionPayers extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  renderBreadcrumb() {
    const { selectedRegression } = this.props;

    return (
      <div className="breadcrumb">
        <Typography variant="body2">
          <Link
            to={Path.RegressionsRoute}
            onClick={() => this.props.resetRegressionSelection()}
          >
            {'Regressions'}
          </Link>
          {' / ' + selectedRegression.name}
        </Typography>
      </div>
    );
  }

  handleTabChange = (event, newValue) => {
    if (newValue === this.props.selectedPayerFormatTabIndex) {
      return;
    }

    this.props.updateSelectedPayerFormatTabIndex(newValue);
  };

  isInSidePane() {
    return Path.getSelectedRegressionPayer() > -1;
  }

  handleSelection = index => {
    const {
      selectedPayerFormatTabIndex,
      payers,
      payerList,
      regressionId
    } = this.props;

    var selectedPayerIndex = index;
    if (!this.isInSidePane()) {
      const payerDetails = Selector.getSelectedTypeByFormat(
        payers,
        selectedPayerFormatTabIndex
      );
      const payer = payerDetails[index];

      payerList.forEach((payerItem, payerIndex) => {
        if (payerItem['payerId'] === payer['payerId']) {
          selectedPayerIndex = payerIndex;
        }
      });
    }

    if (selectedPayerIndex !== this.props.selectedRegressionPayerIndex) {
      this.props.updateRegressionPayerSelection(selectedPayerIndex);
      // Once the regression payer is selected, set the path to the regression payer path

      const payerId = Lib.getPayerId(payerList, selectedPayerIndex);
      if (payerId > 0) {
        Path.redirect(Path.getNavigatedBatchesPath(regressionId, payerId));
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

  getFormatDetails() {
    let definitions = [...getScoreColumns(!this.isInSidePane())];

    definitions = [
      ...definitions,
      {
        id: 'otherBatchPresent',
        label: 'Other',
        filterable: true
      },
      {
        id: 'jsonBatchPresent',
        label: 'As-Is',
        filterable: true
      },
      {
        id: 'ansi835BatchPresent',
        label: 'Ansi',
        filterable: true
      }
    ];
    return definitions;
  }

  getColumnDefinitions() {
    const { selectedPayerFormatTabIndex } = this.props;
    let definitions = [
      {
        id: 'payerId',
        numeric: true,
        label: 'Payer Id',
        disablePadding: this.isInSidePane(),
        width: '20px'
      },
      { id: 'payerName', label: 'Payer Name', filterable: true }
    ];

    // additional columns when regressions are shown in the right pane
    if (!this.isInSidePane()) {
      definitions = [
        ...definitions,
        {
          id: 'totalBatches',
          label: 'No. of Batches'
        }
      ];
      if (
        Lib.getFormatByIndex(
          selectedPayerFormatTabIndex,
          remitAdviceFormatLabels['JSON']
        )
      ) {
        definitions = [
          ...definitions,
          ...getScoreColumns(!this.isInSidePane())
        ];
      }
    }

    if (
      this.isInSidePane() ||
      Lib.getFormatByIndex(
        selectedPayerFormatTabIndex,
        remitAdviceFormatLabels.ANSI835
      ) ||
      Lib.getFormatByIndex(
        selectedPayerFormatTabIndex,
        remitAdviceFormatLabels.JSON
      )
    ) {
      definitions = [
        ...definitions,
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

    if (this.isInSidePane()) {
      definitions = [...definitions, ...this.getFormatDetails()];
    }

    // additional columns when regressions are shown in the right pane
    if (!this.isInSidePane()) {
      definitions = [
        ...definitions,
        {
          id: 'errorBatches',
          label: '',
          render: this.renderHasErrors,
          width: '30px'
        }
      ];
    }

    return definitions;
  }

  renderHasErrors = row => {
    const queueStatus =
      row.regressionQueuedCount > 0
        ? row.regressionQueuedCount +
          ' payment batches from this payer has queued status. \n'
        : '';
    const errorStatus =
      row.errorBatches > 0
        ? row.errorBatches + ' payment batches from this payer has errored out.'
        : '';
    return (
      (row.errorBatches > 0 || row.regressionQueuedCount > 0) && (
        <Tooltip title={'Regression for ' + queueStatus + errorStatus}>
          <ErrorIcon color="error" />
        </Tooltip>
      )
    );
  };

  render() {
    const {
      selectedRegressionIndex,
      selectedPayerFormatTabIndex,
      selectedRegressionPayerIndex,
      payers,
      payerList,
      regressionId
    } = this.props;

    if (selectedRegressionIndex < 0) {
      return (
        <React.Fragment>
          <Typography className="margin" variant="body1">
            {'Regression not found'}
          </Typography>
        </React.Fragment>
      );
    }

    if (payers === undefined || payers.length <= 0) {
      return (
        <React.Fragment>
          <Typography className="margin" variant="body1">
            {'Regression not found'}
          </Typography>
        </React.Fragment>
      );
    }

    var rows = [];
    if (!this.isInSidePane()) {
      rows = Selector.getSelectedTypeByFormat(
        payers,
        selectedPayerFormatTabIndex
      );
    } else {
      rows = payerList;
    }

    const selected =
      selectedRegressionPayerIndex < 0 ? [] : [selectedRegressionPayerIndex];

    const formatBatchCount = Lib.getRegressionFormatPayerBatchCount(payers);

    const formatLabels = Lib.getFormatLabels(formatBatchCount);

    return (
      <React.Fragment>
        {this.renderBreadcrumb()}
        <Typography className="headline" variant="headline">
          {'Payers'}
        </Typography>
        {!this.isInSidePane() ? (
          <Tabs
            value={selectedPayerFormatTabIndex}
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
          <ReduxTable
            className={'dense-padding'}
            name={Strings.regressionPayersTable}
            columns={this.getColumnDefinitions()}
            rows={rows}
            selected={selected}
            onSelect={this.handleSelection}
            selectedRowRef={this.setSelectedRow}
            order="desc"
            orderBy=""
            filterable
            refreshable
            onRefresh={() => this.props.fetchRegressionPayers(regressionId)}
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
)(RegressionPayers);
