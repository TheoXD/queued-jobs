import { __awaiter, __generator } from "tslib";
var QueuedJobsBase = /** @class */ (function () {
    function QueuedJobsBase(maxQueueLength, timeout) {
        if (maxQueueLength === void 0) { maxQueueLength = 50; }
        if (timeout === void 0) { timeout = 30000; }
        this.maxQueueLength = maxQueueLength;
        this.timeout = timeout;
        this.queue = [];
        this.lastRequestId = 0;
    }
    QueuedJobsBase.prototype.registerHandler = function (handleData) {
        var _this = this;
        var isBusy = false;
        this.on('new', function () { return __awaiter(_this, void 0, void 0, function () {
            var item, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!isBusy) return [3 /*break*/, 7];
                        isBusy = true;
                        item = this.queue.shift();
                        _a.label = 1;
                    case 1:
                        if (!item) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, handleData(item.data, item.requestId)];
                    case 3:
                        result = _a.sent();
                        this.dispatchEvent("resolve:".concat(item.requestId), result);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.dispatchEvent("reject:".concat(item.requestId), error_1 instanceof Error ? error_1 : new Error(String(error_1)));
                        return [3 /*break*/, 5];
                    case 5:
                        item = this.queue.shift();
                        return [3 /*break*/, 1];
                    case 6:
                        isBusy = false;
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    QueuedJobsBase.prototype.handle = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var requestId = _this.generateRequestId();
            while (_this.queue.length >= _this.maxQueueLength) {
                var item = _this.queue.shift();
                if (item) {
                    _this.dispatchEvent("reject:".concat(item.requestId), new Error('queue overflow'));
                }
            }
            _this.queue.push({ requestId: requestId, data: data });
            var timer = setTimeout(function () {
                reject(new Error('timeout'));
            }, _this.timeout);
            _this.once("resolve:".concat(requestId), function (result) {
                clearTimeout(timer);
                resolve(result);
            });
            _this.once("reject:".concat(requestId), function (error) {
                clearTimeout(timer);
                reject(error);
            });
            _this.dispatchEvent('new');
        });
    };
    QueuedJobsBase.prototype.generateRequestId = function () {
        this.lastRequestId = this.lastRequestId < 4294967295 ? this.lastRequestId + 1 : 1; // 4294967295 = 2^32 - 1
        return this.lastRequestId;
    };
    return QueuedJobsBase;
}());
export { QueuedJobsBase };
