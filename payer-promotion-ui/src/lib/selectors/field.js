import { statusTogglesMap } from '../../constants/FieldStatuses';
import FieldsLibrary from '../FieldsLibrary';

export const select = (state, props) => {
  const comparisonsView = state.views.comparisons || {};
  let field = props.field;

  // if field has diffId, then merge the diff info with the field
  if (field.diffId) {
    const diffId = field.diffId;
    const diffs = (comparisonsView.data || {}).diffs || {};
    const diff = diffs[diffId];

    if (diff) {
      const fieldStatus = field.stat;
      const diffStatus = diff.status;

      field = {
        ...field,
        // if diff category has a status, the move the fieldstatus to originalStatus
        // and set the field status as diff category status
        originalStatus: diffStatus ? fieldStatus : undefined,
        stat: diffStatus ? diffStatus : fieldStatus,
        diff
      };
    }
  }

  const fieldStatus = field.stat;
  const isShownByStatus = comparisonsView[statusTogglesMap[fieldStatus]];
  const isFreezed = FieldsLibrary.isFreezed(
    comparisonsView.freezedFields,
    field.id
  );

  return {
    isVisible: isShownByStatus || isFreezed,
    field
  };
};
