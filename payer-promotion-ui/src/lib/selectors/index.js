import Lib from '../index';
import Path from '../path';
import PayersLibrary from '../PayersLibrary';
import remitAdviceFormat from '../../constants/RemitAdviceFormat';

function getAllRegressions(state) {
  return state.views.regressions.data || [];
}

function getSelectedRegressionPayers(state) {
  const regressionsView = state.views.regressions;
  const {
    data: regressions,
    regressionPayers = {},
    selectedRegressionIndex,
    selectedRegressionPayerIndex,
    selectedPayerFormatTabIndex,
    selectedBatchFormatTabIndex
  } = regressionsView;
  const regressionId = Lib.getRegressionId(
    regressions,
    selectedRegressionIndex
  );
  regressionPayers[regressionId] = regressionPayers[regressionId] || {};

  return {
    regressionId,
    selectedRegression: regressions[selectedRegressionIndex] || {},
    payers: regressionPayers[regressionId]['payers'] || [],
    payerList: regressionPayers[regressionId]['payerList'] || [],
    selectedRegressionIndex,
    selectedRegressionPayerIndex,
    selectedPayerFormatTabIndex,
    selectedBatchFormatTabIndex
  };
}

function getSelectedRegressionPayerBatches(state) {
  const regressionsView = state.views.regressions;

  const {
    regressionPayerBatches = {},
    selectedRegressionPayerBatchIndex
  } = regressionsView;

  // regressions/payer/payment batches path
  const {
    regressionId,
    selectedRegression,
    payerList,
    selectedRegressionPayerIndex,
    selectedPayerFormatTabIndex,
    selectedBatchFormatTabIndex
  } = getSelectedRegressionPayers(state);

  const payerId = Lib.getPayerId(payerList, selectedRegressionPayerIndex);

  return {
    regressionId,
    payerId,
    selectedRegression,
    selectedPayer: payerList[selectedRegressionPayerIndex] || {},
    batches:
      regressionPayerBatches[batchSelectorKey(regressionId, payerId)] || [],
    selectedPayerRegressionIndex: -1,
    selectedRegressionPayerIndex,
    selectedRegressionPayerBatchIndex,
    selectedPayerFormatTabIndex,
    selectedBatchFormatTabIndex
  };
}

function getSelectedComparison(state) {
  const { data: comparisons } = state.views.comparisons;
  const {
    regressionId,
    payerId,
    batches,
    selectedRegression,
    selectedPayer,
    selectedBatchFormatTabIndex,
    selectedRegressionPayerBatchIndex
  } = getSelectedRegressionPayerBatches(state);

  const rows = getSelectedTypeByFormat(batches, selectedBatchFormatTabIndex);
  const paymentBatchIdentifier = Lib.getBatchIdentifier(
    rows,
    selectedRegressionPayerBatchIndex
  );
  return {
    regressionId,
    payerId,
    paymentBatchIdentifier,
    selectedRegression,
    selectedPayer,
    selectedRegressionPayerBatchIndex,
    comparisonResult:
      comparisons[
        batchComparisonSelectorKey(
          regressionId,
          payerId,
          paymentBatchIdentifier
        )
      ] || {}
  };
}

function batchSelectorKey(regressionId, payerId) {
  return regressionId + '-' + payerId;
}

function batchComparisonSelectorKey(
  regressionId,
  payerId,
  paymentBatchIdentifier
) {
  return regressionId + '-' + payerId + '-' + paymentBatchIdentifier;
}

function createRegression(state) {
  const createRegressionForm = state.forms.createRegression || {};
  const payerSelections = {};

  const { payers = {} } = createRegressionForm;
  Object.keys(payers).forEach(index => {
    payerSelections[index] = payers[index].all ? 1 : 0;
  });

  return {
    payerOptions: PayersLibrary.getPayerOptions(),
    name: createRegressionForm.name,
    type: createRegressionForm.type,
    routeToVendor: createRegressionForm.routeToVendor,
    vendor: createRegressionForm.vendor,
    reasonCode: createRegressionForm.reasonCode,
    selectedPayerIndex: createRegressionForm.selectedPayerIndex,
    payerSelections,
    batchUpload: createRegressionForm.batchUpload,
    batchCount: createRegressionForm.batchCount
  };
}

