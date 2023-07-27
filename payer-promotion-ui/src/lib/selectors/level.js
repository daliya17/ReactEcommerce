export const select = (state, props) => {
  const comparisons = state.views.comparisons || {};
  let { status, diffId } = props;

  let originalStatus, diff;
  // if the level has diffId, then merge the diff info
  // into the level
  if (diffId) {
    const diffs = (comparisons.data || {}).diffs || {};
    const diffInfo = diffs[diffId];

    if (diffInfo) {
      originalStatus = diffInfo.status ? status : undefined;
      status = diffInfo.status || status;
      diff = diffInfo;
    }
  }

  return {
    ...props,
    status,
    originalStatus,
    diff,
    isExpanded: comparisons.isExpanded,
    showPercentage: comparisons.showPercentage
  };
};
