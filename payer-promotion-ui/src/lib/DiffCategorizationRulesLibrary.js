import DiffCategoriesLibrary from './DiffCategoriesLibrary';
import PayersLibrary from './PayersLibrary';

/**
 * This module exports a singleton object that holds the diff categorization rules.
 * This object is initialized everytime the diff categorization rules are
 * fetched from the server
 */
class DiffCategorizationRulesLibrary {
  diffCategorizationRules = [];
  diffCategorizationRulesMap = {};

  initialize(diffCategorizationRules = []) {
    this.diffCategorizationRules = diffCategorizationRules;
    this.diffCategorizationRules.forEach(diffCategorizationRule => {
      diffCategorizationRule.diffCategoryName = DiffCategoriesLibrary.getCategoryName(
        diffCategorizationRule.diffCategoryId
      );
      diffCategorizationRule.payerName = PayersLibrary.getPayerName(
        diffCategorizationRule.payerId
      );
      this.diffCategorizationRulesMap[
        diffCategorizationRule.id
      ] = diffCategorizationRule;
    });
  }

  getRuleById(id) {
    return this.diffCategorizationRulesMap[id];
  }
}

export default new DiffCategorizationRulesLibrary();
