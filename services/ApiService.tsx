import axios, { AxiosBasicCredentials, AxiosInstance, Method, ResponseType } from 'axios'
import MediaService from "./MediaService"
import { store } from '@/state/store'
import { addErrors } from '@/state/slices/globalSlice'

export interface IRedirect {
    to?: string,
    redirect?: boolean
}

export interface IRequest {
    options?: IApiRequestOptions
}

interface IApiService {
    baseUrl: string,
    password: string,
    token?: string | null
}

interface IApiRequestOptions {
    disableDefaultAuthErrorAction?: boolean,
    disableErrorDialog?: boolean,
    showSuccessDialog?: boolean,
}

interface IApiRequest {
    auth?: AxiosBasicCredentials,
    method: Method,
    endpoint: string,
    data?: any,
    params?: any,
    options?: IApiRequestOptions,
    responseType?: ResponseType

}


interface IHandleApiError {
    res: any,
    message?: any,
    disableErrorDialog?: boolean
}

export default class ApiService {
    private _password: string
    private _axiosInstance: AxiosInstance

    private _mediaService: MediaService

    constructor({
        password
    }: IApiService) {
        this._password = password

        this._axiosInstance = axios.create({
            timeout: 3000
        })

        this._mediaService = new MediaService(this)

    }


    public get mediaService() {
        return this._mediaService
    }

    public async request({
        method,
        endpoint,
        data,
        params,
        auth,
        responseType,
        options = {}
    }: IApiRequest): Promise<any> {
        const { disableDefaultAuthErrorAction, disableErrorDialog } = options
        try {

            for (const key in data) {
                if (typeof data[key] === 'string') {
                    if (data[key].trim() === '') {
                        data[key] = null
                    }
                }
            }

            const settings = store.getState().settings
            if (!auth) auth = {
                username: '',
                password: settings.password!
            }

            const response = await this._axiosInstance({
                method: method as string,
                url: `${settings.host}:${settings.port}${endpoint}`,
                data,
                params,
                auth,
                responseType
            })

            return {
                status: true,
                content: response.data
            }
        } catch (err) {
            return this.handleApiError({
                res: err,
                disableErrorDialog
            })
        }
    }

    private handleApiError(
        {
            res,
            message = {
                message: "Unspecified Error",
            },
            disableErrorDialog = false
        }: IHandleApiError
    ) {
        if (!disableErrorDialog) store.dispatch(addErrors([{ msg: res?.message || 'Unknown error occurred' }]))


        return {
            status: false,
            errors: [{ msg: 'Error' }]
        }
    }

}