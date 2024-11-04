import {
    ERROR_PROMISE_SPLITTER_IS_ACTIVE, ERROR_PROMISE_SPLITTER_NO_RETRIES,
} from '@/service/PromiseSplitter/error/promise-splitter.error.ts';


export type PromiseSplitterExecInitItem = {
    chain: PromiseSplitterChain;
    onBefore?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onFinally?: () => void;
}
export type PromiseSplitterChain = Array<(data: any) => Promise<any>>;

export class PromiseSplitter {
    private _chains: Array<PromiseSplitterExecInitItem> = [];
    private _finishedChains: number                     = 0;
    private _chainsIsActive: boolean                    = false;
    private _activeChainIndex: number                   = 0;

    constructor (
        private readonly _limit: number,
        private readonly _retry: number,
    ) {
    }

    async exec (chains: Array<PromiseSplitterExecInitItem>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._chainsIsActive) {
                reject(new Error(ERROR_PROMISE_SPLITTER_IS_ACTIVE));
            }

            this._chains         = chains;
            this._finishedChains = 0;
            this._chainsIsActive = true;

            for (let i = 0; i < this._limit; i++) {
                this._nextChain(resolve);
            }
        });
    }

    private async _nextChain (resolve: () => void) {
        const chain = this._chains[this._activeChainIndex++];

        if (chain) {
            chain.onBefore?.();
            this._nextChainItem(null, chain.chain, 0, 0)
                .then(() => chain.onSuccess?.())
                .catch(() => chain.onError?.())
                .finally(() => {
                    chain.onFinally?.();
                    this._finishedChains += 1;
                    this._nextChain.call(this, resolve);
                });
        } else if (this._finishedChains === this._chains.length) {
            this._chainsIsActive = false;
            resolve();
        }
    }

    private async _nextChainItem (data: any, chain: PromiseSplitterChain, index: number, retry: number = 0): Promise<any> {
        if (retry > this._retry) {
            throw new Error(ERROR_PROMISE_SPLITTER_NO_RETRIES);
        }

        const item = chain[index];

        if (item) {
            return item(data)
                .then((data: any) => this._nextChainItem(data, chain, index + 1, 0))
                .catch(() => this._nextChainItem(data, chain, index, retry + 1));
        }
    }
}