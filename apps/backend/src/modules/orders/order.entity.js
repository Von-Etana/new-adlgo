"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../users/user.entity");
var bid_entity_1 = require("../bidding/bid.entity");
var Order = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _customer_decorators;
    var _customer_initializers = [];
    var _customer_extraInitializers = [];
    var _driver_decorators;
    var _driver_initializers = [];
    var _driver_extraInitializers = [];
    var _pickupAddress_decorators;
    var _pickupAddress_initializers = [];
    var _pickupAddress_extraInitializers = [];
    var _pickupCoordinates_decorators;
    var _pickupCoordinates_initializers = [];
    var _pickupCoordinates_extraInitializers = [];
    var _dropoffAddress_decorators;
    var _dropoffAddress_initializers = [];
    var _dropoffAddress_extraInitializers = [];
    var _dropoffCoordinates_decorators;
    var _dropoffCoordinates_initializers = [];
    var _dropoffCoordinates_extraInitializers = [];
    var _offerPrice_decorators;
    var _offerPrice_initializers = [];
    var _offerPrice_extraInitializers = [];
    var _finalPrice_decorators;
    var _finalPrice_initializers = [];
    var _finalPrice_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _proofOfDeliveryUrl_decorators;
    var _proofOfDeliveryUrl_initializers = [];
    var _proofOfDeliveryUrl_extraInitializers = [];
    var _bids_decorators;
    var _bids_initializers = [];
    var _bids_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var Order = _classThis = /** @class */ (function () {
        function Order_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.customer = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customer_initializers, void 0));
            this.driver = (__runInitializers(this, _customer_extraInitializers), __runInitializers(this, _driver_initializers, void 0));
            this.pickupAddress = (__runInitializers(this, _driver_extraInitializers), __runInitializers(this, _pickupAddress_initializers, void 0));
            this.pickupCoordinates = (__runInitializers(this, _pickupAddress_extraInitializers), __runInitializers(this, _pickupCoordinates_initializers, void 0));
            this.dropoffAddress = (__runInitializers(this, _pickupCoordinates_extraInitializers), __runInitializers(this, _dropoffAddress_initializers, void 0));
            this.dropoffCoordinates = (__runInitializers(this, _dropoffAddress_extraInitializers), __runInitializers(this, _dropoffCoordinates_initializers, void 0));
            this.offerPrice = (__runInitializers(this, _dropoffCoordinates_extraInitializers), __runInitializers(this, _offerPrice_initializers, void 0));
            this.finalPrice = (__runInitializers(this, _offerPrice_extraInitializers), __runInitializers(this, _finalPrice_initializers, void 0));
            this.status = (__runInitializers(this, _finalPrice_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.proofOfDeliveryUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _proofOfDeliveryUrl_initializers, void 0));
            this.bids = (__runInitializers(this, _proofOfDeliveryUrl_extraInitializers), __runInitializers(this, _bids_initializers, void 0));
            this.createdAt = (__runInitializers(this, _bids_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return Order_1;
    }());
    __setFunctionName(_classThis, "Order");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _customer_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; })];
        _driver_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true })];
        _pickupAddress_decorators = [(0, typeorm_1.Column)()];
        _pickupCoordinates_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _dropoffAddress_decorators = [(0, typeorm_1.Column)()];
        _dropoffCoordinates_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _offerPrice_decorators = [(0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 })];
        _finalPrice_decorators = [(0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'bidding', 'accepted', 'in_transit', 'delivered', 'cancelled'], default: 'pending' })];
        _proofOfDeliveryUrl_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _bids_decorators = [(0, typeorm_1.OneToMany)(function () { return bid_entity_1.Bid; }, function (bid) { return bid.order; })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _customer_decorators, { kind: "field", name: "customer", static: false, private: false, access: { has: function (obj) { return "customer" in obj; }, get: function (obj) { return obj.customer; }, set: function (obj, value) { obj.customer = value; } }, metadata: _metadata }, _customer_initializers, _customer_extraInitializers);
        __esDecorate(null, null, _driver_decorators, { kind: "field", name: "driver", static: false, private: false, access: { has: function (obj) { return "driver" in obj; }, get: function (obj) { return obj.driver; }, set: function (obj, value) { obj.driver = value; } }, metadata: _metadata }, _driver_initializers, _driver_extraInitializers);
        __esDecorate(null, null, _pickupAddress_decorators, { kind: "field", name: "pickupAddress", static: false, private: false, access: { has: function (obj) { return "pickupAddress" in obj; }, get: function (obj) { return obj.pickupAddress; }, set: function (obj, value) { obj.pickupAddress = value; } }, metadata: _metadata }, _pickupAddress_initializers, _pickupAddress_extraInitializers);
        __esDecorate(null, null, _pickupCoordinates_decorators, { kind: "field", name: "pickupCoordinates", static: false, private: false, access: { has: function (obj) { return "pickupCoordinates" in obj; }, get: function (obj) { return obj.pickupCoordinates; }, set: function (obj, value) { obj.pickupCoordinates = value; } }, metadata: _metadata }, _pickupCoordinates_initializers, _pickupCoordinates_extraInitializers);
        __esDecorate(null, null, _dropoffAddress_decorators, { kind: "field", name: "dropoffAddress", static: false, private: false, access: { has: function (obj) { return "dropoffAddress" in obj; }, get: function (obj) { return obj.dropoffAddress; }, set: function (obj, value) { obj.dropoffAddress = value; } }, metadata: _metadata }, _dropoffAddress_initializers, _dropoffAddress_extraInitializers);
        __esDecorate(null, null, _dropoffCoordinates_decorators, { kind: "field", name: "dropoffCoordinates", static: false, private: false, access: { has: function (obj) { return "dropoffCoordinates" in obj; }, get: function (obj) { return obj.dropoffCoordinates; }, set: function (obj, value) { obj.dropoffCoordinates = value; } }, metadata: _metadata }, _dropoffCoordinates_initializers, _dropoffCoordinates_extraInitializers);
        __esDecorate(null, null, _offerPrice_decorators, { kind: "field", name: "offerPrice", static: false, private: false, access: { has: function (obj) { return "offerPrice" in obj; }, get: function (obj) { return obj.offerPrice; }, set: function (obj, value) { obj.offerPrice = value; } }, metadata: _metadata }, _offerPrice_initializers, _offerPrice_extraInitializers);
        __esDecorate(null, null, _finalPrice_decorators, { kind: "field", name: "finalPrice", static: false, private: false, access: { has: function (obj) { return "finalPrice" in obj; }, get: function (obj) { return obj.finalPrice; }, set: function (obj, value) { obj.finalPrice = value; } }, metadata: _metadata }, _finalPrice_initializers, _finalPrice_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _proofOfDeliveryUrl_decorators, { kind: "field", name: "proofOfDeliveryUrl", static: false, private: false, access: { has: function (obj) { return "proofOfDeliveryUrl" in obj; }, get: function (obj) { return obj.proofOfDeliveryUrl; }, set: function (obj, value) { obj.proofOfDeliveryUrl = value; } }, metadata: _metadata }, _proofOfDeliveryUrl_initializers, _proofOfDeliveryUrl_extraInitializers);
        __esDecorate(null, null, _bids_decorators, { kind: "field", name: "bids", static: false, private: false, access: { has: function (obj) { return "bids" in obj; }, get: function (obj) { return obj.bids; }, set: function (obj, value) { obj.bids = value; } }, metadata: _metadata }, _bids_initializers, _bids_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
}();
exports.Order = Order;
