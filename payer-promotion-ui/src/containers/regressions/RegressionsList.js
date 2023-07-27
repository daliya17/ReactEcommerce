import { Button, withStyles, Select } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/regressions';
import Path from '../../lib/path';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import Lib from '../../lib';
import { getScoreColumns, TableHeader } from './scoreColumns';
import Endpoints from '../../constants/endpoints.json';
import popup from '../../lib/popup';
import { generateReport } from '../../actions/regressionreport';
import Request from '../../lib/request';
import { displayDate } from '../../components/displayDate';
import { RegressionStartRangeOptions } from '../../actions/regressions';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const regressionsView = state.views.regressions;
  return {
    regressions: regressionsView.data || [],
    fromRange:
      regressionsView.fromRange || RegressionStartRangeOptions[0].value,
    selectedRegressionIndex: regressionsView.selectedRegressionIndex,
    ...props
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchRegressions: ActionCreators.fetchRegressions,
      updateRegressionSelection: ActionCreators.updateRegressionSelection,
      generateReport
    },
    dispatch
  );
}

const styles = {
  button: {
    margin: '20px'
  }
};

class RegressionsList extends React.Component {
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

  handleSelection = index => {
    if (index !== this.props.selectedRegressionIndex) {
      this.props.updateRegressionSelection(index);
      // Once the regression is selected, set the path to regression path
      const { regressions } = this.props;
      const regressionId = Lib.getRegressionId(regressions, index);
      Path.redirect(Path.getRegressionPayersPath(regressionId));
    }
  };

  isInSidePane() {
    return Path.getSelectedRegression() > -1;
  }

  getColumnDefinitions() {
    let definitions = [
      {
        id: 'id',
        numeric: true,
        label: 'Id',
        disablePadding: this.isInSidePane(),
        width: '20px'
      },
      { id: 'name', label: 'Name', filterable: true }
    ];

    // additional columns when regressions are shown in the right pane
    if (!this.isInSidePane()) {
      definitions = [
        ...definitions,
        {
          id: 'created',
          label: 'Created',
          render: row => displayDate(row.created)
        },
        { id: 'createdBy', label: 'Created By' },
        { id: 'type', label: 'Type', filterable: true },
        { id: 'reasonCode', label: 'Reason', filterable: true }
      ];
    }

    definitions = [
      ...definitions,
      ...getScoreColumns(!this.isInSidePane()),
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

    return definitions;
  }

  handleReportGeneration = indexes => {
    const index = indexes[0];
    const { regressions } = this.props;
    const regressionId = Lib.getRegressionId(regressions, index);

    this.props.generateReport(regressionId, () => {
      popup.alert('Report generation for the regression has been triggered');
    });
  };

  handleViewReport = indexes => {
    const index = indexes[0];
    const { regressions } = this.props;
    const regressionId = Lib.getRegressionId(regressions, index);

    Path.redirect(Path.getRegressionReportsPath(regressionId));
  };

  handleViewDiffs = indexes => {
    const index = indexes[0];
    const { regressions } = this.props;
    const regressionId = Lib.getRegressionId(regressions, index);

    Path.redirect(Path.getRegressionDiffsPath(regressionId));
  };

  handleDownloadReport = indexes => {
    const index = indexes[0];
    const { regressions } = this.props;
    const regressionId = Lib.getRegressionId(regressions, index);

    const url = Request.replaceUrlParams(Endpoints.downloadRegressionReport, {
      regressionId
    });
    const downloadUrl = Path.getStaticFilePath(url);
    window.open(downloadUrl);
  };

  isViewReportDisabled = indexes => {
    const { regressions } = this.props;
    const index = indexes[0];
    return !(regressions[index] && regressions[index].hasReport);
  };

  isDownloadReportDisabled = indexes => {
    const { regressions } = this.props;
    const index = indexes[0];
    return !(regressions[index] && regressions[index].hasExcelReport);
  };

  getActions() {
    if (!this.actions) {
      if (this.isInSidePane()) this.actions = [];
      else {
        this.actions = [
          {
            id: 'generatereport',
            label: 'Generate Report',
            selectionType: 'single',
            handler: this.handleReportGeneration
          },
          {
            id: 'viewdiffs',
            label: 'View Diffs',
            selectionType: 'single',
            handler: this.handleViewDiffs
          },
          {
            id: 'viewreport',
            label: 'View Report',
            selectionType: 'single',
            handler: this.handleViewReport,
            disabled: this.isViewReportDisabled
          },
          {
            id: 'downloadreport',
            label: 'Download Report',
            selectionType: 'single',
            handler: this.handleDownloadReport,
            disabled: this.isDownloadReportDisabled
          }
        ];
      }
    }
    return this.actions;
  }

  handleFromRangeChange = event => {
    this.props.fetchRegressions(event.target.value);
  };

  renderRegressionFromRange = () => {
    const { fromRange } = this.props;
    return (
      <Select
        native
        id="range"
        name="range"
        onChange={this.handleFromRangeChange}
        value={fromRange}
      >
        {RegressionStartRangeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  };

  renderNewRegressionButton = () => {
    const { classes } = this.props;
    return (
      <Link to={Path.NewRegressionRoute} className="link">
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          {'New Regression'}
        </Button>
      </Link>
    );
  };

  render() {
    const { regressions, selectedRegressionIndex, fromRange } = this.props;

    const regressionFromRange = this.isInSidePane()
      ? {}
      : {
          filterable: true,
          addable: true,
          addFromRangeComponent: this.renderRegressionFromRange
        };

    const additionalProps = this.isInSidePane()
      ? {}
      : {
          filterable: true,
          addable: true,
          addComponent: this.renderNewRegressionButton
        };

    const selected =
      selectedRegressionIndex >= 0 ? [selectedRegressionIndex] : [];

    return (
      <div className="scrollable" ref={this.setScroller}>
        <ReduxTable
          className="dense-padding"
          name={Strings.regressionsTable}
          actions={this.getActions()}
          columns={this.getColumnDefinitions()}
          rows={regressions}
          title="Regressions"
          selected={selected}
          onSelect={this.handleSelection}
          {...regressionFromRange}
          {...additionalProps}
          selectedRowRef={this.setSelectedRow}
          order="desc"
          orderBy="id"
          refreshable
          onRefresh={() => this.props.fetchRegressions(fromRange)}
          highlightAlternateRow={!this.isInSidePane()}
        />
      </div>
    );
  }
}

RegressionsList.propTypes = {
  classes: PropTypes.object.isRequired,
  regressions: PropTypes.array.isRequired,
  fromRange: PropTypes.string.isRequired,
  selectedRegressionIndex: PropTypes.number.isRequired,
  fetchRegressions: PropTypes.func.isRequired,
  updateRegressionSelection: PropTypes.func.isRequired,
  generateReport: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RegressionsList));
