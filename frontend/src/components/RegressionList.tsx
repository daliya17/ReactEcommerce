import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";
import '../style/css/RegressionList.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import TablePagination from '@mui/material/TablePagination';
import LoopIcon from '@mui/icons-material/Loop';
import { IconButton, Tooltip } from "@mui/material";
import { Button } from "@material-ui/core";
import AgGridTable from "./common/AgGridTable";
import { useDispatch, useSelector } from "react-redux";
import { checkDataPresentOnTableAndPage, checkTotalRows, removeTable, updatePaginatedTableData } from "../slice/AgGridTableSlice";
import { Loader } from "@athena/forge";
import { paginatedResponse } from "../types";
import { getAllRegressions } from "../services/regressionService";
import { text } from "stream/consumers";

// table data
const tableId = `table_regression_list`;
const rowsPerPage = 100;

function RegressionList(): JSX.Element {

  const gridRef = useRef<AgGridReact>(null);
  const [load, setLoad] = useState('loading');
  const [page, setPage] = useState(0);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const dataAlreadyPresentMemo = React.useMemo(() => checkDataPresentOnTableAndPage(tableId, page), [tableId, page]);
  const dataAlreadyPresent = useSelector(dataAlreadyPresentMemo);
  const totalRowsMemo = React.useMemo(() => checkTotalRows(tableId, page), [tableId, page]);
  const totalRows = useSelector(totalRowsMemo);

  useEffect(() => {
    fetchRegressionData(false);
  }, [page]);

  const fetchRegressionData = async (forceRefresh: boolean) => {
    try {
      setLoad('loading');
      // Deleting the existing data and fetching it again while refresh
      if (forceRefresh) {
        dispatch(removeTable(tableId));
      }
      if (!dataAlreadyPresent || forceRefresh) {
        let paginatedRegressionResponse: paginatedResponse = await getAllRegressions(page, rowsPerPage);
        dispatch(updatePaginatedTableData({
          tableId: tableId,
          selectedRows: [],
          rowData: [],
          totalRows: paginatedRegressionResponse.totalElements || 0,
          paginationRowData: [{
            page: page,
            data: paginatedRegressionResponse.data
          }]
        }));
      }
      setLoad('loaded')
    } catch (error) {
      console.error('Error fetching regression data:', error);
    }
  };

  const defaultColDef = useMemo<any>(() => {
    return {
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  const columnDefs = useMemo<any>(() => {
    return [
      { field: 'id', headerName: "Regression Id", maxWidth: 340, width: 340, minWidth: 100 },
      { field: 'name', headerName: "Regression Name", width: 200, minWidth: 200 },
      { field: 'created', headerName: "Created", width: 270, minWidth: 270 },
      { field: 'completed', headerName: "Completed", width: 270, minWidth: 270 },
      { field: 'score', headerName: "Score", width: 100, minWidth: 100 },
      { field: 'status', headerName: "Status", width: 180, minWidth: 180, cellRenderer: 'customCellRenderer' },
      { field: 'dataSetId', headerName: "DataSet Id", width: 330, minWidth: 330 },
    ];
  }, []);

  const statusCellRenderer = (props: { value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }) => {
    const textColor = props.value === 'COMPLETED' ? 'color--green' : 'color--violet';
    return <div className={textColor}>{props.value}</div>;
  };

  // This will be triggered when the regression row is selected
  const onSelectionChanged = (event: { api: { getSelectedRows: () => any; }; }) => {
    const selectedRow: any = event.api.getSelectedRows();
    navigate(`/regression/${selectedRow[0].id}/comparisonresult`, {
      state: {
        'regressionId': `${selectedRow[0].id}`
      }
    });
  }

  // place holder to export csv data
  // const onBtnExport = useCallback(() => {
  //   const currentTime = new Date().toLocaleTimeString().replace(/:/g, '-');
  //   const fileName = `regressions_page_0_${currentTime}.csv`;
  //   gridRef.current?.api.exportDataAsCsv({ fileName: fileName });
  // }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  return (
    <React.Fragment>
      <div className="regression-page">
        <PageHeader
          title="Regressions"
          pageActions={
            <React.Fragment>
              <Tooltip title="Refresh Table" placement="top-start">
                <IconButton size="large" id='btn--refresh' onClick={() => fetchRegressionData(true)}>
                  <LoopIcon />
                </IconButton>
              </Tooltip>
              <Link to={'/createregression'} className="link">
                <Button variant="contained" color="primary" id="btn-create-regression">
                  {'Create Regression'}
                </Button>
              </Link>
            </React.Fragment>
          }
        />
        <div
          id="ag-grid-table__container"
          className="ag-theme-alpine width--full height-full"
        >
          <div className="ag-grid-table__items">
            {/* uncomment below comment to have the csv download btn and input in the table */}
            {/* <Tooltip title="Export As CSV" placement="top-start">
              <IconButton size="large" id='btn--export-csv' onClick={onBtnExport}>
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Tooltip> */}
            {/* <input
              type="text"
              id="ag-grid-table__search"
              placeholder="Filter..."
              onChange={onFilterTextBoxChanged}
            /> */}
          </div>
          <div className="ag-grid-table">
            <Loader loading={load === 'loading'} text="Loading content...">
              <AgGridTable
                tableId={tableId}
                serverSidePagination={true}
                currentPage={page}
                defaultColDef={defaultColDef}
                gridRef={gridRef}
                columnDefs={columnDefs}
                suppressCopyRowsToClipboard={true}
                onRowClicked={onSelectionChanged}
                rowSelection={'single'}
                frameworkComponents={{
                  customCellRenderer: statusCellRenderer,
                }}
                suppressRowClickSelection={true}
              />
            </Loader>
            <div className="pagination-btn">
              <TablePagination
                rowsPerPageOptions={[100]}
                id="regression-table-pagination"
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
              />
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  );
}
export default RegressionList;
