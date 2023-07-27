import ActionTypes from '../constants/action-types.json';
import initialState from '../store/default-store';
import Selector from '../lib/selectors';

export default (regressions = initialState.views.regressions, action) => {
  const handlers = {
    [ActionTypes.UPDATEREGRESSIONSELECTION]: () => ({
      ...regressions,
      selectedRegressionIndex: action.index,
      selectedPayerFormatTabIndex: 0
    }),
    [ActionTypes.UPDATEREGRESSIONS]: () => ({
      ...regressions,
      data: action.regressions
    }),
    [ActionTypes.UPDATEFROMRANGE]: () => ({
      ...regressions,
      fromRange: action.fromRange
    }),

    [ActionTypes.UPDATEREGRESSIONPAYERSELECTION]: () => ({
      ...regressions,
      selectedRegressionPayerIndex: action.index
    }),
    [ActionTypes.UPDATESELECTEDPAYERFORMATTABINDEX]: () => ({
      ...regressions,
      selectedPayerFormatTabIndex: action.index,
      selectedBatchFormatTabIndex: action.index
    }),
    [ActionTypes.UPDATEREGRESSIONPAYERS]: () => ({
      ...regressions,
      regressionPayers: {
        ...regressions.regressionPayers,
        [action.regressionId]: {
          ...(regressions.regressionPayers[action.regressionId] || {}),
          payers: action.payersByFormat,
          payerList: action.payerList
        }
      }
    }),

    [ActionTypes.UPDATEREGRESSIONPAYERBATCHES]: () => ({
      ...regressions,
      regressionPayerBatches: {
        ...regressions.regressionPayerBatches,
        [Selector.batchSelectorKey(
          action.regressionId,
          action.payerId
        )]: action.batchesByFormat
      }
    }),
    [ActionTypes.UPDATESELECTEDBATCHFORMATTABINDEX]: () => ({
      ...regressions,
      selectedBatchFormatTabIndex: action.index
    }),
    [ActionTypes.UPDATEREGRESSIONPAYERBATCHSELECTION]: () => ({
      ...regressions,
      selectedRegressionPayerBatchIndex: action.index
    }),
    [ActionTypes.UPDATEREGRESSIONREPORT]: () => ({
      ...regressions,
      report: {
        [action.regressionId]: action.report
      }
    }),
    [ActionTypes.UPDATEREGRESSIONDIFFS]: () => ({
      ...regressions,
      diffs: {
        [action.selector]: action.diffs
      }
    })
  };

  const handler = handlers[action.type];

  return handler ? handler() : regressions;
};
