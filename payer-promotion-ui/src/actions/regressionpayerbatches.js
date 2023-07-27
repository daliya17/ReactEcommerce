import ActionTypes from '../constants/action-types.json';
import Lib from '../lib';
import Path from '../lib/path';
import Popup from '../lib/popup';
import Selector from '../lib/selectors';
import * as Services from '../services';
import { fetchBatchComparisonResult } from './comparisons';
import { handleApiError } from './errorhandler.js';
import Endpoints from '../constants/endpoints.json';
import Request from '../lib/request';

export const fetchRegressionPayerBatches = (
  regressionId,
  payerId
) => dispatch => {
  Services.fetchRegressionPayerBatches(regressionId, payerId)
    .then(batches => {
      const batchesByFormat = Lib.parseContentByFormat(batches);
      Object.keys(batchesByFormat).forEach(format => {
        const batchList = batchesByFormat[format];
        batchList.forEach(batch => {
          Lib.calculateScore(batch);
          batch.paymentBatchIdentifier = batch.batchId + 'A' + batch.contextId;
        });
      });

      dispatch({
        type: ActionTypes.UPDATEREGRESSIONPAYERBATCHES,
        regressionId,
        payerId,
        batchesByFormat
      });

      dispatch(setSelectedRegressionPayerBatchFromPath());
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while fetching the batches for the payer ' +
          payerId +
          ' for the regression ' +
          regressionId
      );
    });
};

export const updateRegressionPayerBatchSelection = index => (
  dispatch,
  getState
) => {
  dispatch({
    type: ActionTypes.UPDATEREGRESSIONPAYERBATCHSELECTION,
    index
  });

  if (index >= 0) {
    const state = getState();
    const {
      regressionId,
      payerId,
      paymentBatchIdentifier,
      comparisonResult
    } = Selector.getSelectedComparison(state);
    if (Object.keys(comparisonResult).length === 0) {
      dispatch(
        fetchBatchComparisonResult(
          regressionId,
          payerId,
          paymentBatchIdentifier
        )
      );
    }
  }
};

export const initiatePosting = (
  regressionId,
  payerId,
  regressionDataIds
) => dispatch => {
  Popup.showLoading('Initiating Posting..\nPlease wait');
  Services.initiatePosting(regressionId, regressionDataIds)
    .then(response => {
      Popup.hideLoading();
      let alertResponse = '';
      if (!response.error) {
        alertResponse =
          'Sucess: ' +
          response.successBatches.length +
          ' batches.\n\n' +
          'Failed:  ' +
          response.failureBatches.length +
          ' batches.';
      } else {
        alertResponse = 'Error while initiating posting';
      }
      Popup.alert(alertResponse);

      // refresh the payment batch list
      dispatch(fetchRegressionPayerBatches(regressionId, payerId));
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(error, 'An error occurred while initiating posting');
    });
};

export const viewPostingResult = (
  regressionId,
  payerId,
  paymentBatchIdentifier
) => dispatch => {
  const url = Request.replaceUrlParams(Endpoints.viewPostingResult, {
    regressionId,
    payerId,
    paymentBatchIdentifier
  });
  const finalurl = Path.getStaticFilePath(url);
  window.open(finalurl);
  dispatch(fetchRegressionPayerBatches(regressionId, payerId));
};

export const viewMera = (
  regressionId,
  payerId,
  paymentBatchIdentifier
) => dispatch => {
  const url = Request.replaceUrlParams(Endpoints.viewMera, {
    regressionId,
    paymentBatchIdentifier
  });
  const finalurl = Path.getStaticFilePath(url);
  window.open(finalurl);
};

export const viewSupplementData = (
  regressionId,
  payerId,
  paymentBatchIdentifier
) => dispatch => {
  const url = Request.replaceUrlParams(Endpoints.viewSupplementData, {
    regressionId,
    paymentBatchIdentifier
  });
  const finalurl = Path.getStaticFilePath(url);
  window.open(finalurl);
};

export const viewBatchPDF = (
  regressionId,
  payerId,
  paymentBatchIdentifier
) => dispatch => {
  const url = Path.getBatchPdfPath(paymentBatchIdentifier);
  window.open(url);
};

export const viewPayer = (
    regressionId,
    payerId,
    paymentBatchIdentifier
) => dispatch => {
  const url = Request.replaceUrlParams(Endpoints.viewIdentifiedPayer, {
    regressionId,
    paymentBatchIdentifier
  });
  const finalurl = Path.getStaticFilePath(url);
  window.open(finalurl);
};

export const resetRegressionPayerBatchSelection = () => (
  dispatch,
  getState
) => {
  const { selectedPayerFormatTabIndex } = Selector.getSelectedRegressionPayers(
    getState()
  );
  dispatch(updateRegressionPayerBatchSelection(-1));
  dispatch(updateSelectedBatchFormatTabIndex(selectedPayerFormatTabIndex));
};

const setSelectedRegressionPayerBatchFromPath = () => (dispatch, getState) => {
  const paymentBatchIdentifier = Path.getSelectedRegressionPayerBatch();
  if (paymentBatchIdentifier) {
    const state = getState();
    const { batches } = Selector.getSelectedRegressionPayerBatches(state);
    const selectedRegressionPayerBatchIndex = Lib.getBatchIndex(
      batches,
      paymentBatchIdentifier
    );
    dispatch(
      updateRegressionPayerBatchSelection(selectedRegressionPayerBatchIndex)
    );
  }
};

export const updateSelectedBatchFormatTabIndex = index => dispatch => {
  dispatch({
    type: ActionTypes.UPDATESELECTEDBATCHFORMATTABINDEX,
    index
  });
};

export const addRegressionPayerBatchNotes = (regressionDataIds, notes) => (
  dispatch,
  getState
) => {
  const { regressionId, payerId } = Selector.getSelectedRegressionPayerBatches(
    getState()
  );

  Services.addRegressionPayerBatchNotes(regressionId, regressionDataIds, notes)
    .then(response => {
      if (response.error) {
        Popup.alert('Error while adding notes');
      }

      // refresh the payment batch list
      dispatch(fetchRegressionPayerBatches(regressionId, payerId));
    })
    .catch(error => {
      handleApiError(error, 'An error occurred while adding notes');
    });
};

export const recordRegressionPayerBatchAnalysis = (
  regressionDataIds,
  analysis
) => (dispatch, getState) => {
  const { regressionId, payerId } = Selector.getSelectedRegressionPayerBatches(
    getState()
  );

  Services.recordRegressionPayerBatchAnalysis(
    regressionId,
    regressionDataIds,
    analysis
  )
    .then(response => {
      if (response.error) {
        Popup.alert('Error while recording the analysis output');
      }

      // refresh the payment batch list
      dispatch(fetchRegressionPayerBatches(regressionId, payerId));
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occured while recording the analysis output'
      );
    });
};
