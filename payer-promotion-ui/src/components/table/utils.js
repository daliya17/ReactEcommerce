function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function numericDesc(a, b, orderBy) {
  return Number(b[orderBy]) - Number(a[orderBy]);
}

export function stableSort(array, cmp) {
  array.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return array;
}

export function filterData(data, filters) {
  let filtered = [];
  const filterColumns = Object.keys(filters);

  data.forEach(row => {
    const rowData = row[0];
    for (let i = 0; i < filterColumns.length; i++) {
      const filterColumn = filterColumns[i];
      const filterValue = (filters[filterColumn] !== undefined
        ? filters[filterColumn]
        : ''
      )
        .toString()
        .toLowerCase();
      const rowValue = (rowData[filterColumn] !== undefined &&
      rowData[filterColumn] !== null
        ? rowData[filterColumn]
        : ''
      )
        .toString()
        .toLowerCase();

      if (rowValue.indexOf(filterValue) < 0) return false;
    }

    filtered.push(row);
  });

  return filtered;
}

export function indexedData(data) {
  return data.map((el, index) => [el, index]);
}

export function getColumnById(columns = [], id) {
  for (let i = 0; i < columns.length; i++) {
    if ((columns[i] || {}).id === id) return columns[i];
  }
}

export function getSorting(order, orderBy, isNumeric) {
  if (isNumeric) {
    return order === 'desc'
      ? (a, b) => numericDesc(a, b, orderBy)
      : (a, b) => -numericDesc(a, b, orderBy);
  }

  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

export function isSelectable(actions) {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index];
    if (
      action.selectionType === 'single' ||
      action.selectionType === 'multiple'
    )
      return true;
  }
  return false;
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
