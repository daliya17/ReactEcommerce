import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/ConfigureStore";

export interface ComparatorConfig {
    id: string,
    name: string
}

interface CreateRegression {
    batchName: string,
    dataSetName: string,
    dataSetId: string,
    comparatorConfig: ComparatorConfig[],
    comparatorConfigId: string,
    configFields: string[],
    regressionName: string,
    regenerateReferenceData: boolean,
    regressionId: string,
    inputDataType: string
}

const initialState: CreateRegression = {
    batchName: '',
    dataSetName: '',
    dataSetId: '',
    comparatorConfig: [],
    comparatorConfigId: '',
    configFields: [],
    regressionName: '',
    regenerateReferenceData: false,
    regressionId: '',
    inputDataType: 'csv'
};

const createRegressionSlice = createSlice({
    name: 'createregression',
    initialState,
    reducers: {
        updateBatchName(state, action: PayloadAction<string>) {
            state.batchName = action.payload;
        },
        updateDataSetName(state, action: PayloadAction<string>) {
            state.dataSetName = action.payload;
        },
        updateDataSetId(state, action: PayloadAction<string>) {
            state.dataSetId = action.payload;
        },
        updateComparatorConfig(state, action: PayloadAction<Array<ComparatorConfig>>) {
            state.comparatorConfig = action.payload;
        },
        updateComparatorConfigId(state, action: PayloadAction<string>) {
            state.comparatorConfigId = action.payload;
        },
        updateConfigFields(state, action: PayloadAction<Array<string>>) {
            state.configFields = action.payload;
        },
        updateRegressionName(state, action: PayloadAction<string>) {
            state.regressionName = action.payload;
        },
        toggleRegenerateReferenceData(state) {
            state.regenerateReferenceData = !state.regenerateReferenceData;
        },
        updateRegressionId(state, action: PayloadAction<string>) {
            state.regressionId = action.payload;
        },
        refreshState(state) {
            state = initialState;
        },
        updateInputDataType(state, action: PayloadAction<string>) {
            state.inputDataType = action.payload;
        }
    }
});

export const selectBatchName = (state: RootState) => state.createregression.batchName;
export const selctDataSetName = (state: RootState) => state.createregression.dataSetName;
export const selectDataSetId = (state: RootState) => state.createregression.dataSetId;
export const selectComparatorConfig = (state: RootState) => state.createregression.comparatorConfig;
export const selectComparatorConfigId = (state: RootState) => state.createregression.comparatorConfigId;
export const selectConfigFields = (state: RootState) => state.createregression.configFields;
export const selectRegressionName = (state: RootState) => state.createregression.regressionName;
export const selectRegenerateReferenceData = (state: RootState) => state.createregression.regenerateReferenceData;
export const selectRegressionId = (state: RootState) => state.createregression.regressionId;
export const selectInputDataType = (state: RootState) => state.createregression.inputDataType;

export const {
    updateBatchName,
    updateDataSetName,
    updateDataSetId,
    updateComparatorConfig,
    updateComparatorConfigId,
    updateConfigFields,
    updateRegressionName,
    toggleRegenerateReferenceData,
    updateRegressionId,
    updateInputDataType,
    refreshState
} = createRegressionSlice.actions;
export default createRegressionSlice.reducer;