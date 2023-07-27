import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchBatchComparisonResult,
  toggleKey
} from '../../../actions/comparisons';
import { statusTogglesMap } from '../../../constants/FieldStatuses';
import Selector from '../../../lib/selectors';
import BatchComparisons from '../../comparisons/BatchComparisons';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const batchComparisonSelectorKey = Selector.batchComparisonSelectorKey(
    props.regressionId,
    props.payerId,
    props.paymentBatchIdentifier
  );
  const { data: comparisons = {}, ...statuses } = state.views.comparisons;
  const comparisonResult = comparisons[batchComparisonSelectorKey] || {};

  return {
    comparisonsExists: Object.keys(comparisonResult).length > 0,
    ...statuses,
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
      fetchBatchComparisonResult,
      toggleKey
    },
    dispatch
  );
}

class BatchComparisonThroughReport extends React.Component {
  static defaultProps = {};

  componentDidMount() {
    const toggleKey = statusTogglesMap[this.props.drillDownStatus];
    if (!this.props[toggleKey]) {
      this.props.toggleKey(toggleKey, true);
    }
    this.checkForComparisonsResult();
  }

  componentDidUpdate() {
    this.checkForComparisonsResult();
  }

  checkForComparisonsResult() {
    const {
      comparisonsExists,
      regressionId,
      payerId,
      paymentBatchIdentifier,
      fetchBatchComparisonResult
    } = this.props;

    if (
      !comparisonsExists &&
      regressionId &&
      payerId &&
      paymentBatchIdentifier
    ) {
      fetchBatchComparisonResult(regressionId, payerId, paymentBatchIdentifier);
    }
  }

  render() {
    const {
      regressionId,
      payerId,
      paymentBatchIdentifier,
      fetchBatchComparisonResult,
      drillDownCategory,
      drillDownStatus,
      drillDownValue,
      drillDownDiffId
    } = this.props;

    return (
      <BatchComparisons
        regressionId={regressionId}
        payerId={payerId}
        paymentBatchIdentifier={paymentBatchIdentifier}
        drillDownCategory={drillDownCategory}
        drillDownStatus={drillDownStatus}
        drillDownValue={drillDownValue}
        drillDownDiffId={drillDownDiffId}
        fetchBatchComparisonResult={fetchBatchComparisonResult}
      />
    );
  }
}

BatchComparisonThroughReport.propTypes = {
  regressionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  payerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  paymentBatchIdentifier: PropTypes.string.isRequired,
  drillDownCategory: PropTypes.string,
  drillDownStatus: PropTypes.string,
  drillDownValue: PropTypes.string,
  drillDownDiffId: PropTypes.string,
  comparisonsExists: PropTypes.bool.isRequired,
  fetchBatchComparisonResult: PropTypes.func.isRequired,
  toggleKey: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchComparisonThroughReport);
