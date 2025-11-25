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
exports.Wallet = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../users/user.entity");
var transaction_entity_1 = require("./transaction.entity");
var Wallet = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _balance_decorators;
    var _balance_initializers = [];
    var _balance_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _transactions_decorators;
    var _transactions_initializers = [];
    var _transactions_extraInitializers = [];
    var Wallet = _classThis = /** @class */ (function () {
        function Wallet_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.balance = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _balance_initializers, void 0));
            this.currency = (__runInitializers(this, _balance_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.user = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.transactions = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _transactions_initializers, void 0));
            __runInitializers(this, _transactions_extraInitializers);
        }
        return Wallet_1;
    }());
    __setFunctionName(_classThis, "Wallet");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _balance_decorators = [(0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 })];
        _currency_decorators = [(0, typeorm_1.Column)({ default: 'NGN' })];
        _user_decorators = [(0, typeorm_1.OneToOne)(function () { return user_entity_1.User; }, function (user) { return user.wallet; }), (0, typeorm_1.JoinColumn)()];
        _transactions_decorators = [(0, typeorm_1.OneToMany)(function () { return transaction_entity_1.Transaction; }, function (tx) { return tx.wallet; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _balance_decorators, { kind: "field", name: "balance", static: false, private: false, access: { has: function (obj) { return "balance" in obj; }, get: function (obj) { return obj.balance; }, set: function (obj, value) { obj.balance = value; } }, metadata: _metadata }, _balance_initializers, _balance_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: function (obj) { return "transactions" in obj; }, get: function (obj) { return obj.transactions; }, set: function (obj, value) { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Wallet = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Wallet = _classThis;
}();
exports.Wallet = Wallet;
