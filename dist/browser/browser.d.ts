import { QueuedJobsBase } from './common';
/**
 * @public
 */
export default class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
    private eventTarget;
    protected dispatchEvent(eventName: string, data?: TResult | Error): void;
    protected once(eventName: string, callback: (data: TResult | Error) => void): void;
    protected on(eventName: string, callback: () => void): void;
}
