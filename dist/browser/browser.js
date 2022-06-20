import { __extends } from "tslib";
import { QueuedJobsBase } from './common';
/**
 * @public
 */
var QueuedJobs = /** @class */ (function (_super) {
    __extends(QueuedJobs, _super);
    function QueuedJobs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventTarget = document.createElement('div');
        return _this;
    }
    QueuedJobs.prototype.dispatchEvent = function (eventName, data) {
        var event = new CustomEvent(eventName, { detail: data });
        this.eventTarget.dispatchEvent(event);
    };
    QueuedJobs.prototype.once = function (eventName, callback) {
        var _this = this;
        var eventListenerCallback = function (data) {
            _this.eventTarget.removeEventListener(eventName, eventListenerCallback);
            callback(data.detail);
        };
        this.eventTarget.addEventListener(eventName, eventListenerCallback);
    };
    QueuedJobs.prototype.on = function (eventName, callback) {
        this.eventTarget.addEventListener(eventName, function (data) {
            callback();
        });
    };
    return QueuedJobs;
}(QueuedJobsBase));
export default QueuedJobs;
