import Endpoints from '../constants/endpoints.json';
import Lib from '../lib';
import Logger from '../lib/logger';
import Request from '../lib/request';
import DiffRulesSchema from '../schema/diffrules';
import PayerBatchesSchema from '../schema/payerbatches';
import PayersSchema from '../schema/payers';
import RegressionPayerBatchesSchema, {
  batchStatuses
} from '../schema/regressionpayerbatches';
import RegressionPayersSchema from '../schema/regressionpayers';
import RegressionsSchema from '../schema/regressions';

function getMockPercentages() {
  const percentages = {
    matchedPercentage: Lib.randomIntFromInterval(10, 80),
    addedPercentage: Lib.randomIntFromInterval(10, 50),
    differentPercentage: Lib.randomIntFromInterval(1, 50),
    removedPercentage: Lib.randomIntFromInterval(1, 50),
    ignoredPercentage: Lib.randomIntFromInterval(1, 50),
    blankPercentage: Lib.randomIntFromInterval(1, 50),
    postingRegressionDiffsCount: Lib.randomIntFromInterval(1, 30)
  };
  percentages.score =
    percentages.matchedPercentage + percentages.addedPercentage;
  return percentages;
}

export function fetchPayers() {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 200);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: i + 1,
            payerId: i + 1,
            payerName: 'payer ' + i,
            promoted: '12/11/2018'
          };
        })
      );
    });
  }

  return Request.get(Endpoints.getPayers).then(payers => {
    const output = PayersSchema.validate(payers);

    if (!output.valid) {
      const error = output.error || {};
      Logger.log(
        "fetchPayers api call response doesn't match schema. \n" +
          error.message +
          '\nat ' +
          error.dataPath
      );
      throw new Error("Couldn't validate the payers response from the server");
    }

    return payers;
  });
}

export function fetchPayerBatches(payerId) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 200);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: i + 1,
            batchId: i + 1000,
            contextId: i + 600,
            created: '12/11/2018',
            createdBy: 'testUser'
          };
        })
      );
    });
  }

  const url = Request.replaceUrlParams(Endpoints.getPayerBatches, { payerId });

  return Request.get(url).then(batches => {
    const schemaValidation = PayerBatchesSchema.validate(batches);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchPayerBatches api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the payer batches response from the server"
      );
    }

    return batches;
  });
}

export function startRegression(regressionData) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ id: 12 }), 5000);
    });
  }

  return Request.post(Endpoints.startRegression, regressionData);
}

export function fetchAllRegressions(fromDate) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 200);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: i + 1,
            name: 'regression ' + i,
            created: '12/11/2018',
            createdBy: 'testUser',
            ...getMockPercentages(),
            hasReport: i % 4 === 0
          };
        })
      );
    });
  }
  const url =
    Endpoints.getRegressions +
    Request.constructQueryParams({
      fromdate: fromDate
    });
  return Request.get(url).then(regressions => {
    const schemaValidation = RegressionsSchema.validate(regressions);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchAllRegressions api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the regressions response from the server"
      );
    }

    return regressions;
  });
}

export function addPaymentBatches(payerId, paymentbatches) {
  const url = Request.replaceUrlParams(Endpoints.addPayerBatches, { payerId });
  return Request.post(url, paymentbatches);
}

export function initiatePosting(regressionId, regressionDataIds) {
  const url = Request.replaceUrlParams(Endpoints.initiatePosting, {
    regressionId
  });
  return Request.post(url, { regressionDataIds });
}

export function fetchRegressionPayers(regressionId) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 50);
      const remitAdviceFormat = ['ANSI835', 'JSON', null];
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            payerId: i + 1,
            payerName: 'payer ' + i,
            totalBatches: Lib.randomIntFromInterval(1, 200),
            completedBatches: Lib.randomIntFromInterval(1, 200),
            remitAdviceFormat:
              remitAdviceFormat[Lib.randomIntFromInterval(0, 2)],
            ...getMockPercentages()
          };
        })
      );
    });
  }

  const url = Request.replaceUrlParams(Endpoints.getRegressionPayers, {
    regressionId
  });
  return Request.get(url).then(payers => {
    const schemaValidation = RegressionPayersSchema.validate(payers);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchRegressionPayers api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the regression payers response from the server"
      );
    }

    return payers;
  });
}

export function fetchRegressionPayerBatches(regressionId, payerId) {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 50);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          const total = Lib.randomIntFromInterval(10, 50);
          const remitAdviceFormat = ['ANSI835', 'JSON', null];
          const batchStatus = batchStatuses[Lib.randomIntFromInterval(0, 3)];
          return {
            batchId: i + 1000,
            contextId: i + 600,
            ...getMockPercentages(),
            regressionDataId: i,
            totalFields: total,
            matchedFields: total - Lib.randomIntFromInterval(1, total - 10),
            status: batchStatus,
            regressionBatchStatus: batchStatus,
            remitAdviceFormat:
              remitAdviceFormat[Lib.randomIntFromInterval(0, 2)],
            analysis: 'COMPLETED'
          };
        })
      );
    });
  }

  const url = Request.replaceUrlParams(Endpoints.getRegressionPayerBatches, {
    regressionId,
    payerId
  });
  return Request.get(url).then(batches => {
    const schemaValidation = RegressionPayerBatchesSchema.validate(batches);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchRegressionPayerBatches api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the regression payer batches response from the server"
      );
    }

    return batches;
  });
}

export function fetchDiffRules() {
  if (process.env.REACT_APP_MOCK_API) {
    return new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 50);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: i,
            created: '11/11/2018',
            fieldName: 'Field ' + i,
            paymentBatchId: i % 3 === 0 ? i + 1000 + 'A' + (i + 600) : '',
            payerId: i % 3 === 1 ? Lib.randomIntFromInterval(1, 50) : null,
            isGlobal: i % 3 === 2,
            notes: 'testing'
          };
        })
      );
    });
  }

  return Request.get(Endpoints.getDiffRules).then(diffRules => {
    const schemaValidation = DiffRulesSchema.validate(diffRules);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchDiffRules api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the diff rules response from the server"
      );
    }

    return diffRules;
  });
}

export function deleteDiffRule(diffRuleId) {
  const url = Request.replaceUrlParams(Endpoints.deleteDiffRule, {
    diffRuleId
  });
  return Request.deleteRequest(url);
}

export function addPayers(payerList) {
  return Request.post(Endpoints.addPayers, payerList);
}

export function addRegressionPayerBatchNotes(
  regressionId,
  regressionDataIds,
  notes
) {
  const url = Request.replaceUrlParams(Endpoints.addRegressionPayerBatchNotes, {
    regressionId
  });
  return Request.post(url, { regressionDataIds, notes });
}

export function recordRegressionPayerBatchAnalysis(
  regressionId,
  regressionDataIds,
  analysis
) {
  const url = Request.replaceUrlParams(
    Endpoints.recordRegressionPayerBatchAnalysis,
    {
      regressionId
    }
  );
  return Request.post(url, { regressionDataIds, analysis });
}
