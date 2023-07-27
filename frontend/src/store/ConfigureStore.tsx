import { configureStore } from "@reduxjs/toolkit";
import CreateRegressionReducer from "../slice/CreateRegressionSlice";
import RegressionReportReducer from "../slice/RegressionReportSlice";
import AppReducer from "../slice/AppSlice";
import AgGridTableReducer from "../slice/AgGridTableSlice";
import EobDocReducer from "../slice/EobSlice";

export const store = configureStore({
    reducer: {
        app: AppReducer,
        createregression: CreateRegressionReducer,
        regressionreport: RegressionReportReducer,
        tablereducer: AgGridTableReducer,
        eobdocreducer: EobDocReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;