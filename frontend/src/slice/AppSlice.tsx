import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/ConfigureStore";

interface App {
    load: string,
    showModal: boolean,
    modalMessage: string,
    hideNext: boolean,
    disableForm: boolean
}

const initialState: App = {
    load: '',
    showModal: false,
    modalMessage: '',
    hideNext: false,
    disableForm: false
};

const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateLoad(state, action: PayloadAction<string>) {
            state.load = action.payload;
        },
        toggleModal(state, action: PayloadAction<string>) {
            state.showModal = !state.showModal;
            state.modalMessage = action.payload;
        },
        toggleNext(state) {
            state.hideNext = !state.hideNext;
        },
        toggleForm(state) {
            state.disableForm = !state.disableForm;
        }
    }
});

export const selectLoad = (state: RootState) => state.app.load;
export const selectModal = (state: RootState) => state.app.showModal;
export const selectModalText = (state: RootState) => state.app.modalMessage;
export const selectNext = (state: RootState) => state.app.hideNext;
export const selectForm = (state: RootState) => state.app.disableForm;
export const {
    updateLoad,
    toggleModal,
    toggleNext,
    toggleForm
} = AppSlice.actions;
export default AppSlice.reducer;