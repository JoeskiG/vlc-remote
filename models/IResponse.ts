import IError from "./IError";

export interface IResponse {
    status: boolean,
    message?: string | null,
    content?: any | null,
    error?: IError[]
}