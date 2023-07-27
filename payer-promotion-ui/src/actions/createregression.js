import Path from '../lib/path';
import Popup from '../lib/popup';
import * as Services from '../services';
import { handleApiError } from './errorhandler.js';
import { handleFormValueChange, resetFormData } from './forms';
import { RegressionStartRangeOptions, fetchRegressions } from './regressions';
import { cloneDeep } from 'lodash';
import Selector from '../lib/selectors';
import Lib from '../lib';
import RandomRegressionReader from '../lib/RandomRegressionReader';

const CREATE_REGRESSION_FORM = 'createRegression';

export const handleValueChange = (key, value) => dispatch => {
  dispatch(handleFormValueChange(CREATE_REGRESSION_FORM, key, value));
};

export const startRegression = regressionData => dispatch => {
  Popup.showLoading('Starting regression\nPlease wait');
  Services.startRegression(regressionData)
    .then(response => {
      Popup.hideLoading();
      regressionData.randomBatches.length
        ? Popup.alert(
            'Successfully started the regression for ' +
              regressionData.randomBatches.length +
              ' payment bathches with id: ' +
              response.id
          )
        : Popup.alert(
            'Successfully started the regression with id: ' + response.id
          );
      // refresh the regressions list
      dispatch(fetchRegressions(RegressionStartRangeOptions[0].value));
      // navigate to the regressions page
      Path.redirect(Path.RegressionsRoute);
      // reset the form data
      dispatch(resetFormData(CREATE_REGRESSION_FORM));
    })
    .catch(error => {
      Popup.hideLoading();
      handleApiError(
        error,
        'An error occurred while trying to start the regression'
      );
    });
};

/**
 * Payers Model in store:
 *
 * payers: {
 *    [payerIndex]: {
 *        all: boolean, // indicates if all the batches from the payer is selected
 *        selected: {
 *            [batchIndex]: 1, // contains the indexes of selected batches
 *        }
 *    }
 * }
 */
export const handlePayerMultiSelect = selectedIndexesMap => (
  dispatch,
  getState
) => {
  const { forms = {} } = getState();
  const payers = cloneDeep((forms.createRegression || {}).payers) || {};

  Object.keys(selectedIndexesMap).forEach(index => {
    if (!payers[index]) {
      payers[index] = {
        all: true
      };
    }
  });

  dispatch(handleValueChange('payers', payers));
};

export const handlePayerMultiClear = selectedIndexesMap => (
  dispatch,
  getState
) => {
  const { forms = {} } = getState();
  const payers = cloneDeep((forms.createRegression || {}).payers) || {};

  Object.keys(selectedIndexesMap).forEach(index => {
    delete payers[index];
  });

  dispatch(handleValueChange('payers', payers));
  dispatch(checkPayerSelection());
};

/**
 * States:
 *    Checked: The payer is selected with all the payment batches
 *    Intermediate: The payer is selected but not all the payment batches are selected
 *    Unchecked: The payer is not selected.
 *
 * Possible state changes:
 *    Checked -> Unchecked
 *    Intermediate -> Checked
 *    Unchecked -> Checked
 */
export const handlePayerToggle = index => (dispatch, getState) => {
  const { forms = {} } = getState();
  let payers = cloneDeep((forms.createRegression || {}).payers || {});

  const payer = payers[index];
  // Checked -> Unchecked
  if (payer && payer.all) {
    delete payers[index];
    dispatch(handleValueChange('payers', payers));
    dispatch(checkPayerSelection());
    return;
  }

  // Unchecked -> Checked
  if (!payer) {
    payers[index] = {
      all: true
    };
  }
  // Intermediate -> Checked
  else {
    payers[index] = {
      all: true
    };
  }

  dispatch(handleValueChange('payers', payers));
  // highlight the payer
  dispatch(handleValueChange('selectedPayerIndex', index));
};

/**
 * If the payer is not selected, but highlighted, this will clear the highlighting
 */
const checkPayerSelection = () => (dispatch, getState) => {
  const { forms = {} } = getState();
  const { payers = {}, selectedPayerIndex } = forms.createRegression || {};

  if (!payers[selectedPayerIndex]) {
    dispatch(handleValueChange('selectedPayerIndex', -1));
  }
};

export const handlePayerHighlight = index => (dispatch, getState) => {
  const { createRegression = {} } = getState().forms;
  const { selectedPayerIndex, payers = {} } = createRegression;
  if (index === selectedPayerIndex) return;

  if (payers[index]) {
    dispatch(handleValueChange('selectedPayerIndex', index));
  } else {
    dispatch(handlePayerToggle(index));
  }
};

export const handlePayerBatchesMultiSelect = selectedIndexesMap => (
  dispatch,
  getState
) => {
  const state = getState();
  let { payers = {} } = state.forms.createRegression || {};
  let {
    payerBatches,
    selectedBatches,
    selectedPayerIndex
  } = Selector.createRegressionSelectPayerPaymentBatches(state);
  selectedBatches = {
    ...selectedBatches,
    ...selectedIndexesMap
  };

  dispatch(
    updatePayerBatches(
      payers,
      payerBatches,
      selectedBatches,
      selectedPayerIndex
    )
  );
};

