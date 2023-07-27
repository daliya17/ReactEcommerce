import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/ConfigureStore";
export interface regressionInfoFileResultMap {
    datas: Record<string, eobData>;
}

export interface eobData {
    contextId: string,
    paymentBatchId: string
}

const initialState: regressionInfoFileResultMap = {
    datas: {}
};

const EobSlice = createSlice({
    name: 'eobdocdata',
    initialState: initialState,
    reducers: {
        setEobData(state, action) {
            state.datas[action.payload.regressionInfoId] = action.payload.doc;
        },
    }
});

export const selectStoreData = (state: RootState) => state.eobdocreducer.datas;

export const getEobDoc = (regressionInfoId: string) =>
    createSelector(selectStoreData, storeData => {
        const eobDoc = storeData[regressionInfoId]
        return eobDoc;
    });

export const getAllEobDoc = (state: RootState) => {
    return state.eobdocreducer.datas;
}

export const selectEobDocs = (state: RootState) => state.eobdocreducer.datas;

export default EobSlice.reducer;
export const {
    setEobData,
} = EobSlice.actions