import Popup from '../lib/popup';
import * as Services from '../services';
import { handleApiError } from './errorhandler';
import { fetchPayerBatches } from './payers';
import * as PaymentbatchServices from '../services/paymentbatches';

export const addPaymentBatches = (payerId, paymentbatchlist) => dispatch => {
  Popup.showLoading('Adding Paymentbatches..\nPlease wait');
  Services.addPaymentBatches(payerId, paymentbatchlist)
    .then(response => {
      Popup.hideLoading();
      let alertResponse = '';
      if (!response.error) {
        alertResponse =
          'Sucessfully added ' + response.ids.length + ' paymentbatches.';
      } else {
        alertResponse = 'Error while adding paymentbatches!!!';
      }
      Popup.alert(alertResponse);

      // refresh the paymentbatch list
      dispatch(fetchPayerBatches(payerId));
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(error, 'An error occurred while adding paymentbatches');
    });
};

export const refreshPaymentBatchFiles = (paymentBatches, callback) => () => {
  PaymentbatchServices.refreshFiles(paymentBatches)
    .then(response => {
      callback();
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while triggering the reset of abp'
      );
    });
};

export const hidePaymentBatchFiles = (payerId, paymentBatches) => dispatch => {
  PaymentbatchServices.hideFiles(payerId, paymentBatches)
    .then(response => {
      Popup.hideLoading();
      let alertResponse = '';
      if (!response.error) {
        alertResponse =
          'Sucessfully hidden ' + response.ids.length + ' paymentbatches.';
      } else {
        alertResponse = 'Error while hiding paymentbatches!!!';
      }
      Popup.alert(alertResponse);

      dispatch(fetchPayerBatches(payerId));
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while hiding the payment batches'
      );
    });
};
