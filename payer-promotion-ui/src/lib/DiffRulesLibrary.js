import PayersLibrary from './PayersLibrary';

/**
 * This module exports a singleton object that contains the diff rules.
 * This object is initialized everytime the diff rules are fetched from the server
 */
class DiffRulesLibrary {
  diffRules = [];
  diffRulesMap = {};

  initialize(diffRules = []) {
    this.diffRules = diffRules;
    this.diffRules.forEach(diffRule => {
      diffRule.payerName = PayersLibrary.getPayerName(diffRule.payerId);
      this.diffRulesMap[diffRule.id] = diffRule;
    });
  }

  getDiffRules() {
    return this.diffRules;
  }

  getDiffRule(id) {
    return this.diffRulesMap[id];
  }
}

export default new DiffRulesLibrary();
