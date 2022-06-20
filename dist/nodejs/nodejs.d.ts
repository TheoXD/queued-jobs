/**
 * @public
 */
declare class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
    private emitter;
    constructor(maxQueueLength?: number, timeout?: number, maxListeners?: number);
    protected dispatchEvent(eventName: string, data?: TResult | Error): void;
    protected once(eventName: string, callback: (data: TResult | Error) => void): void;
    protected on(eventName: string, callback: () => void): void;
}
export default QueuedJobs;

declare abstract class QueuedJobsBase<TData, TResult> {
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

export { }
