import ActionTypes from '../../constants/action-types.json';
import Popup from '../../lib/popup.js';
import * as DiffCategorizationServices from '../../services/diffcategorization';
import { handleApiError } from '../errorhandler.js';
import DiffCategoriesLibrary from '../../lib/DiffCategoriesLibrary.js';
import { fetchDiffCategorizationRules } from './categorizationrules.js';

/**
 * Fetches all the diff categories from the server and loads the store
 */
export const fetchDiffCategories = alsoFetchCategorizationRules => dispatch => {
  DiffCategorizationServices.fetchDiffCategories()
    .then(diffCategories => {
      // load the diff categories library with all
      DiffCategoriesLibrary.initialize(diffCategories);
      // pick categories not deleted
      const notDeleted = diffCategories.filter(b => !b.deleted);

      dispatch({
        type: ActionTypes.UPDATEDIFFCATEGORIES,
        diffCategories: notDeleted
      });

      // during the initial page load, fetch the diff categorization rules only after
      // diff catgories are fetched, as the diff category name needs to be populated
      // in the rule
      if (alsoFetchCategorizationRules) {
        dispatch(fetchDiffCategorizationRules());
      }
    })
    .catch(error => {
      handleApiError(error, 'An error occurred while fetching diff categories');
    });
};

/**
 * Deletes the diff category in the server and initiates the fetch diff categories
 * @param {number} diffCategoryId
 */
export const deleteDiffCategory = diffCategoryId => dispatch => {
  Popup.showLoading('Deleting the diff category');
  DiffCategorizationServices.deleteDiffCategory(diffCategoryId)
    .then(id => {
      Popup.hideLoading();
      dispatch(fetchDiffCategories());
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while deleting the diff category'
      );
    });
};

/**
 * Adds or Updates a diff category to the server and initiates the fetch diff categories
 * @param {object} diffCategory
 * @param {func} callback
 */
export const saveDiffCategory = (diffCategory, callback) => dispatch => {
  Popup.showLoading('Saving diff category');
  DiffCategorizationServices.saveDiffCategory(diffCategory)
    .then(id => {
      Popup.hideLoading();
      dispatch(fetchDiffCategories());
      callback();
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(error, 'An error occurred while saving the diff category');
    });
};
