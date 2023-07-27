import ActionTypes from '../constants/action-types.json';
import initialState from '../store/default-store';

export default (payers = initialState.views.payers, action) => {
  const handlers = {
    [ActionTypes.UPDATEPAYERSELECTION]: () => ({
      ...payers,
      selectedPayerIndex: action.index
    }),
    [ActionTypes.UPDATEPAYERBATCHES]: () => ({
      ...payers,
      payerBatches: {
        ...payers.payerBatches,
        [action.payerId]: action.batches
      }
    })
  };

  const handler = handlers[action.type];

  return handler ? handler() : payers;
};
