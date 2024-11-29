import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';


export class MemoFetch implements IFetcher {
    private _cache: Record<string, Promise<Response>> = {};

    fetch (requestInfo: RequestInfo, requestInit: RequestInit): Promise<Response> {
        const method: string    = requestInit.method ?? 'GET';
        const url: string       = typeof requestInfo === 'string' ? requestInfo
                                                                  : requestInfo.url;
        const cacheName: string = `${ method }:${ url }`;

        if (this._cache[cacheName] !== undefined) {
            return this._cache[cacheName];
        }

        const request          = fetch(requestInfo, requestInit);
        this._cache[cacheName] = request;
        return request;
    }
}