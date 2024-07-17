import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import mediaReducer from './slices/mediaSlice'
import settingsReducer from './slices/settingsSlice'
import globalReducer from './slices/globalSlice'

export const store = configureStore({
    reducer: {
        media: mediaReducer,
        settings: settingsReducer,
        global: globalReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown, // ExtraArgument type, typically 'void' if not used
    Action<string> // Action type, if needed
>;


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch