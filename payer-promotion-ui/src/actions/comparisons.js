import { cloneDeep } from 'lodash';
import ActionTypes from '../constants/action-types.json';
import ComparisonsAnalyzer from '../lib/ComparisonsAnalyzer.js';
import Popup from '../lib/popup.js';
import * as ComparisonsServices from '../services/comparisons';
import { handleApiError } from './errorhandler.js';
import DiffsProcessor from '../lib/DiffsProcessor.js';

export const fetchBatchComparisonResult = (
  regressionId,
  payerId,
  paymentBatchIdentifier
) => dispatch => {
  Popup.showLoading('Fetching the comparison details');
  ComparisonsServices.fetchBatchComparisonResult(
    regressionId,
    payerId,
    paymentBatchIdentifier
  )
    .then(comparisonResult => {
      Popup.showLoading('Analyzing the comparison details');
      const analyzer = new ComparisonsAnalyzer(comparisonResult);
      analyzer.process();
      Popup.hideLoading();

      // array of diffs are be converted to HashMap where key = diffId
      // and unnecessary fields are removed
      const diffs = DiffsProcessor.process(comparisonResult.diffs);

      dispatch({
        type: ActionTypes.UPDATEBATCHCOMPARISONRESULT,
        regressionId,
        payerId,
        paymentBatchIdentifier,
        comparisonResult,
        diffs
      });
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while fetching the comparison result for the batch ' +
          paymentBatchIdentifier +
          ' for the payer ' +
          payerId +
          ' for the regression ' +
          regressionId
      );
    });
};

export const fetchBatchAsIsJson = (
  regressionId,
  paymentBatchIdentifier
) => dispatch => {
  Popup.showLoading('Fetching the Json');
  ComparisonsServices.fetchPaymentBatchAsIsJson(
    regressionId,
    paymentBatchIdentifier
  )
    .then(asIsJson => {
      Popup.hideLoading();
      dispatch({
        type: ActionTypes.UPDATEBATCHASISJSON,
        json: asIsJson
      });
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while fetching the as is json for the batch ' +
          paymentBatchIdentifier
      );
    });
};

export const toggleKey = (key, value) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATECOMPARISONVIEWERTOGGLE,
    key,
    value
  });
};

export const handleFieldToggle = index => dispatch => {
  dispatch(
    updateFreezedFields({ [index]: 1 }, (freezedFields, fieldIndex) => {
      if (!freezedFields[fieldIndex]) freezedFields[fieldIndex] = 1;
      else delete freezedFields[fieldIndex];
    })
  );
};

export const handleFieldsMultiSelect = selectedIndexesMap => dispatch => {
  dispatch(
    updateFreezedFields(selectedIndexesMap, (freezedFields, fieldIndex) => {
      freezedFields[fieldIndex] = 1;
    })
  );
};

export const handleFieldsMultiClear = selectedIndexesMap => dispatch => {
  dispatch(
    updateFreezedFields(selectedIndexesMap, (freezedFields, fieldIndex) => {
      delete freezedFields[fieldIndex];
    })
  );
};

const updateFreezedFields = (indexes, handler) => (dispatch, getState) => {
  const comparisonsView = getState().views.comparisons;

  const freezedFields = cloneDeep(comparisonsView.freezedFields || {});

  Object.keys(indexes).forEach(index => {
    handler(freezedFields, index);
  });

  dispatch({
    type: ActionTypes.UPDATEFREEZEDFIELDS,
    freezedFields
  });
};