function createRegressionSelectPayerPaymentBatches(state) {
  const createRegressionForm = state.forms.createRegression || {};
  const selectedPayerIndex = createRegressionForm.selectedPayerIndex;
  const regressionPayers = createRegressionForm.payers || {};
  const regressionPayer = regressionPayers[selectedPayerIndex];
  const payerId = Lib.getPayerId(state.payers, selectedPayerIndex);
  const payersView = state.views.payers || {};
  const payerBatches = Lib.getPayerBatchesOptions(
    payersView.payerBatches[payerId]
  );
  let selectedBatches = {};

  if (payerBatches && regressionPayer) {
    if (regressionPayer.all) {
      payerBatches.forEach((p, index) => {
        selectedBatches[index] = 1;
      });
    } else {
      selectedBatches = regressionPayer.selected;
    }
  }

  return {
    selectedPayerIndex,
    payerId,
    payerName: PayersLibrary.getPayerName(payerId),
    payerBatches,
    selectedBatches
  };
}

function regressionReportDrillDown(state, props) {
  const regressionsView = state.views.regressions;
  const regressionId = Path.getSelectedRegression();
  const { report: reports } = regressionsView;
  const report = reports[regressionId] || {};
  const status = props.status || '';
  const statusCategory = props.statusCategory;
  const statusName = props.statusName;
  let batches = [];

  if (props.category === 'score') {
    const categoryReport = report.batches || [];
    const bucketReport =
      categoryReport.filter(row => row.id === props.id)[0] || {};
    batches = bucketReport.batches || [];
  } else if (props.category === 'status') {
    const categoryReport = report.statusCategory || [];

    props.statusName
      ? categoryReport.forEach(row => {
          row.statusCategory === props.statusCategory &&
            row.children.forEach(child => {
              child.batches.forEach(
                batch =>
                  batch.status === props.statusName && batches.push(batch)
              );
            });
          return batches;
        })
      : categoryReport.forEach(row => {
          row.statusCategory === props.statusCategory &&
            row.children.forEach(child => {
              child.batches.forEach(batch => batches.push(batch));
            });
          return batches;
        });
  } else {
    const category = props.category + 's' || '';

    const categoryReport = report[category] || [];
    const statusReport =
      categoryReport.filter(row => row.id === props.id)[0] || {};
    batches = statusReport[status] || [];
  }

  let selectedIndex = -1;
  for (let i = 0; i < batches.length; i++) {
    if (batches[i].batchId === props.batchId) {
      selectedIndex = i;
      break;
    }
  }

  return {
    batches,
    drilldown: {
      category: props.category,
      id: props.id,
      status,
      statusCategory,
      statusName
    },
    selectedIndex,
    regressionId
  };
}

function getSelectedTypeByFormat(array, index) {
  if (array === undefined || array.length === 0) {
    return [];
  }
  if (index === 0) {
    return array[remitAdviceFormat.ANSI835] || [];
  }
  if (index === 1) {
    return array[remitAdviceFormat.JSON] || [];
  }

  return array[remitAdviceFormat.Null] || [];
}

function getBatchesToDisplay(batches, index, isInSidePane) {
  if (isInSidePane) {
    return batches[remitAdviceFormat.JSON] || [];
  }

  return getSelectedTypeByFormat(batches, index);
}
export default {
  getAllRegressions,
  getSelectedRegressionPayers,
  getSelectedRegressionPayerBatches,
  getSelectedComparison,
  createRegressionSelectPayerPaymentBatches,
  createRegression,
  batchSelectorKey,
  batchComparisonSelectorKey,
  regressionReportDrillDown,
  getSelectedTypeByFormat,
  getBatchesToDisplay
};
