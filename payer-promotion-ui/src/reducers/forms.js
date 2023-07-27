import ActionTypes from '../constants/action-types.json';
import initialState from '../store/default-store';
import { cloneDeep } from 'lodash';

const handlers = {
  [ActionTypes.UPDATEFORMVALUE]: (forms, action) => ({
    ...forms,
    [action.formName]: {
      ...(forms[action.formName] || {}),
      [action.key]: action.value
    }
  }),
  [ActionTypes.RESETFORMDATA]: (forms, action) => ({
    ...forms,
    [action.formName]: cloneDeep(initialState.forms[action.formName] || {})
  })
};

export default (forms = initialState.forms, action) => {
  const handler = handlers[action.type];

  return handler ? handler(forms, action) : forms;
};
