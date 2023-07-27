import ActionTypes from '../../constants/action-types.json';
import DiffCategorizationRulesLibrary from '../../lib/DiffCategorizationRulesLibrary';
import * as DiffCategorizationServices from '../../services/diffcategorization';
import { handleApiError } from '../errorhandler';
import Popup from '../../lib/popup';

/**
 * Fetches all the diff categorization rules and loads it in the library and store
 */
export const fetchDiffCategorizationRules = () => dispatch => {
  DiffCategorizationServices.fetchDiffCategorizationRules()
    .then(diffCategorizationRules => {
      // load the diff categorization rules library and populate the diff category name and payer name
      DiffCategorizationRulesLibrary.initialize(diffCategorizationRules);
      // pick the rules that are not deleted
      const notDeleted = diffCategorizationRules.filter(b => !b.deleted);

      dispatch({
        type: ActionTypes.UPDATEDIFFCATEGORIZATIONRULES,
        diffCategorizationRules: notDeleted
      });
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while fetching the bulk diff categorizations'
      );
    });
};

/**
 * Deletes the diff categorization rule in the server and initiates the fetch diff categorization rules
 * @param {number} diffCategorizationRuleId
 */
export const deleteDiffCategorizationRule = diffCategorizationRuleId => dispatch => {
  Popup.showLoading('Deleting the diff category');
  DiffCategorizationServices.deleteDiffCategorizationRule(
    diffCategorizationRuleId
  )
    .then(id => {
      Popup.hideLoading();
      dispatch(fetchDiffCategorizationRules());
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while deleting the bulk categorization'
      );
    });
};
