export type RequestData<Data> = {
    data: Data;
    url: RequestInfo;
    options: RequestInit;
}

export type RequestValidator = (data: unknown) => string;
export type RequestOnBeforeHandler<Data> = (data: Data) => void;
export type RequestSuccessHandler<Data> = (data: Data, response: unknown) => void;
export type RequestRetryHandler<Data> = (data: Data, retry: number) => void;
export type RequestErrorHandler<Data> = (data: Data, error: unknown) => void;
export type RequestFinish<Data> = (success: Array<Data>, error: Array<Data>) => void;

export class RequestSplitter<Data> {
    private _requests: Array<RequestData<Data>> = [];
    private _successFinished: Array<Data>       = [];
    private _errorFinished: Array<Data>         = [];
    private _currentRequestIndex: number        = 0;
    private _finishedAmount: number             = 0;
    private _active: boolean                    = false;

    constructor (
        private readonly _requestValidator: RequestValidator,
        private readonly _onBefore: RequestOnBeforeHandler<Data>,
        private readonly _onSuccess: RequestSuccessHandler<Data>,
        private readonly _onRetry: RequestRetryHandler<Data>,
        private readonly _onError: RequestErrorHandler<Data>,
        private readonly _onFinish: RequestFinish<Data>,
        private readonly _limit: number   = 10,
        private readonly _retry: number   = 2,
        private readonly _isJson: boolean = true,
    ) {
    }

    async requests (requests: Array<RequestData<Data>>) {
        if (this._active) {
            throw new Error('Splitter is active');
        }

        this._requests            = requests;
        this._successFinished     = [];
        this._errorFinished       = [];
        this._finishedAmount      = 0;
        this._currentRequestIndex = 0;
        this._active              = true;

        for (let i = 0; i < this._limit; i++) {
            this._next();
        }
    }

    private _next () {
        const index = this._currentRequestIndex;
        const next  = this._requests[index];

        if (next) {
            this._currentRequestIndex += 1;
            this._request(next, index);
        } else {
            if (this._finishedAmount === this._requests.length) {
                this._onFinish(this._successFinished, this._errorFinished);
                this._active = false;
            }
        }
    }

    private async _responseHandler (response: Response) {
        const responseData = this._isJson ? await response.json()
                                          : await response.text();
        if (response.ok) {
            const validation = this._requestValidator(responseData);
            if (validation.length === 0) {
                return responseData;
            }
            throw new Error(validation);
        } else {
            throw new Error(responseData);
        }
    }

    private _request (request: RequestData<Data>, index: number, error: unknown = null, retry: number = 0) {
        if (retry > this._retry) {
            this._onError(request.data, error);
            this._errorFinished.push(request.data);
            this._finishedAmount += 1;
            this._next();
            return;
        }

        if (retry > 0) {
            this._onRetry(request.data, retry);
        }

        this._onBefore(request.data);

        return fetch(request.url, request.options)
            .then(this._responseHandler.bind(this))
            .then((data: unknown) => {
                this._onSuccess(request.data, data);
                this._successFinished.push(request.data);
                this._finishedAmount += 1;
            })
            .then(this._next.bind(this))
            .catch((error: unknown) => {
                this._request(request, index, error, retry + 1);
            });
    }
}