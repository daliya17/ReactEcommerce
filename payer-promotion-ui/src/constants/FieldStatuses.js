const statuses = Object.freeze({
  Matched: 'SAME',
  Added: 'ADDED',
  Different: 'DIFFERENT',
  Removed: 'REMOVED',
  Ignored: 'IGNORE',
  Blank: 'BLANK'
});

export default statuses;

export const statusLabels = {};
Object.keys(statuses).forEach(key => {
  statusLabels[statuses[key]] = key;
});

export const statusTogglesMap = Object.freeze({
  [statuses.Matched]: 'showMatched',
  [statuses.Added]: 'showAdded',
  [statuses.Different]: 'showDifferent',
  [statuses.Removed]: 'showRemoved',
  [statuses.Ignored]: 'showIgnored',
  [statuses.Blank]: 'showBlanks'
});
