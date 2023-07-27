import Endpoints from '../constants/endpoints.json';
import Logger from '../lib/logger';
import Request from '../lib/request';
import FieldStatuses from '../constants/FieldStatuses';
import DiffCategoriesSchema from '../schema/diffs/categories';
import DiffCategorizationRulesSchema from '../schema/diffs/categorizationrules';
import Lib from '../lib';

export function fetchDiffCategories() {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      const types = ['AHS Issues', 'Orbo Issues', 'To be fixed', 'Ignorable'];
      resolve(
        Array.apply(null, { length: types.length }).map((f, i) => {
          return {
            id: i + 1,
            created: '03/11/2019',
            name: types[i],
            status: i === 2 ? null : Object.values(FieldStatuses)[i % 6],
            description: 'Test type'
          };
        })
      );
    });
  } else {
    promise = Request.get(Endpoints.getDiffCategories);
  }

  promise.then(diffCategories => {
    const schemaValidation = DiffCategoriesSchema.validate(diffCategories);

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchDiffCategories api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the diff categories response from the server"
      );
    }

    return diffCategories;
  });

  return promise;
}

export function deleteDiffCategory(diffCategoryId) {
  const url = Request.replaceUrlParams(Endpoints.deleteDiffCategory, {
    diffCategoryId
  });
  return Request.deleteRequest(url);
}

export function saveDiffCategory(diffCategory) {
  const url = diffCategory.id
    ? Request.replaceUrlParams(Endpoints.updateDiffCategory, {
        diffCategoryId: diffCategory.id
      })
    : Endpoints.addDiffCategory;

  return Request.post(url, diffCategory);
}

export function updateDiffCategorization(diffId, diffCategoryId, notes) {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      resolve({
        id: diffId
      });
    });
  } else {
    const url = Request.replaceUrlParams(Endpoints.updateDiffCategorization, {
      diffId
    });
    promise = Request.post(url, {
      diffCategoryId,
      notes
    });
  }

  return promise;
}

export function updateBulkCategorization(categorizationInfo) {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      resolve({
        count: Lib.randomIntFromInterval(1, 20)
      });
    });
  } else {
    const url = Endpoints.updateBulkCategorization;
    promise = Request.patch(url, categorizationInfo);
  }

  return promise;
}

export function fetchDiffCategorizationRules() {
  let promise;
  if (process.env.REACT_APP_MOCK_API) {
    promise = new Promise(resolve => {
      const count = Lib.randomIntFromInterval(10, 200);
      resolve(
        Array.apply(null, { length: count }).map((f, i) => {
          return {
            id: i + 1,
            created: '04/11/2019',
            fieldName: 'Field ' + i,
            isGlobal: i % 3 === 1,
            payerId: i % 3 !== 1 ? Lib.randomIntFromInterval(1, 50) : null,
            notes: 'testing',
            diffCategoryId: Lib.randomIntFromInterval(1, 4),
            deleted: i * 7 === 1 ? '05/06/2019' : null
          };
        })
      );
    });
  } else {
    promise = Request.get(Endpoints.getDiffCategorizationRules);
  }

  promise.then(diffCategorizationRules => {
    const schemaValidation = DiffCategorizationRulesSchema.validate(
      diffCategorizationRules
    );

    if (!schemaValidation.valid) {
      const error = schemaValidation.error || {};
      Logger.log(
        "fetchDiffCategorizationRules api call response doesn't match schema. \n" +
          error.message +
          '\nat' +
          error.dataPath
      );
      throw new Error(
        "Couldn't validate the diff categorization rules response from the server"
      );
    }

    return diffCategorizationRules;
  });

  return promise;
}

export function deleteDiffCategorizationRule(diffCategorizationRuleId) {
  const url = Request.replaceUrlParams(Endpoints.deleteDiffCategorizationRule, {
    diffCategorizationRuleId
  });
  return Request.deleteRequest(url);
}
