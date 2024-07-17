import ICurrentPlayerState from "@/models/ICurrentPlayerState";
import IPlaylistItem from "@/models/IPlaylistItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICurrentItem extends IPlaylistItem {
    hasLoaded?: boolean
}

interface MediaState {
    currentPlaylist: IPlaylistItem[];
    currentItem: ICurrentItem | null;
    currentPlayerState: ICurrentPlayerState
}


const initialState: MediaState = {
    currentPlaylist: [],
    currentItem: null,
    currentPlayerState: {
        state: false,
        duration: 9999,
        time: 0,
        art: null
    }
}

const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        setCurrentItem: (state, action: PayloadAction<ICurrentItem>) => {
            if (typeof action.payload?.hasLoaded !== 'boolean') action.payload.hasLoaded = true
            if (typeof action.payload?.hasArt !== 'boolean') action.payload.hasArt = undefined
            state.currentItem = action.payload
        },
        setMedia: (state, action: PayloadAction<IPlaylistItem[]>) => {
            state.currentPlaylist = action.payload
        },
        addMedia: (state, action: PayloadAction<any>) => {
            const newMedia = !Array.isArray(action.payload) ? [action.payload] : action.payload
            const newState = [...state.currentPlaylist]

            for (const media of newMedia) {
                const foundIndex = newState.findIndex(item => item.id == media.id)
                if (foundIndex !== -1) {
                    newState[foundIndex] = { ...newState[foundIndex], ...media }
                } else {
                    newState.push(media)
                }
            }

            state.currentPlaylist = newState

        },
        setCurrentPlayerState: (state, action: PayloadAction<any>) => {
            state.currentPlayerState = { ...action.payload }
        },

    }
})

export const { setMedia, addMedia, setCurrentPlayerState, setCurrentItem } = mediaSlice.actions

export default mediaSlice.reducer