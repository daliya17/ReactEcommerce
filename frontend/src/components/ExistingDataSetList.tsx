import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import AgGridTable from "./common/AgGridTable"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ColDef } from "ag-grid-community";
import { updateDataSetId } from "../slice/CreateRegressionSlice";
import { toggleForm, toggleNext } from "../slice/AppSlice";
import '../style/css/ExistingDataSetList.css';
import { GridApi } from 'ag-grid-community';
import { setSelectedRows, checkRowDataPresentOnTable, updateTableRowData } from "../slice/AgGridTableSlice";
import { paginatedResponse } from '../types';
import { getDataSet } from '../services/dataSetService';

const tableId = `table_existing_data_set`;

const ExistingDataSetList = () => {

  const [page, setPage] = useState(0);
  const [gridApi, setGridApi] = useState<GridApi | undefined>(undefined);

  const rowData: any = [];
  const dispatch: any = useDispatch();
  const gridRef = useRef<AgGridReact>(null);

  const dataAlreadyPresentMemo = React.useMemo(() => checkRowDataPresentOnTable(tableId), [tableId]);
  const dataAlreadyPresent = useSelector(dataAlreadyPresentMemo);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    gridRef.current?.api.showLoadingOverlay();
    if (!dataAlreadyPresent) {
      let dataSets: paginatedResponse = await getDataSet();
      await dispatch(updateTableRowData({
        tableId: tableId,
        selectedRows: [],
        rowData: dataSets.data,
        totalRows: dataSets.totalElements || 0,
        paginationRowData: []
      }));
    }
    gridRef.current?.api?.hideOverlay();
  }

  const columnDefs = useMemo<any>(() => {
    return [
      {
        field: 'id',
        checkboxSelection: true,
        width: 50,
      },
      { field: 'name' }
    ];
  }, []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      width: 50,
      minWidth: 100,
    };
  }, []);

  const onRowSelected = (event: { api: { getSelectedRows: () => any; }; }) => {
    const selectedRows = event.api.getSelectedRows();
    dispatch(setSelectedRows({ tableId, selectedRows, page }));
    dispatch(updateDataSetId(selectedRows[0].id));
    dispatch(toggleForm());
    dispatch(toggleNext());
  };
  const onFilterTextBoxChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    gridRef.current?.api?.setQuickFilter(event.target.value);
  }, []);

  return (
    <div className="ag-theme-alpine" id='data-set-table'>
      <div className="ag-grid-table__items">
        <input
          type="text"
          className='margin-bottom'
          id="ag-grid-table__search"
          placeholder="Filter..."
          onChange={onFilterTextBoxChanged}
        />
      </div>
      <div className="ag-grid-table">
        <AgGridTable
          gridApi={gridApi}
          serverSidePagination={false}
          tableId={tableId}
          gridRef={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={'single'}
          suppressRowClickSelection={true}
          onRowSelected={onRowSelected}
        />
      </div>
    </div>

  )
}

export default React.memo(ExistingDataSetList);