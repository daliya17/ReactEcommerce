import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/ConfigureStore";

export interface RegressionReport {
    batchCount: number,
    statusInfo: any,
    errorInfo: any
}

const initialState: RegressionReport = {
    batchCount: 0,
    statusInfo: [],
    errorInfo: []
};

const RegressionReportSlice = createSlice({
    name: 'regressionreport',
    initialState,
    reducers: {
        updateReport(state, action: PayloadAction<RegressionReport>) {
            state.batchCount = action.payload.batchCount;
            state.statusInfo = action.payload.statusInfo;
            state.errorInfo = action.payload.errorInfo;
        }
    }
});

export const selectBatchCount = (state: RootState) => state.regressionreport.batchCount;
export const selectStatusInfo = (state: RootState) => state.regressionreport.statusInfo;
export const selectErrorInfo = (state: RootState) => state.regressionreport.errorInfo;
export const {
    updateReport
} = RegressionReportSlice.actions;
export default RegressionReportSlice.reducer;