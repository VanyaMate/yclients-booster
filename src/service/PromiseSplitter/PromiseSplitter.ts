import {
    ERROR_PROMISE_SPLITTER_IS_ACTIVE, ERROR_PROMISE_SPLITTER_NO_RETRIES,
} from '@/service/PromiseSplitter/error/promise-splitter.error.ts';


export type PromiseSplitterExecInitItem = {
    chain: PromiseSplitterChain;
    onBefore?: () => void;
    onSuccess?: (data: unknown) => void;
    onError?: () => void;
    onFinally?: () => void;
}
export type PromiseSplitterChain = Array<(data: any) => Promise<any>>;

export class PromiseSplitter {
    private _chains: Array<PromiseSplitterExecInitItem> = [];
    private _finishedChains: number                     = 0;
    private _chainsIsActive: boolean                    = false;
    private _activeChainIndex: number                   = 0;
    private _response: Array<unknown>                   = [];

    constructor (
        private readonly _limit: number,
        private readonly _retry: number,
    ) {
    }

    async exec<T> (chains: Array<PromiseSplitterExecInitItem>): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve, reject) => {
            if (this._chainsIsActive) {
                reject(new Error(ERROR_PROMISE_SPLITTER_IS_ACTIVE));
            }

            this._chains           = chains;
            this._finishedChains   = 0;
            this._chainsIsActive   = true;
            this._activeChainIndex = 0;

            for (let i = 0; i < this._limit; i++) {
                this._nextChain<T>(resolve);
            }
        });
    }

    private async _nextChain<T> (resolve: (response: Array<T>) => void) {
        const index = this._activeChainIndex++;
        const chain = this._chains[index];

        if (chain) {
            chain.onBefore?.();
            this._nextChainItem(null, chain.chain, 0, 0)
                .then((data: unknown) => {
                    this._response[index] = data;
                    chain.onSuccess?.(data);
                })
                .catch(() => chain.onError?.())
                .finally(() => {
                    chain.onFinally?.();
                    this._finishedChains += 1;
                    this._nextChain(resolve);
                });
        } else if (this._finishedChains === this._chains.length) {
            this._chainsIsActive = false;
            resolve(this._response as Array<T>);
        }
    }

    private async _nextChainItem (data: unknown, chain: PromiseSplitterChain, index: number, retry: number = 0): Promise<unknown> {
        if (retry > this._retry) {
            throw new Error(ERROR_PROMISE_SPLITTER_NO_RETRIES);
        }

        const item = chain[index];

        if (item) {
            return item(data)
                .then((data: any) => this._nextChainItem(data, chain, index + 1, 0))
                .catch(() => this._nextChainItem(data, chain, index, retry + 1));
        }

        return data;
    }
}