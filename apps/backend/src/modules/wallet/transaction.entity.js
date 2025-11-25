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
exports.Transaction = void 0;
var typeorm_1 = require("typeorm");
var wallet_entity_1 = require("./wallet.entity");
var Transaction = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _wallet_decorators;
    var _wallet_initializers = [];
    var _wallet_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var Transaction = _classThis = /** @class */ (function () {
        function Transaction_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.amount = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.type = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.reference = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _reference_initializers, void 0)); // e.g., Paystack ref or Order ID
            this.wallet = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _wallet_initializers, void 0));
            this.createdAt = (__runInitializers(this, _wallet_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return Transaction_1;
    }());
    __setFunctionName(_classThis, "Transaction");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _amount_decorators = [(0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 })];
        _type_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['credit', 'debit'] })];
        _category_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['deposit', 'withdrawal', 'payment', 'commission', 'earnings', 'bill_payment'] })];
        _reference_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _wallet_decorators = [(0, typeorm_1.ManyToOne)(function () { return wallet_entity_1.Wallet; }, function (wallet) { return wallet.transactions; })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
        __esDecorate(null, null, _wallet_decorators, { kind: "field", name: "wallet", static: false, private: false, access: { has: function (obj) { return "wallet" in obj; }, get: function (obj) { return obj.wallet; }, set: function (obj, value) { obj.wallet = value; } }, metadata: _metadata }, _wallet_initializers, _wallet_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Transaction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Transaction = _classThis;
}();
exports.Transaction = Transaction;
