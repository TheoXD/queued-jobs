"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuedJobsBase = void 0;
class QueuedJobsBase {
    maxQueueLength;
    timeout;
    queue = [];
    lastRequestId = 0;
    constructor(maxQueueLength = 50, timeout = 30000) {
        this.maxQueueLength = maxQueueLength;
        this.timeout = timeout;
    }
    registerHandler(handleData) {
        let isBusy = false;
        this.on('new', async () => {
            if (!isBusy) {
                isBusy = true;
                let item = this.queue.shift();
                while (item) {
                    try {
                        const result = await handleData(item.data, item.requestId);
                        this.dispatchEvent(`resolve:${item.requestId}`, result);
                    }
                    catch (error) {
                        this.dispatchEvent(`reject:${item.requestId}`, error instanceof Error ? error : new Error(String(error)));
                    }
                    item = this.queue.shift();
                }
                isBusy = false;
            }
        });
    }
    handle(data) {
        return new Promise((resolve, reject) => {
            const requestId = this.generateRequestId();
            while (this.queue.length >= this.maxQueueLength) {
                const item = this.queue.shift();
                if (item) {
                    this.dispatchEvent(`reject:${item.requestId}`, new Error('queue overflow'));
                }
            }
            this.queue.push({ requestId, data });
            const timer = setTimeout(() => {
                reject(new Error('timeout'));
            }, this.timeout);
            this.once(`resolve:${requestId}`, (result) => {
                clearTimeout(timer);
                resolve(result);
            });
            this.once(`reject:${requestId}`, (error) => {
                clearTimeout(timer);
                reject(error);
            });
            this.dispatchEvent('new');
        });
    }
    generateRequestId() {
        this.lastRequestId = this.lastRequestId < 4294967295 ? this.lastRequestId + 1 : 1; // 4294967295 = 2^32 - 1
        return this.lastRequestId;
    }
}
exports.QueuedJobsBase = QueuedJobsBase;
