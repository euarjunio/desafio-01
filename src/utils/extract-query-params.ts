export function extractQueryParams(query: any) {
    return query.substr(1).split("&").reduce((queryParams: any, param: any) => {
        const [key, value] = param.split("=")
        queryParams[key] = value
        return queryParams
    }, {})
}