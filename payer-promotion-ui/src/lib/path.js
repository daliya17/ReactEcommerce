const PUBLIC_URL = process.env.PUBLIC_URL;
const PayersRoute = '/payers';
const RegressionsRoute = '/regressions';
const RegressionReportRoute = '/regressions/:regressionId/reports';
const DiffRulesRoute = '/diffrules';
const SelectedPayerRoute = '/payers/:payerId';
const PayerPaymentBatchesRoute = '/payers/:payerId/paymentbatches';
const NewRegressionRoute = '/regressions/new';
const RegressionPayersRoute = '/regressions/:regressionId/payers';
const RegressionPayerBatchesRoute =
  '/regressions/:regressionId/payers/:payerId/paymentbatches';
const RegressionPayerBatchComparisonsRoute =
  '/regressions/:regressionId/payers/:payerId/paymentbatches/:paymentBatchIdentifier/comparisons';
const RegressionPayerBatchComparisonsJsonRoute =
  '/regressions/:regressionId/payers/:payerId/paymentbatches/:paymentBatchIdentifier/comparisons/json';
const PaymentBatchPdfPath =
  PUBLIC_URL + '/api/v1/contexts/:contextId/paymentbatches/:batchId/pdf';
const DiffCategoriesRoute = '/diffcategories';
const RegressionDiffsRoute = '/regressions/:regressionId/diffs';
const DiffCategorizationRulesRoute = '/bulkdiffcategorizations';

function getCurrentPath() {
  return document.location.pathname;
}

function redirect(path) {
  if (window.dispatchEvent) {
    const redirectEvent = new CustomEvent('router-redirect', {
      detail: { redirectTo: path }
    });
    window.dispatchEvent(redirectEvent);
  }
}

function isJsonRoute() {
  return !!getCurrentPath().match(
    /\/regressions\/\d+\/payers\/\d+\/paymentbatches\/[aA\d]+\/comparisons\/json/gi
  );
}

function isPayersRoute() {
  return getCurrentPath()
    .replace(PUBLIC_URL, '')
    .match(/^[/]+payers/);
}

function isRegressionsRoute() {
  return getCurrentPath()
    .replace(PUBLIC_URL, '')
    .match(/^[/]+regressions/);
}

function isDiffRulesRoute() {
  return getCurrentPath()
    .replace(PUBLIC_URL, '')
    .match(/^[/]+diffrules/);
}

function isDiffCategoriesRoute() {
  return getCurrentPath()
    .replace(PUBLIC_URL, '')
    .match(/^[/]+diffcategories/);
}

function isDiffCategorizationRulesRoute() {
  return getCurrentPath()
    .replace(PUBLIC_URL, '')
    .match(/^[/]+bulkdiffcategorizations/);
}

function getRegressionDiffsPath(regressionId) {
  return RegressionDiffsRoute.replace(':regressionId', regressionId);
}

function getPayerPath(payerId) {
  return PayerPaymentBatchesRoute.replace(':payerId', payerId);
}

function getSelectedPayer() {
  const path = getCurrentPath();
  const matches = path.match(/\/payers\/(\d+)/);
  if (matches && isPayersRoute()) {
    return matches[1];
  }

  return -1;
}

/************************************************
 * Regression
 ************************************************/

function getSelectedRegression() {
  const path = getCurrentPath();
  const matches = path.match(/\/regressions\/(\d+)/);
  if (matches) {
    return matches[1];
  }

  return -1;
}

function getRegressionPayersPath(regressionId) {
  return RegressionPayersRoute.replace(':regressionId', regressionId);
}

function getRegressionPayerBatchesPath(regressionId, payerId) {
  return RegressionPayerBatchesRoute.replace(
    ':regressionId',
    regressionId
  ).replace(':payerId', payerId);
}

function getRegressionReportsPath(regressionId) {
  return RegressionReportRoute.replace(':regressionId', regressionId);
}

/************************************************
 * Regression Payer
 ************************************************/
function getSelectedRegressionPayer() {
  const path = getCurrentPath();
  const matches = path.match(/\/regressions\/\d+\/payers\/(\d+)/);
  if (matches) {
    return matches[1];
  }
  return -1;
}

function getNavigatedBatchesPath(regressionId, payerId) {
  return RegressionPayerBatchesRoute.replace(
    ':regressionId',
    regressionId
  ).replace(':payerId', payerId);
}

/************************************************
 * Regression Payer Batch
 ************************************************/
function getSelectedRegressionPayerBatch() {
  const path = getCurrentPath();
  const matches = path.match(
    /\/(regressions|payers)\/\d+\/(regressions|payers)\/\d+\/paymentbatches\/([aA\d]+)/
  );
  if (matches) {
    return matches[3];
  }
  return '';
}

/************************************************
 * Batch Comparison
 ************************************************/

function getNavigatedBatchComparisonsPath(
  regressionId,
  payerId,
  paymentBatchIdentifier
) {
  return RegressionPayerBatchComparisonsRoute.replace(
    ':regressionId',
    regressionId
  )
    .replace(':payerId', payerId)
    .replace(':paymentBatchIdentifier', paymentBatchIdentifier);
}

/************************************************
 * JSON
 ************************************************/

function getBatchComparisonsJsonPath(
  regressionId,
  payerId,
  paymentBatchIdentifier
) {
  const navigatedPath = RegressionPayerBatchComparisonsJsonRoute;
  return navigatedPath
    .replace(':regressionId', regressionId)
    .replace(':payerId', payerId)
    .replace(':paymentBatchIdentifier', paymentBatchIdentifier);
}

/************************************************
 * pdf
 ************************************************/
function getBatchPdfPath(paymentBatchIdentifier) {
  const splits = paymentBatchIdentifier.split(/[aA]/);
  return PaymentBatchPdfPath.replace(':contextId', splits[1]).replace(
    ':batchId',
    splits[0]
  );
}

function getStaticFilePath(filePath) {
  if (PUBLIC_URL) {
    const basePath = PUBLIC_URL.toString().replace(/\/$/, '');
    filePath = filePath.toString().replace(/^\//, '');
    return basePath + '/' + filePath;
  }
  return filePath;
}

export default {
  redirect,
  getCurrentPath,
  isPayersRoute,
  isRegressionsRoute,
  isDiffRulesRoute,
  DiffRulesRoute,
  isJsonRoute,
  getPayerPath,
  getSelectedPayer,
  getSelectedRegression,
  getRegressionPayersPath,
  getRegressionPayerBatchesPath,
  getSelectedRegressionPayer,
  getNavigatedBatchesPath,
  getSelectedRegressionPayerBatch,
  getNavigatedBatchComparisonsPath,
  getStaticFilePath,
  PayersRoute,
  RegressionsRoute,
  SelectedPayerRoute,
  PayerPaymentBatchesRoute,
  NewRegressionRoute,
  RegressionPayersRoute,
  RegressionPayerBatchesRoute,
  RegressionPayerBatchComparisonsRoute,
  RegressionPayerBatchComparisonsJsonRoute,
  getBatchComparisonsJsonPath,
  getBatchPdfPath,
  RegressionReportRoute,
  getRegressionReportsPath,
  DiffCategoriesRoute,
  isDiffCategoriesRoute,
  RegressionDiffsRoute,
  getRegressionDiffsPath,
  DiffCategorizationRulesRoute,
  isDiffCategorizationRulesRoute
};
