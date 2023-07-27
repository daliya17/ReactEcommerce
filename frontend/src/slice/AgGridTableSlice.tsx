import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../store/ConfigureStore';

interface TableState {
    tables: Record<string, TableData>;
}

interface TableData {
    tableId: string;
    selectedRows: any[];
    totalRows: number;
    rowData: [];
    paginationRowData: paginationRowData[];
}

interface paginationRowData {
    page: number,
    data: any[]
}


const initialState: TableState = {
    tables: {},
};

const AgGridTableSlice = createSlice({
    name: 'agGridTable',
    initialState,
    reducers: {
        updatePaginatedTableData: (state, action: PayloadAction<TableData>) => {
            const { tableId } = action.payload;
            const table = state.tables[tableId];
            if (table === undefined) {
                state.tables[tableId] = action.payload;
            } else {
                let pushed: Boolean = false;
                state.tables[tableId].paginationRowData.map(data => {
                    if (data.page === action.payload.paginationRowData[0].page) {
                        pushed = true;
                        return action.payload.paginationRowData[0];
                    }
                });
                if (!pushed) {
                    state.tables[tableId].paginationRowData.push(action.payload.paginationRowData[0]);
                }
            }
        },
        updateTableRowData: (state, action: PayloadAction<TableData>) => {
            const { tableId } = action.payload;
            const table = state.tables[tableId];
            if (table === undefined) {
                state.tables[tableId] = action.payload;
            } else {
                state.tables[tableId].rowData = action.payload.rowData;
            }
        },
        removeTable: (state, action: PayloadAction<string>) => {
            const tableId = action.payload;
            delete state.tables[tableId];
        },
        setSelectedRows: (
            state,
            action: PayloadAction<{ tableId: string; selectedRows: any[], page: number }>
        ) => {
            const { tableId, selectedRows, page } = action.payload;
            state.tables[tableId].selectedRows = action.payload.selectedRows;
        },

    },
});
export const selectStoreData = (state: RootState) => state.tablereducer.tables;

export const selectPaginatedRowData = (tableId: string, currentPage: number) =>
    createSelector(selectStoreData, storeData => {
        const tableValue: any = storeData[tableId] ?
            storeData[tableId].paginationRowData.find(data => data.page === currentPage) : [];
        return tableValue ? tableValue.data : [];
    });


export const selectRowData = (tableId: string) =>
    createSelector(selectStoreData, storeData => {
        const tableValue: any = storeData[tableId] ?
            storeData[tableId].rowData : [];
        return tableValue;
    });

export const selectSelectedRowData = (tableId: string) =>
    createSelector(selectStoreData, storeData => {
        const selectedValue = storeData[tableId] ? storeData[tableId].selectedRows : [];
        return selectedValue;
    });


export const checkDataPresentOnTableAndPage = (tableId: string, currentPage: number) =>
    createSelector(selectStoreData, storeData => {
        const tableValue = storeData[tableId] ? storeData[tableId].paginationRowData.some(data => data.page === currentPage) : false;
        return tableValue;
    });

export const checkRowDataPresentOnTable = (tableId: string) =>
    createSelector(selectStoreData, storeData => {
        const tableValue = storeData[tableId] ? storeData[tableId].rowData !== undefined : false;
        return tableValue;
    });

export const checkTotalRows = (tableId: string, currentPage: number) =>
    createSelector(selectStoreData, storeData => {
        const tableValue = storeData[tableId] ? storeData[tableId].totalRows : 0;
        return tableValue;
    });

export const {
    updatePaginatedTableData,
    updateTableRowData,
    removeTable,
    setSelectedRows,
} = AgGridTableSlice.actions;


export default AgGridTableSlice.reducer;
