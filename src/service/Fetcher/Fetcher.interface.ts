export interface IFetcher {
    fetch (requestInfo: RequestInfo, requestInit: RequestInit): Promise<Response>;
}