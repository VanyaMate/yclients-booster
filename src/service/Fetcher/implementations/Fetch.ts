import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';


export class Fetch implements IFetcher {
    fetch (requestInfo: RequestInfo, requestInit: RequestInit): Promise<Response> {
        return fetch(requestInfo, requestInit);
    }
}