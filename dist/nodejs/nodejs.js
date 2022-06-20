"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const common_1 = require("./common");
class QueuedJobEmitter extends events_1.EventEmitter {
}
/**
 * @public
 */
class QueuedJobs extends common_1.QueuedJobsBase {
    emitter = new QueuedJobEmitter();
    constructor(maxQueueLength = 50, timeout = 30000, maxListeners = 100) {
        super(maxQueueLength, timeout);
        this.emitter.setMaxListeners(maxListeners);
    }
    dispatchEvent(eventName, data) {
        this.emitter.emit(eventName, data);
    }
    once(eventName, callback) {
        this.emitter.once(eventName, callback);
    }
    on(eventName, callback) {
        this.emitter.on(eventName, callback);
    }
}
exports.default = QueuedJobs;
