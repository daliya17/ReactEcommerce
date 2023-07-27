import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchReport } from '../../../actions/regressionreport';
import Path from '../../../lib/path';
import BatchComparisonThroughReport from './BatchComparisonThroughReport';
import DrillDownView from './DrillDownView';
import ReportTables from './ReportTables';
/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state) {
  const regressionsView = state.views.regressions;
  const { report } = regressionsView;
  const regressionId = Path.getSelectedRegression();

  return {
    regressionId,
    reportAvailable: !!report[regressionId]
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchReport
    },
    dispatch
  );
}

class RegressionReports extends React.Component {
  static defaultProps = {};

  componentDidMount() {
    if (!this.props.reportAvailable && this.props.regressionId)
      this.fetchReport();
  }

  fetchReport = () => {
    const { regressionId } = this.props;
    this.props.fetchReport(regressionId);
  };

  getParamsFromLocation() {
    const urlSearchParams = new URLSearchParams(
      window.location.href.split('?')[1]
    );
    return {
      category: urlSearchParams.get('category'),
      id: urlSearchParams.get('id'),
      status: urlSearchParams.get('status'),
      batchId: urlSearchParams.get('batchId'),
      payerId: urlSearchParams.get('payerId'),
      statusCategory: urlSearchParams.get('statusCategory'),
      statusName: urlSearchParams.get('statusName')
    };
  }

  render() {
    const {
      category,
      id,
      status,
      batchId,
      payerId,
      statusCategory,
      statusName
    } = this.getParamsFromLocation();

    let drillDownMode = category && id && status;
    drillDownMode = drillDownMode || (category && statusCategory);
    const { regressionId } = this.props;

    const leftPane = drillDownMode ? 3 : 0;
    const rightPane = drillDownMode ? 9 : 12;

    return (
      <Grid className={'splitcontainer'} container spacing={24}>
        {drillDownMode && (
          <Grid className={'pane leftpane'} item sm={leftPane}>
            <DrillDownView
              category={category}
              id={id}
              status={status}
              batchId={batchId}
              statusCategory={statusCategory}
              statusName={statusName}
            />
          </Grid>
        )}
        <Grid className={'pane rightpane'} item sm={rightPane}>
          {!batchId && <ReportTables fetchReport={this.fetchReport} />}
          {batchId && (
            <BatchComparisonThroughReport
              regressionId={regressionId}
              payerId={payerId}
              paymentBatchIdentifier={batchId}
              drillDownStatus={status}
              drillDownCategory={category}
              drillDownValue={id}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

RegressionReports.propTypes = {
  reportAvailable: PropTypes.bool.isRequired,
  regressionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  fetchReport: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegressionReports);