export const handlePayerBatchesMultiClear = selectedIndexesMap => (
  dispatch,
  getState
) => {
  const state = getState();
  let { payers = {} } = state.forms.createRegression || {};
  let {
    payerBatches,
    selectedBatches,
    selectedPayerIndex
  } = Selector.createRegressionSelectPayerPaymentBatches(state);
  selectedBatches = cloneDeep(selectedBatches);

  Object.keys(selectedIndexesMap).forEach(index => {
    delete selectedBatches[index];
  });

  dispatch(
    updatePayerBatches(
      payers,
      payerBatches,
      selectedBatches,
      selectedPayerIndex
    )
  );
};

export const handlePayerBatchesToggle = index => (dispatch, getState) => {
  const state = getState();
  let { payers = {} } = state.forms.createRegression || {};
  let {
    payerBatches,
    selectedBatches,
    selectedPayerIndex
  } = Selector.createRegressionSelectPayerPaymentBatches(state);
  selectedBatches = cloneDeep(selectedBatches);

  if (selectedBatches[index]) delete selectedBatches[index];
  else selectedBatches[index] = 1;

  dispatch(
    updatePayerBatches(
      payers,
      payerBatches,
      selectedBatches,
      selectedPayerIndex
    )
  );
};

const updatePayerBatches = (
  payers,
  payerBatches,
  selectedBatches,
  selectedPayerIndex
) => dispatch => {
  if (Object.keys(selectedBatches).length === payerBatches.length) {
    payers = {
      ...payers,
      [selectedPayerIndex]: {
        all: true
      }
    };
  } else {
    payers = {
      ...payers,
      [selectedPayerIndex]: {
        all: false,
        selected: selectedBatches
      }
    };
  }

  dispatch(handleValueChange('payers', payers));
};

/**
 * Converts the index based payer and batch selections
 * to id based.
 *
 * payers: {
 *    [payerIndex]: {
 *        all: boolean, // indicates if all the batches from the payer is selected
 *        selected: {
 *            [batchIndex]: 1, // contains the indexes of selected batches
 *        }
 *    }
 * }
 *
 * The above model will be converted to below one
 *
 * payers: {
 *    [payerId]: {
 *        all: boolean, // indicates if all the batches from the payer is selected
 *        selected: [
 *          batchIdentifier, // contains all the selected batch ids
 *        ]
 *    }
 * }
 *
 * @param {object} state
 */
const convertPayerSelections = state => {
  const { payers: regressionPayersByIndex = {} } =
    state.forms.createRegression || {};
  const payers = state.payers || [];
  const payerBatches = state.views.payers.payerBatches;

  const regressionPayersById = {};
  Object.keys(regressionPayersByIndex).forEach(index => {
    const payerId = Lib.getPayerId(payers, index);
    const regressionPayer = regressionPayersByIndex[index];

    if (regressionPayer.all) {
      regressionPayersById[payerId] = {
        all: true,
        selected: []
      };
      return;
    }

    const thisPayerBatches = payerBatches[payerId] || [];
    if (!thisPayerBatches) {
      // eslint-disable-next-line no-console
      console.warn("couldn't find the paymentbatches for this payer");
      return;
    }

    const selectedBatches = [];
    Object.keys(regressionPayer.selected).forEach(batchIndex => {
      const batch = thisPayerBatches[batchIndex];
      if (batch) {
        selectedBatches.push(batch.batchId + 'A' + batch.contextId);
      }
    });

    if (selectedBatches.length > 0) {
      regressionPayersById[payerId] = {
        all: false,
        selected: selectedBatches
      };
    }
  });

  return regressionPayersById;
};

export const handleSave = () => (dispatch, getState) => {
  const state = getState();
  const {
    name,
    type,
    batchUpload,
    batchCount,
    routeToVendor,
    vendor,
    reasonCode
  } = state.forms.createRegression || {};

  const payers = convertPayerSelections(state);
  const randomBatches = [];

  if (name.length < 1) {
    Popup.alert('Regression Name is required');
    return;
  }

  if (!type) {
    Popup.alert('Regression Type must be selected');
    return;
  }

  switch (type) {
    case 'RANDOM': {
      if (!batchUpload) {
        Popup.alert(
          'File must be selected and there should be at least a data available'
        );
        return;
      }

      if (batchCount.length < 1) {
        Popup.alert('Batch count must be specified');
        return;
      }

      if (isNaN(batchCount) || Number(batchCount) < 1) {
        Popup.alert('Batch count must be a valid number');
        return;
      }

      if (batchUpload.length < batchCount) {
        Popup.alert('Batch count is greater than the data available');
        return;
      }

      if (!reasonCode) {
        Popup.alert('Regression Reason must be selected');
      }

      let validationMessage = RandomRegressionReader.validateRandomData(batchUpload);
      if(validationMessage)
      {
        Popup.alert(validationMessage);
        return;
      }

      let batches = RandomRegressionReader.removeDuplicate(batchUpload);
      if (batchUpload.length > batches.length) {
        Popup.alert(
          batchUpload.length - batches.length + ' duplicate batches found'
        );
      }

      RandomRegressionReader.readRandomData(batches, batchCount, randomBatches);

      break;
    }
    case 'SAMPLE':
      if (Object.keys(payers).length < 1) {
        Popup.alert(
          'At least 1 payer must be selected to start the regression'
        );
        return;
      }
      break;

    default:
  }

  if (!vendor) {
    Popup.alert('Select a vendor');
    return;
  }

  dispatch(
    startRegression({
      name,
      payers,
      routeToVendor,
      vendor,
      type,
      randomBatches,
      reasonCode
    })
  );
};
