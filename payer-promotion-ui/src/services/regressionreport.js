import Endpoints from '../constants/endpoints.json';
import Logger from '../lib/logger';
import Request from '../lib/request';
import RegressionReportSchema from '../schema/regressionreport';
import RegressionDiffsSchema from '../schema/diffs/regressiondiffs';
import Lib from '../lib';
import FieldStatuses from '../constants/FieldStatuses';

export function generateRegressionReport(regressionId) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000);
    });
  }

  const url = Request.replaceUrlParams(Endpoints.generateRegressionReport, {
    regressionId
  });
  return Request.post(url);
}

export function getRegressionReport(regressionId) {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      resolve({});
    });
  } else {
    const url = Request.replaceUrlParams(Endpoints.getRegressionReport, {
      regressionId
    });
    promise = Request.get(url);
  }

  return promise.then(report => {
    const schemaValidation = RegressionReportSchema.validate(report);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "getRegressionReport api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the regressions response from the server"
      );
    }

    return report;
  });
}

export function getRegressionDiffs(
  regressionId,
  fieldName,
  categoryId,
  status
) {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      const count = Lib.randomIntFromInterval(100, 2000);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: '2433435343435343' + i,
            batch: i + 1000 + 'A' + (i + 600),
            payerId: i + 1,
            categoryId: (i % 6) - 1,
            status: Object.values(FieldStatuses)[i % 5],
            claimId: i % 2 === 0 ? i + 8766 + 'V' + (i + 600) : null,
            chargeId: i % 4 === 0 ? 40000 + i + '' : null,
            batchExceptionId: i % 3 === 0 ? 'TEST' : null,
            fieldName: 'FIELD ' + (i % 20),
            notes: i % 5 === 0 ? 'auto generated' : null
          };
        })
      );
    });
  } else {
    const url =
      Request.replaceUrlParams(Endpoints.getRegressionDiffs, {
        regressionId
      }) +
      Request.constructQueryParams({
        fieldName,
        categoryId,
        status
      });
    promise = Request.get(url);
  }

  return promise.then(diffs => {
    const schemaValidation = RegressionDiffsSchema.validate(diffs);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "getRegressionDiffs api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the regression diffs response from the server"
      );
    }

    return diffs;
  });
}
