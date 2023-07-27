import { clearTableData } from '../components/table/reduxtableactions';
import ActionTypes from '../constants/action-types.json';
import Strings from '../constants/strings.json';
import lib from '../lib';
import Path from '../lib/path';
import * as Services from '../services';
import { handleApiError } from './errorhandler.js';
import PayersLibrary from '../lib/PayersLibrary';
import Popup from '../lib/popup';

export const fetchPayers = () => dispatch => {
  Services.fetchPayers()
    .then(payers => {
      payers = payers.sort((a, b) => {
        return (a.payerName || '')
          .toLowerCase()
          .localeCompare(b.payerName || '');
      });

      PayersLibrary.initialize(payers);

      dispatch({
        type: ActionTypes.UPDATEPAYERS,
        payers
      });

      dispatch(setSelectedPayerFromPath());
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while trying to fetch the payers'
      );
    });
};

export const fetchPayerBatches = payerId => dispatch => {
  Services.fetchPayerBatches(payerId)
    .then(batches => {
      dispatch({
        type: ActionTypes.UPDATEPAYERBATCHES,
        payerId,
        batches
      });
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while fetching the batches for payer ' + payerId
      );
    });
};

export const updatePayerSelection = index => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.UPDATEPAYERSELECTION,
    index
  });
  dispatch(clearTableData(Strings.payerBatchesTable));
};

export const resetPayerSelection = () => dispatch => {
  dispatch(updatePayerSelection(-1));
};

const setSelectedPayerFromPath = () => (dispatch, getState) => {
  const payerId = Path.getSelectedPayer();
  if (payerId > 0) {
    const { payers } = getState();
    const selectedPayerIndex = lib.getPayerIndex(payers, payerId);
    dispatch(updatePayerSelection(selectedPayerIndex));
  }
};

export const addPayers = payerList => dispatch => {
  Popup.showLoading('Adding Payers...\nPlease wait');
  Services.addPayers(payerList)
    .then(response => {
      Popup.hideLoading();
      let alertResponse = '';
      if (!response.error) {
        alertResponse = 'Sucessfully added ' + response.ids.length + ' payers.';
      } else {
        alertResponse = 'Error while adding payers!!!';
      }
      Popup.alert(alertResponse);

      // refresh the payer list
      dispatch(fetchPayers());
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(error, 'An error occurred while adding payers');
    });
};
