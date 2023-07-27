import ActionTypes from '../constants/action-types.json';
import initialState from '../store/default-store';
import PayersViewReducer from './payers';
import RegressionsViewReducer from './regressions';
import ComparisonsViewReducer from './comparisons';
import ReduxTableReducer from '../components/table/reduxtablereducer';
import FormsReducer from './forms';

/**
 * Reducer template function
 */
export default (state = initialState, action) => {
  state = {
    ...state,
    views: {
      ...state.views,
      payers: PayersViewReducer(state.views.payers, action),
      regressions: RegressionsViewReducer(state.views.regressions, action),
      comparisons: ComparisonsViewReducer(state.views.comparisons, action)
    },
    tables: ReduxTableReducer(state.tables, action),
    forms: FormsReducer(state.forms, action)
  };

  const handlers = {
    [ActionTypes.UPDATEPAYERS]: () => ({
      ...state,
      payers: action.payers
    }),
    [ActionTypes.UPDATEBATCHASISJSON]: () => ({
      ...state,
      views: {
        ...state.views,
        asIsJson: action.json
      }
    }),
    [ActionTypes.UPDATEDIFFRULES]: () => ({
      ...state,
      views: {
        ...state.views,
        diffRules: action.diffRules
      }
    }),
    [ActionTypes.UPDATEDIFFCATEGORIES]: () => ({
      ...state,
      views: {
        ...state.views,
        diffCategories: action.diffCategories
      }
    }),
    [ActionTypes.UPDATEDIFFCATEGORIZATIONRULES]: () => ({
      ...state,
      views: {
        ...state.views,
        diffCategorizationRules: action.diffCategorizationRules
      }
    })
  };

  const handler = handlers[action.type];

  return handler ? handler() : state;
};
