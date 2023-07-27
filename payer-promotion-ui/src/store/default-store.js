const defaultStore = {
  payers: [],
  views: {
    payers: {
      selectedPayerIndex: -1,
      payerBatches: {}
    },
    regressions: {
      selectedRegressionIndex: -1,
      data: [],
      report: {},
      diffs: {},
      selectedRegressionPayerIndex: -1,
      regressionPayers: {},
      selectedRegressionPayerBatchIndex: -1,
      regressionPayerBatches: {},
      selectedPayerFormatTabIndex: 0,
      selectedBatchFormatTabIndex: 0
    },
    comparisons: {
      showMatched: false,
      showAdded: true,
      showDifferent: true,
      showRemoved: true,
      showIgnored: false,
      showBlanks: false,
      showPercentage: false,
      isExpanded: false,
      data: {},
      freezedFields: {}
    },
    asIsJson: null,
    diffRules: [],
    diffCategories: [],
    diffCategorizationRules: []
  },
  forms: {
    createRegression: {
      name: '',
      routeToVendor: false,
      reasonCode: '',
      vendor: '',
      payers: {},
      selectedPayerIndex: -1
    }
  }
};

export default defaultStore;
