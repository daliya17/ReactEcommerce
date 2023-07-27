import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Path from '../../../lib/path';
import { fetchRegressionDiffs } from '../../../actions/regressionreport';
import { Grid } from '@material-ui/core';
import RegressionDiffsTable from './RegressionDiffsTable';
import BatchComparisonThroughReport from './BatchComparisonThroughReport';
import Lib from '../../../lib';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const regressionsView = state.views.regressions;
  const { diffs = {}, data: regressions } = regressionsView;
  const regressionId = Path.getSelectedRegression();
  const index = Lib.getRegressionIndex(regressions, regressionId);
  const regressionName = (regressions[index] || {}).name;

  const urlSearchParams = new URLSearchParams(
    window.location.href.split('?')[1]
  );
  const fieldName = urlSearchParams.get('fieldName');
  const categoryId = urlSearchParams.get('categoryId');
  const status = urlSearchParams.get('status');

  const diffSelector = Lib.getRegressionDiffSelector(
    regressionId,
    categoryId,
    fieldName,
    status
  );

  return {
    regressionId,
    regressionName,
    diffs: diffs[diffSelector],
    fieldName,
    categoryId,
    status
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchRegressionDiffs
    },
    dispatch
  );
}

class RegressionDiffsViewManager extends React.Component {
  state = {
    selectedIndex: -1
  };

  componentDidMount() {
    const { diffs } = this.props;
    if (diffs.length === 0) {
      this.fetchDiffs();
    }
  }

  fetchDiffs = () => {
    const { regressionId, fieldName, categoryId, status } = this.props;
    this.props.fetchRegressionDiffs(
      regressionId,
      fieldName,
      categoryId,
      status
    );
  };

  handleDiffSelection = index => {
    this.setState({
      selectedIndex: index
    });
  };

  renderDiffs() {
    const {
      regressionId,
      regressionName,
      diffs,
      fieldName,
      categoryId,
      status
    } = this.props;

    return (
      <RegressionDiffsTable
        isInLeftPane={this.state.selectedIndex >= 0}
        regressionId={regressionId}
        regressionName={regressionName}
        diffs={diffs}
        fieldName={fieldName}
        categoryId={categoryId}
        status={status}
        selectedIndex={this.state.selectedIndex}
        fetchRegressionDiffs={this.fetchDiffs}
        onDiffSelection={this.handleDiffSelection}
      />
    );
  }

  getSelectedDiff() {
    const { diffs, regressionId } = this.props;
    const { selectedIndex } = this.state;

    if (selectedIndex >= 0) {
      const diff = diffs[selectedIndex];

      return {
        ...diff,
        regressionId
      };
    }

    return {};
  }

  render() {
    const { selectedIndex } = this.state;
    const diff = this.getSelectedDiff();

    const drillDownMode = selectedIndex >= 0;
    const leftPane = drillDownMode ? 3 : 0;
    const rightPane = drillDownMode ? 9 : 12;

    return (
      <Grid className={'splitcontainer'} container spacing={24}>
        {drillDownMode && (
          <Grid className={'pane leftpane'} item sm={leftPane}>
            {this.renderDiffs()}
          </Grid>
        )}
        <Grid className={'pane rightpane'} item sm={rightPane}>
          {!drillDownMode && this.renderDiffs()}
          {drillDownMode && (
            <BatchComparisonThroughReport
              regressionId={diff.regressionId}
              payerId={diff.payerId}
              paymentBatchIdentifier={diff.batch}
              drillDownDiffId={diff.id}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

RegressionDiffsViewManager.defaultProps = {
  diffs: []
};

RegressionDiffsViewManager.propTypes = {
  regressionName: PropTypes.string,
  regressionId: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  categoryId: PropTypes.string,
  status: PropTypes.string,
  diffs: PropTypes.array.isRequired,
  fetchRegressionDiffs: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegressionDiffsViewManager);
