import IError from "@/models/IError";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
    errors: IError[],
    errorsVisible: boolean,
    modals: JSX.Element[]
}

const initialState: GlobalState = {
    errors: [],
    errorsVisible: false,
    modals: []
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        addErrors: (state, action: PayloadAction<IError[] | IError>) => {
            const newErrors = Array.isArray(action.payload) ? action.payload : [action.payload]
            state.errors = [...state.errors, ...newErrors]

            state.errorsVisible = true
        },
        setErrors: (state, action: PayloadAction<IError[]>) => {
            state.errors = action.payload
        },
        clearErrors: (state) => {
            state.errors = []
            state.errorsVisible = false
        },
        setErrorsVisible: (state, action: PayloadAction<boolean>) => {
            state.errorsVisible = action.payload
        },
        addModal: (state, action: PayloadAction<JSX.Element>) => {
            state.modals = [...state.modals, action.payload]
        },
        removeModal: (state) => {
            state.modals.splice(state.modals.length - 1, 1)
        },

    }
})

export const { addErrors, clearErrors, setErrorsVisible, setErrors, addModal, removeModal } = globalSlice.actions

export default globalSlice.reducer