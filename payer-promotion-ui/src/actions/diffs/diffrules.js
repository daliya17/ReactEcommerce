import ActionTypes from '../../constants/action-types.json';
import DiffRulesLibrary from '../../lib/DiffRulesLibrary.js';
import Popup from '../../lib/popup';
import * as Services from '../../services';
import { handleApiError } from '../errorhandler.js';

export const fetchDiffRules = () => dispatch => {
  Services.fetchDiffRules()
    .then(diffRules => {
      // load the diff rules library and populate the payer name
      DiffRulesLibrary.initialize(diffRules);
      // filter the rules that are not deleted
      const notdeleted = diffRules.filter(b => !b.deleted);

      dispatch({
        type: ActionTypes.UPDATEDIFFRULES,
        diffRules: notdeleted
      });
    })
    .catch(error => {
      handleApiError(error, 'An error occurred while fetching the diff rules');
    });
};

export const deleteDiffRule = diffRuleId => dispatch => {
  Popup.showLoading('Deleting diff rule');
  Services.deleteDiffRule(diffRuleId)
    .then(id => {
      Popup.hideLoading();
      dispatch(fetchDiffRules());
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(error, 'An error occured while deleting the diff rule');
    });
};
