export const ReduxTableActionTypes = {
  UPDATETABLE: 'redux-table-update'
};

function getTableData(store, tableName) {
  const tables = store.tables || {};
  return tables[tableName] || {};
}

export const clearTableData = tableName => (dispatch, getState) => {
  dispatch({
    type: ReduxTableActionTypes.UPDATETABLE,
    tableName,
    tableData: {}
  });
};

export const updateTableSort = (tableName, order, orderBy) => (
  dispatch,
  getState
) => {
  const tableData = getTableData(getState(), tableName);
  dispatch({
    type: ReduxTableActionTypes.UPDATETABLE,
    tableName,
    tableData: {
      ...tableData,
      order,
      orderBy
    }
  });
};

export const updatePageChange = (tableName, page) => (dispatch, getState) => {
  const tableData = getTableData(getState(), tableName);
  dispatch({
    type: ReduxTableActionTypes.UPDATETABLE,
    tableName,
    tableData: {
      ...tableData,
      page
    }
  });
};

export const updateRowsPerPageChange = (tableName, rowsPerPage) => (
  dispatch,
  getState
) => {
  if (parseInt(rowsPerPage, 10) >= 0) {
    const tableData = getTableData(getState(), tableName);
    dispatch({
      type: ReduxTableActionTypes.UPDATETABLE,
      tableName,
      tableData: {
        ...tableData,
        rowsPerPage: parseInt(rowsPerPage, 10)
      }
    });
  }
};

export const updateFilterMode = tableName => (dispatch, getState) => {
  const tableData = getTableData(getState(), tableName);
  dispatch({
    type: ReduxTableActionTypes.UPDATETABLE,
    tableName,
    tableData: {
      ...tableData,
      filterMode: !tableData.filterMode,
      filters: {}
    }
  });
};

export const updateFilterText = (tableName, columnId, filterText) => (
  dispatch,
  getState
) => {
  const tableData = getTableData(getState(), tableName);
  dispatch({
    type: ReduxTableActionTypes.UPDATETABLE,
    tableName,
    tableData: {
      ...tableData,
      filters: {
        ...tableData.filters,
        [columnId]: filterText
      }
    }
  });
};
