export declare abstract class QueuedJobsBase<TData, TResult> {
    private maxQueueLength;
    private timeout;
    queue: {
        requestId: number;
        data: TData;
    }[];
    protected lastRequestId: number;
    constructor(maxQueueLength?: number, timeout?: number);
    registerHandler(handleData: (data: TData, requestId?: number) => Promise<TResult>): void;
    handle(data: TData): Promise<TResult>;
    protected generateRequestId(): number;
    protected abstract dispatchEvent(eventName: string, data?: TResult | Error): void;
    protected abstract once(eventName: string, callback: (data: TResult | Error) => void): void;
    protected abstract on(eventName: string, callback: () => void): void;
}
