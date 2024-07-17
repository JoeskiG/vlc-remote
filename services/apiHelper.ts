export async function requestHandler(fun: Function) {
    try {
        const res = await fun()
        return res

    } catch (err) {
        console.error(err)
    }
}