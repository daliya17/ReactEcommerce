import { clearTableData } from '../components/table/reduxtableactions';
import ActionTypes from '../constants/action-types.json';
import Strings from '../constants/strings.json';
import Lib from '../lib';
import Path from '../lib/path';
import Selector from '../lib/selectors';
import * as Services from '../services';
import { handleApiError } from './errorhandler.js';
import {
  fetchRegressionPayerBatches,
  resetRegressionPayerBatchSelection
} from './regressionpayerbatches';

export const fetchRegressionPayers = regressionId => dispatch => {
  Services.fetchRegressionPayers(regressionId)
    .then(payers => {
      const payersByFormat = Lib.parseContentByFormat(payers);
      // to 2 decimal precision
      Object.keys(payersByFormat).forEach(format => {
        payersByFormat[format].forEach(payer => {
          Lib.calculateScore(payer);
          payer.errorBatches =
            payer.totalBatches -
            payer.completedBatches -
            payer.regressionQueuedCount;
        });
      });

      const payerList = Lib.getPayerList(payers);

      dispatch({
        type: ActionTypes.UPDATEREGRESSIONPAYERS,
        regressionId,
        payersByFormat,
        payerList
      });

      dispatch(setSelectedRegressionPayerFromPath());
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while fetching the payers for the regression ' +
          regressionId
      );
    });
};

/**
 * Here we update the selected payer index and also fetch
 * the payment batches for the selected payer.
 */
export const updateRegressionPayerSelection = index => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.UPDATEREGRESSIONPAYERSELECTION,
    index
  });
  dispatch(clearTableData(Strings.regressionPayerBatchesTable));

  if (index >= 0) {
    const state = getState();
    const {
      batches,
      regressionId,
      payerId
    } = Selector.getSelectedRegressionPayerBatches(state);
    if (batches.length === 0) {
      dispatch(fetchRegressionPayerBatches(regressionId, payerId));
    }
  }
};

export const resetRegressionPayerSelection = () => dispatch => {
  dispatch(updateRegressionPayerSelection(-1));
  dispatch(resetRegressionPayerBatchSelection());
};

const setSelectedRegressionPayerFromPath = () => (dispatch, getState) => {
  const payerId = Path.getSelectedRegressionPayer();
  if (payerId > 0) {
    const state = getState();
    const { payerList } = Selector.getSelectedRegressionPayers(state);
    const selectedRegressionPayerIndex = Lib.getPayerIndex(payerList, payerId);
    dispatch(updateRegressionPayerSelection(selectedRegressionPayerIndex));
  }
};

export const updateSelectedPayerFormatTabIndex = index => (
  dispatch,
  getState
) => {
  dispatch({
    type: ActionTypes.UPDATESELECTEDPAYERFORMATTABINDEX,
    index
  });
};
