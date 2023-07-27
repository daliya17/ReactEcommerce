import ActionTypes from '../constants/action-types.json';
import Popup from '../lib/popup';
import RegressionReportProcessor from '../lib/RegressionReportProcessor';
import * as Services from '../services/regressionreport';
import { handleApiError } from './errorhandler';
import DiffsProcessor from '../lib/DiffsProcessor.js';
import Lib from '../lib/index.js';

export const generateReport = (regressionId, callback) => () => {
  Popup.showLoading('Starting report generation');
  Services.generateRegressionReport(regressionId)
    .then(() => {
      Popup.hideLoading();
      callback();
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while starting the report generation for regression'
      );
    });
};

export const fetchReport = regressionId => dispatch => {
  Popup.showLoading('Fetching the regression report');
  Services.getRegressionReport(regressionId)
    .then(report => {
      Popup.showLoading('Processing the regression report');
      // Process the report and store it display friendly
      const reportProcessor = new RegressionReportProcessor(report);
      reportProcessor.process();
      Popup.hideLoading();

      dispatch({
        type: ActionTypes.UPDATEREGRESSIONREPORT,
        regressionId,
        report
      });
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while fetching the regression report',
        response => {
          if (response && (response.message || '').match(/couldn't find/i))
            return 'Regression report not found. Report might not be generated yet.';
        }
      );
    });
};

export const fetchRegressionDiffs = (
  regressionId,
  fieldName,
  categoryId,
  status
) => dispatch => {
  Popup.showLoading('Fetching the diffs');
  Services.getRegressionDiffs(regressionId, fieldName, categoryId, status)
    .then(diffs => {
      Popup.hideLoading();

      // each diff is added with additional info
      // like payerName from payerId
      // diffCategoryName from categoryId
      DiffsProcessor.populate(diffs);

      dispatch({
        type: ActionTypes.UPDATEREGRESSIONDIFFS,
        selector: Lib.getRegressionDiffSelector(
          regressionId,
          categoryId,
          fieldName,
          status
        ),
        diffs
      });
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while fetching the regression diffs'
      );
    });
};
