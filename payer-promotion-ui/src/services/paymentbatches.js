import Endpoints from '../constants/endpoints.json';
import Request from '../lib/request';

export function refreshFiles(paymentbatches) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000);
    });
  }

  return Request.patch(Endpoints.refreshPaymentBatchFiles, paymentbatches);
}

export function hideFiles(payerId, paymentBatches) {
  const url = Request.replaceUrlParams(Endpoints.hidePayerBatches, { payerId });
  return Request.patch(url, paymentBatches);
}
