import Endpoints from '../constants/endpoints.json';
import Logger from '../lib/logger';
import Request from '../lib/request';
import BatchComparisonResultSchema from '../schema/comparisonresult';

export function fetchBatchComparisonResult(
  regressionId,
  payerId,
  paymentBatchIdentifier
) {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      resolve({});
    });
  } else {
    const url = Request.replaceUrlParams(Endpoints.getBatchComparisonResults, {
      regressionId,
      payerId,
      paymentBatchIdentifier
    });
    promise = Request.get(url);
  }

  promise.then(comparisonResult => {
    const schemaValidation = BatchComparisonResultSchema.validate(
      comparisonResult
    );

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchBatchComparisonResult api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the batch comparison result response from the server"
      );
    }

    return comparisonResult;
  });

  return promise;
}

export function fetchPaymentBatchAsIsJson(
  regressionId,
  paymentBatchIdentifier
) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      resolve({
        test: 'testing'
      });
    });
  }
  const url = Request.replaceUrlParams(Endpoints.getBatchAsIsJson, {
    regressionId,
    paymentBatchIdentifier
  });
  return Request.get(url);
}
