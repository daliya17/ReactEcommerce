import ActionTypes from '../constants/action-types.json';

export const handleFormValueChange = (formName, key, value) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATEFORMVALUE,
    formName,
    key,
    value
  });
};

export const resetFormData = formName => dispatch => {
  dispatch({
    type: ActionTypes.RESETFORMDATA,
    formName
  });
};
