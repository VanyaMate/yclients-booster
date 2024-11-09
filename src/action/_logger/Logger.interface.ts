export interface ILogger {
    log (log: string): void;

    success (log: string): void;

    error (log: string): void;

    reset (): void;
}