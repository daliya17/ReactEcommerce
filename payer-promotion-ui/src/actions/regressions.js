import { clearTableData } from '../components/table/reduxtableactions';
import ActionTypes from '../constants/action-types.json';
import Strings from '../constants/strings.json';
import Lib from '../lib';
import Path from '../lib/path';
import Selector from '../lib/selectors';
import * as Services from '../services';
import { handleApiError } from './errorhandler';
import { resetRegressionPayerBatchSelection } from './regressionpayerbatches';
import {
  fetchRegressionPayers,
  resetRegressionPayerSelection
} from './regressionpayers';
import { isNumeric } from '../components/table/utils';
import moment from 'moment';

export const RegressionStartRangeOptions = [
  { value: 'threemonths', label: 'last 3 months', dateFrom: '3' },
  { value: 'sixmonths', label: 'last 6 months', dateFrom: '6' },
  { value: 'twelvemonths', label: 'last 12 months', dateFrom: '12' },
  { value: 'all', label: 'all', dateFrom: '01/01/2019' }
];

export const fetchRegressions = fromRange => dispatch => {
  const option = RegressionStartRangeOptions.find(o => o.value === fromRange);

  const fromDate = isNumeric(option.dateFrom)
    ? moment()
        .subtract(option.dateFrom, 'months')
        .format('MM/DD/YYYY')
    : option.dateFrom;
  Services.fetchAllRegressions(fromDate)
    .then(regressions => {
      // to 2 decimal precision
      regressions.forEach(regression => Lib.calculateScore(regression));

      dispatch({
        type: ActionTypes.UPDATEREGRESSIONS,
        regressions
      });
      dispatch({
        type: ActionTypes.UPDATEFROMRANGE,
        fromRange
      });

      dispatch(setSelectedRegressionFromPath());
    })
    .catch(error => {
      handleApiError(
        error,
        'An error occurred while trying to fetch the regressions'
      );
    });
};

/**
 * Here we update the selected regression and also fetch
 * either the payers for the selected regression or paymentbatches
 * for the selected regression based on the route.
 */
export const updateRegressionSelection = index => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.UPDATEREGRESSIONSELECTION,
    index
  });

  // regressions route? clear regressionpayers table
  dispatch(clearTableData(Strings.regressionPayersTable));

  if (index >= 0) {
    const state = getState();
    // in case of regressions route fetch the payers for the selected regression
    const { payers, regressionId } = Selector.getSelectedRegressionPayers(
      state
    );
    if (payers.length === 0) {
      dispatch(fetchRegressionPayers(regressionId));
    }
  }
};

export const resetRegressionSelection = () => dispatch => {
  dispatch(updateRegressionSelection(-1));
  dispatch(resetRegressionPayerSelection());
  dispatch(resetRegressionPayerBatchSelection());
};

const setSelectedRegressionFromPath = () => (dispatch, getState) => {
  const regressionId = Path.getSelectedRegression();
  if (regressionId > 0) {
    const state = getState();
    const regressions = state.views.regressions.data;
    const selectedRegressionIndex = Lib.getRegressionIndex(
      regressions,
      regressionId
    );
    dispatch(updateRegressionSelection(selectedRegressionIndex));
  }
};
