import ActionTypes from '../../constants/action-types.json';
import logger from '../../lib/logger.js';
import Popup from '../../lib/popup.js';
import * as DiffCategorizationServices from '../../services/diffcategorization';
import DiffCategoriesLibrary from '../../lib/DiffCategoriesLibrary.js';
import { handleApiError } from '../errorhandler.js';
import { fetchBatchComparisonResult } from '../comparisons.js';

export const handleCategorization = (
  categorizationInfo,
  isBulkCategorization,
  batchComparisonInfo,
  successCallback
) => dispatch => {
  if (isBulkCategorization) {
    dispatch(
      updateBulkCategorization(
        categorizationInfo,
        batchComparisonInfo,
        successCallback
      )
    );
  } else {
    // in the case of categorization of a single diff
    // let the user don't wait for the response from the server
    // so do immediate success callback, error cases are handled differently
    const { diffId, diffCategoryId, notes } = categorizationInfo;
    dispatch(updateDiffCategorization(diffId, diffCategoryId, notes));
    successCallback();
  }
};

/**
 * This action is called when the user choose other than the default level
 * while categorising a diff. This patches the info to the server and wait
 * for the response and refresh the comparisons result
 * @param {object} categorizationInfo
 * @param {function} successCallback
 */
export const updateBulkCategorization = (
  categorizationInfo,
  batchComparisonInfo,
  successCallback
) => dispatch => {
  Popup.showLoading('Applying the categorization.');

  // push the changes to the server
  DiffCategorizationServices.updateBulkCategorization(categorizationInfo)
    .then(response => {
      Popup.hideLoading();
      Popup.alert('Updated ' + response.count + ' diffs');
      successCallback();

      // refresh the comparison result to reflect the bulk categorization
      const {
        regressionId,
        payerId,
        paymentBatchIdentifier
      } = batchComparisonInfo;
      dispatch(
        fetchBatchComparisonResult(
          regressionId,
          payerId,
          paymentBatchIdentifier
        )
      );
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while applying the categorization',
        response => {
          if (
            response.message &&
            response.message.toString().match(/duplicate/i)
          )
            return 'Similar rule already exists';
        }
      );
    });
};

/**
 * When a user categorize a diff, then this action will be called.
 * This action pushes the update to the server and in parallel will update the store
 * A popup will be shown for retry if the server update fails
 * @param {string} diffId
 * @param {number} diffCategoryId
 * @param {string} notes
 */
export const updateDiffCategorization = (
  diffId,
  diffCategoryId,
  notes
) => dispatch => {
  // push the changes to server
  DiffCategorizationServices.updateDiffCategorization(
    diffId,
    diffCategoryId,
    notes
  )
    .then(() => {})
    .catch(error => {
      logger.log('Error while trying to save the diff categorization', error);
      Popup.confirm(
        'An error occurred while trying to save the diff categorization. \nDo you want to retry?',
        value => {
          if (value)
            dispatch(updateDiffCategorization(diffId, diffCategoryId, notes));
          else
            Popup.alert(
              'Your changes might not be saved. Please refresh the page to view the saved changes.'
            );
        }
      );
    });
  // update in redux store
  dispatch(updateDiffToStore(diffId, diffCategoryId, notes));
};

const updateDiffToStore = (diffId, diffCategoryId, notes) => (
  dispatch,
  getState
) => {
  const state = getState();
  let diffs = state.views.comparisons.data.diffs || {};
  const diffCategory =
    DiffCategoriesLibrary.getDiffCategory(diffCategoryId) || {};

  diffs = {
    ...diffs,
    [diffId]: {
      ...(diffs[diffId] || {}),
      category: diffCategory.name,
      status: diffCategory.status,
      description: diffCategory.description,
      notes
    }
  };

  dispatch({
    type: ActionTypes.UPDATEDIFFTOSTORE,
    diffs
  });
};
