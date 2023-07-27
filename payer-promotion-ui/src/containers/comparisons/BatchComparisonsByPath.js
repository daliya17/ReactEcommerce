import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBatchComparisonResult } from '../../actions/comparisons';
import Selector from '../../lib/selectors';
import BatchComparisons from './BatchComparisons';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...Selector.getSelectedComparison(state)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchBatchComparisonResult
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchComparisons);
