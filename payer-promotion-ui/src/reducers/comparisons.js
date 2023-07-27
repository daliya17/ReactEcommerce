import ActionTypes from '../constants/action-types.json';
import initialState from '../store/default-store';
import Selector from '../lib/selectors';

export default (comparisons = initialState.views.comparisons, action) => {
  const handlers = {
    [ActionTypes.UPDATEBATCHCOMPARISONRESULT]: () => ({
      ...comparisons,
      data: {
        [Selector.batchComparisonSelectorKey(
          action.regressionId,
          action.payerId,
          action.paymentBatchIdentifier
        )]: action.comparisonResult,
        diffs: action.diffs
      }
    }),
    [ActionTypes.UPDATEDIFFTOSTORE]: () => ({
      ...comparisons,
      data: {
        ...comparisons.data,
        diffs: action.diffs
      }
    }),
    [ActionTypes.UPDATECOMPARISONVIEWERTOGGLE]: () => ({
      ...comparisons,
      [action.key]: action.value
    }),
    [ActionTypes.UPDATEFREEZEDFIELDS]: () => ({
      ...comparisons,
      freezedFields: action.freezedFields
    })
  };

  const handler = handlers[action.type];

  return handler ? handler() : comparisons;
};
