import { store } from "@/state/store";
import { requestHandler } from "./apiHelper";
import { addMedia, setCurrentItem, setCurrentPlayerState, setMedia } from "@/state/slices/mediaSlice";
import IPlaylistItem from "@/models/IPlaylistItem";
import { Buffer } from 'buffer'
import ApiService, { IRequest } from "./ApiService";
import { setIsConnected } from "@/state/slices/settingsSlice";
import { setErrors, setErrorsVisible } from "@/state/slices/globalSlice";

export default class MediaService {
    private _retries: number;
    private _maxRetries: number;

    constructor(private _apiService: ApiService) {
        this._retries = 0
        this._maxRetries = 5
    }

    public async attemptReconnect() {
        this._retries = 0
        await this.updateStatus()
    }

    public async updateStatus({ options, repeat = true }: IUpdateStatus = {}) {
        return (await requestHandler(async () => {
            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json',
                options: { disableErrorDialog: true }
            })

            if (!data?.status) {
                if (!repeat) return data
                const { host, password, port } = store.getState().settings
                if (host && password && port) {
                    const retryMs = 1000 * (this._retries + 1)

                    if (this._retries >= 1) {
                        store.dispatch(setIsConnected(false))

                        store.dispatch(setErrors([{
                            msg: `Connection failed\nRetrying in ${retryMs} ms`
                        }]))
                        store.dispatch(setErrorsVisible(true))
                    }


                    if (this._retries < this._maxRetries)
                        setTimeout(() => {
                            this.updateStatus()
                            this._retries += 1
                        }, retryMs)

                }

                return data
            } else {
                this._retries = 0
            }

            const { currentPlayerState: currentState, currentItem, currentPlaylist } = store.getState().media
            const foundItem = currentPlaylist.find(item => item.id == data.content.currentplid)

            // if (!!currentItem?.id && (currentItem?.id != data.content.currentplid)) {
            //     setTimeout(() => {
            //         this.updateStatus()
            //     }, 1000)

            //     return data
            // }

            let art = undefined
            let hasArt = undefined
            if (((!currentItem) || (data.content.currentplid == currentItem?.id) && (currentItem?.hasLoaded && (currentItem?.hasArt === true || currentItem?.hasArt === undefined)) && !currentItem?.art)) {
                const artRes = await this.getArt({ options: { disableErrorDialog: true } })

                if (artRes.status) {
                    if (!foundItem?.art) {
                        art = artRes.content
                    }
                    hasArt = true
                } else {
                    hasArt = false
                }

            }

            const formattedItem = foundItem ? formatPlaylistItemFull({ ...foundItem, ...(!foundItem?.name && { name: data.content.information.category.meta.filename }), ...(art && { art }), hasArt, ...data.content.information.category.meta }) : {
                id: data.content.currentplid,
                name: data.content.information.category.meta.title ?? data.content.information.category.meta.filename,
                artist: data.content.information.category.meta.artist,
                duration: data.content.length,
                uri: '',
                hasArt,
                isFolder: false,
                ...(art && { art })
            }
            store.dispatch(addMedia(formattedItem))


            if (((currentItem?.id != formattedItem.id) || !currentItem?.hasLoaded) || currentItem != formattedItem) {
                store.dispatch(setCurrentItem(formattedItem))
            }

            const state = data.content.state === "playing" ? true : false
            const time = data.content.time
            const duration = data.content.length


            store.dispatch(setCurrentPlayerState({ ...currentState, ...(art && { art }), state, time, duration }))//, art: artBase64 }))
            store.dispatch(setIsConnected(true))

            if (repeat) setTimeout(() => {
                this.updateStatus()
            }, 1000)

            return data

        }))
    }

    public async getArt({ options }: IRequest = {}) {
        return (await requestHandler(async () => {
            const art = await this._apiService.request({
                method: 'get',
                endpoint: '/art',
                responseType: 'arraybuffer',
                options
            })

            if (!art?.status) return art

            const artBase64 = Buffer.from(art.content, 'binary').toString('base64')

            return {
                status: true,
                content: artBase64
            }
        }))

    }

    public async updateArt({ options }: IRequest = {}) {
        return (await requestHandler(async () => {
            const art = await this.getArt({ options })
            if (!art.status) return art

            const artBase64 = art.content

            const currentPlayerState = store.getState().media.currentPlayerState
            if (artBase64 && currentPlayerState.art !== artBase64) {
                store.dispatch(setCurrentPlayerState({ ...currentPlayerState, art: artBase64 }))
            }

            return {
                status: true,
                content: artBase64
            }
        }))

    }

    public async seekTrack({ time, options }: ISeekTrack) {
        return (await requestHandler(async () => {
            const currentState = store.getState().media.currentPlayerState
            const val = `${(time / currentState.duration) * 100}%`
            store.dispatch(setCurrentPlayerState({ ...currentState, time }))

            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json',
                params: {
                    command: 'seek',
                    val
                },
            })

            return {
                status: true,
            }
        }))
    }

    public async getCurrentPlaylist({ overwriteState = false, options }: IGetCurrentPlaylist = {}) {
        return (await requestHandler(async () => {
            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/playlist.json',
            })

            if (!data?.content?.children) return { status: false }
            if (!data.content.children[0]?.children) return { status: false }

            const items = data.content.children[0].children

            for (let i = 0; i < items.length; i++) {
                items[i] = formatPlaylistItem(items[i])

            }

            if (overwriteState) {
                store.dispatch(setMedia(items))
            } else {
                store.dispatch(addMedia(items))
            }


            return {
                status: true,
                content: items
            }
        }))
    }

    public async nextTrack({ options }: IRequest = {}) {
        return (await requestHandler(async () => {
            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json',
                params: {
                    command: 'pl_next'
                }
            })

            const currentState = store.getState().media.currentPlayerState
            store.dispatch(setCurrentPlayerState({ ...currentState, time: 0, state: true }))


            return {
                status: true,
                content: {}
            }
        }))
    }

    public async previousTrack({ options }: IRequest = {}) {
        return (await requestHandler(async () => {
            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json',
                params: {
                    command: 'pl_previous'
                }
            })

            const currentState = store.getState().media.currentPlayerState
            store.dispatch(setCurrentPlayerState({ ...currentState, time: 0, state: true }))


            return {
                status: true,
                content: {}
            }
        }))
    }

    public async playItemById({ id, options }: IPlayItemById) {
        return (await requestHandler(async () => {
            const currentState = store.getState().media.currentPlayerState
            store.dispatch(setCurrentPlayerState({ ...currentState, time: 0, state: true }))

            const currentPlaylist = store.getState().media.currentPlaylist
            const foundItem = currentPlaylist.find(item => item.id == id)
            if (foundItem && !foundItem?.isFolder) store.dispatch(setCurrentItem({ ...foundItem, art: undefined, hasLoaded: false }))

            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json?command=pl_play',
                params: { id },
                options
            })

            this.updateStatus({ repeat: false })

            return {
                status: true,
                content: data
            }
        }))
    }


    public async playPause({ options }: IRequest = {}) {
        return (await requestHandler(async () => {
            const currentState = store.getState().media.currentPlayerState
            store.dispatch(setCurrentPlayerState({ ...currentState, state: !!!currentState.state }))

            const data = await this._apiService.request({
                method: 'get',
                endpoint: '/requests/status.json',
                params: {
                    command: 'pl_pause'
                },
            })

            return {
                status: true,
            }
        }))
    }


    public async searchLocalPlaylist({ text, options }: ISearchLocalPlaylist) {
        return (await requestHandler(async () => {
            text = text.toLowerCase().trim()

            const currentState = store.getState().media.currentPlaylist

            const filteredItems = currentState.filter((item) => {
                let matches = 0

                if (item?.artist) {
                    if (item.artist.toLowerCase().trim().includes(text)) matches += 1
                }

                if (item?.album) {
                    if (item.album.toLowerCase().trim().includes(text)) matches += 1
                }

                if (item?.name) {
                    if (item.name.toLowerCase().trim().includes(text)) matches += 1
                }

                if (item?.uri) {
                    if (item.uri.toLowerCase().trim().includes(text)) matches += 1
                }

                return !!matches
            })

            return {
                status: true,
                content: filteredItems
            }
        }))
    }


}

function formatPlaylistItemFull(playlistItem: any) {
    const item = formatPlaylistItem(playlistItem)

    const date = playlistItem.date
    const artist = playlistItem.artist
    const name = playlistItem.title
    const album = playlistItem.album
    const art = playlistItem.art
    const hasArt = playlistItem.hasArt

    return {
        ...item,
        date,
        artist,
        name,
        album,
        hasArt,
        ...(art && { art })
    }
}

function formatPlaylistItem(playlistItem: any): IPlaylistItem {
    const name = playlistItem.name
    const id = playlistItem.id
    const duration = playlistItem.duration
    const uri = playlistItem.uri

    return {
        name,
        id,
        duration,
        uri,
        isFolder: duration == -1
    }
}

interface IPlayItemById extends IRequest {
    id: number;
}

interface ISeekTrack extends IRequest {
    time: number;
}

interface ISearchLocalPlaylist extends IRequest {
    text: string;
}

interface IGetCurrentPlaylist extends IRequest {
    overwriteState?: boolean
}

interface IUpdateStatus extends IRequest {
    repeat?: boolean;
}