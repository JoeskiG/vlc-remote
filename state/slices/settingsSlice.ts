import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";

interface SettingsState {
    host: string | null;
    port: string | null;
    password: string | null;
    isConnected: boolean;
}

interface ISettingsStateProps extends Omit<SettingsState, 'isConnected'> {

}

const initialState: SettingsState = {
    host: null,
    port: '8080',
    password: null,
    isConnected: false
}

export const loadInitialState = (): AppThunk => async (dispatch) => {
    try {
        const host = await AsyncStorage.getItem('host');
        const port = await AsyncStorage.getItem('port');
        const password = await AsyncStorage.getItem('password');
        if (host !== null && password !== null && port !== null) {
            dispatch(setState({ host, port, password }));
        }
    } catch (error) {
        console.error('Error loading settings from AsyncStorage:', error);
    }
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setHost: (state, action: PayloadAction<string>) => {
            state.host = action.payload
            AsyncStorage.setItem('host', action.payload)
        },
        setPort: (state, action: PayloadAction<string>) => {
            state.port = action.payload
            AsyncStorage.setItem('port', action.payload)
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
            AsyncStorage.setItem('password', action.payload)
        },
        setState: (state, action: PayloadAction<ISettingsStateProps>) => {
            state.host = action.payload.host
            state.port = action.payload.port
            state.password = action.payload.password

            if (action.payload.host) {
                AsyncStorage.setItem('host', action.payload.host)
            } else {
                AsyncStorage.removeItem('host')
            }

            if (action.payload.port) {
                AsyncStorage.setItem('port', action.payload.port)
            } else {
                AsyncStorage.removeItem('port')
            }
            if (action.payload.password) {
                AsyncStorage.setItem('password', action.payload.password)
            } else {
                AsyncStorage.removeItem('password')
            }
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            if (action.payload !== state.isConnected) state.isConnected = action.payload
        }

    }
})

export const { setHost, setPassword, setState, setIsConnected } = settingsSlice.actions

export default settingsSlice.reducer