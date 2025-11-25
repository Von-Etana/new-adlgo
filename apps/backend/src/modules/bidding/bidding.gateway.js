"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiddingGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var BiddingGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({ cors: true, namespace: '/bidding' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _handleDriverJoin_decorators;
    var _handleCreateOrder_decorators;
    var _handleDriverBid_decorators;
    var _handleAcceptBid_decorators;
    var BiddingGateway = _classThis = /** @class */ (function () {
        function BiddingGateway_1(biddingService) {
            this.biddingService = (__runInitializers(this, _instanceExtraInitializers), biddingService);
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger('BiddingGateway'));
        }
        BiddingGateway_1.prototype.handleConnection = function (client) {
            this.logger.log("Client connected: ".concat(client.id));
            // In a real app, verify token here and join user/driver specific rooms
            // client.join(`user_${userId}`);
        };
        BiddingGateway_1.prototype.handleDisconnect = function (client) {
            this.logger.log("Client disconnected: ".concat(client.id));
        };
        BiddingGateway_1.prototype.handleDriverJoin = function (client, driverId) {
            // Drivers join a room based on their geohash or simply 'drivers' for this MVP
            client.join('drivers_available');
            this.logger.log("Driver ".concat(driverId, " joined available pool"));
            return { event: 'joined', data: 'drivers_available' };
        };
        BiddingGateway_1.prototype.handleCreateOrder = function (data, client) {
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("New Order from ".concat(data.userId, ": ").concat(data.offerPrice));
                            return [4 /*yield*/, this.biddingService.createOrder(data)];
                        case 1:
                            order = _a.sent();
                            // 1. Notify Drivers within 5km (Mocked as broadcasting to 'drivers_available')
                            this.server.to('drivers_available').emit('new_request', order);
                            // 2. Join the client to the order room to receive bids
                            client.join("order_".concat(order.id));
                            return [2 /*return*/, { event: 'order_created', data: order }];
                    }
                });
            });
        };
        BiddingGateway_1.prototype.handleDriverBid = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var bid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Driver ".concat(data.driverId, " bid ").concat(data.amount, " on order ").concat(data.orderId));
                            return [4 /*yield*/, this.biddingService.placeBid(data)];
                        case 1:
                            bid = _a.sent();
                            // Notify the Customer
                            this.server.to("order_".concat(data.orderId)).emit('bid_received', bid);
                            return [2 /*return*/, { event: 'bid_placed', data: bid }];
                    }
                });
            });
        };
        BiddingGateway_1.prototype.handleAcceptBid = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Customer accepted bid ".concat(data.bidId, " for order ").concat(data.orderId));
                            return [4 /*yield*/, this.biddingService.acceptBid(data)];
                        case 1:
                            result = _a.sent();
                            // Notify the specific Driver
                            // In production, we'd map driverId to socketId or have drivers join `driver_${driverId}`
                            this.server.emit("bid_accepted_".concat(data.driverId), result);
                            // Notify everyone else the order is taken (optional, to remove from feed)
                            this.server.to('drivers_available').emit('order_taken', { orderId: data.orderId });
                            return [2 /*return*/, { event: 'order_finalized', data: result }];
                    }
                });
            });
        };
        return BiddingGateway_1;
    }());
    __setFunctionName(_classThis, "BiddingGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleDriverJoin_decorators = [(0, websockets_1.SubscribeMessage)('join_driver_room')];
        _handleCreateOrder_decorators = [(0, websockets_1.SubscribeMessage)('create_order')];
        _handleDriverBid_decorators = [(0, websockets_1.SubscribeMessage)('driver_bid')];
        _handleAcceptBid_decorators = [(0, websockets_1.SubscribeMessage)('accept_bid')];
        __esDecorate(_classThis, null, _handleDriverJoin_decorators, { kind: "method", name: "handleDriverJoin", static: false, private: false, access: { has: function (obj) { return "handleDriverJoin" in obj; }, get: function (obj) { return obj.handleDriverJoin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleCreateOrder_decorators, { kind: "method", name: "handleCreateOrder", static: false, private: false, access: { has: function (obj) { return "handleCreateOrder" in obj; }, get: function (obj) { return obj.handleCreateOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleDriverBid_decorators, { kind: "method", name: "handleDriverBid", static: false, private: false, access: { has: function (obj) { return "handleDriverBid" in obj; }, get: function (obj) { return obj.handleDriverBid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleAcceptBid_decorators, { kind: "method", name: "handleAcceptBid", static: false, private: false, access: { has: function (obj) { return "handleAcceptBid" in obj; }, get: function (obj) { return obj.handleAcceptBid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BiddingGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BiddingGateway = _classThis;
}();
exports.BiddingGateway = BiddingGateway;
