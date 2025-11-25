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
exports.WalletService = void 0;
var common_1 = require("@nestjs/common");
var WalletService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WalletService = _classThis = /** @class */ (function () {
        function WalletService_1(walletRepository, transactionRepository, flutterwaveService) {
            this.walletRepository = walletRepository;
            this.transactionRepository = transactionRepository;
            this.flutterwaveService = flutterwaveService;
            this.COMMISSION_RATE = 0.20; // 20%
            this.MINIMUM_BALANCE_THRESHOLD = 1000; // e.g., 1000 Naira
        }
        // Real Database Methods
        WalletService_1.prototype.getUserWallet = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet, newWallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.walletRepository.findOne({
                                where: { user: { id: userId } },
                                relations: ['user']
                            })];
                        case 1:
                            wallet = _a.sent();
                            if (!!wallet) return [3 /*break*/, 3];
                            newWallet = this.walletRepository.create({
                                user: { id: userId }, // assuming user exists
                                balance: 0,
                                currency: 'NGN'
                            });
                            return [4 /*yield*/, this.walletRepository.save(newWallet)];
                        case 2:
                            wallet = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, wallet];
                    }
                });
            });
        };
        WalletService_1.prototype.updateBalance = function (walletId, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.walletRepository.findOne({ where: { id: walletId } })];
                        case 1:
                            wallet = _a.sent();
                            if (!wallet)
                                throw new Error('Wallet not found');
                            // Use atomic increment/decrement if possible, or lock
                            // For simplicity in this phase:
                            wallet.balance = Number(wallet.balance) + Number(amount);
                            return [4 /*yield*/, this.walletRepository.save(wallet)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WalletService_1.prototype.createTransaction = function (walletId, amount, type, category, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transaction = this.transactionRepository.create({
                                wallet: { id: walletId },
                                amount: amount,
                                type: type,
                                category: category,
                                reference: reference
                            });
                            return [4 /*yield*/, this.transactionRepository.save(transaction)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WalletService_1.prototype.fundWallet = function (userId, amount, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserWallet(userId)];
                        case 1:
                            wallet = _a.sent();
                            return [4 /*yield*/, this.updateBalance(wallet.id, amount)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(wallet.id, amount, 'credit', 'deposit', reference)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    newBalance: Number(wallet.balance) + Number(amount),
                                    message: 'Wallet funded successfully',
                                }];
                    }
                });
            });
        };
        WalletService_1.prototype.getTransactions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserWallet(userId)];
                        case 1:
                            wallet = _a.sent();
                            return [2 /*return*/, this.transactionRepository.find({
                                    where: { wallet: { id: wallet.id } },
                                    order: { createdAt: 'DESC' }
                                })];
                    }
                });
            });
        };
        /**
         * Checks if a driver can go online based on their wallet balance.
         */
        WalletService_1.prototype.canDriverGoOnline = function (driverId) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserWallet(driverId)];
                        case 1:
                            wallet = _a.sent();
                            if (Number(wallet.balance) < this.MINIMUM_BALANCE_THRESHOLD) {
                                throw new common_1.BadRequestException("Insufficient balance. Minimum \u20A6".concat(this.MINIMUM_BALANCE_THRESHOLD, " required to go online."));
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Calculates and processes commission based on payment method.
         * @param orderTotal The final agreed price of the trip
         * @param paymentMethod 'WALLET' or 'CASH'
         * @param customerId
         * @param driverId
         */
        WalletService_1.prototype.processOrderPayment = function (orderTotal, paymentMethod, customerId, driverId) {
            return __awaiter(this, void 0, void 0, function () {
                var adminWalletId, driverWallet, customerWallet, commissionAmount, driverEarnings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            adminWalletId = 'admin_wallet_001';
                            return [4 /*yield*/, this.getUserWallet(driverId)];
                        case 1:
                            driverWallet = _a.sent();
                            return [4 /*yield*/, this.getUserWallet(customerId)];
                        case 2:
                            customerWallet = _a.sent();
                            commissionAmount = orderTotal * this.COMMISSION_RATE;
                            driverEarnings = orderTotal - commissionAmount;
                            if (!(paymentMethod === 'WALLET')) return [3 /*break*/, 7];
                            // 1. Deduct Full Amount from Customer
                            if (Number(customerWallet.balance) < orderTotal) {
                                throw new common_1.BadRequestException('Customer has insufficient funds');
                            }
                            return [4 /*yield*/, this.updateBalance(customerWallet.id, -orderTotal)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(customerWallet.id, orderTotal, 'debit', 'payment', "Order Payment")];
                        case 4:
                            _a.sent();
                            // 2. Credit Driver (80%)
                            return [4 /*yield*/, this.updateBalance(driverWallet.id, driverEarnings)];
                        case 5:
                            // 2. Credit Driver (80%)
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(driverWallet.id, driverEarnings, 'credit', 'earnings', "Order Earnings")];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 7:
                            if (!(paymentMethod === 'CASH')) return [3 /*break*/, 10];
                            // Driver collects 100% Cash from Customer physically.
                            // We need to deduct the 20% commission from the Driver's digital wallet.
                            if (Number(driverWallet.balance) < commissionAmount) {
                                console.warn("Driver ".concat(driverId, " has low balance for commission deduction."));
                            }
                            // Deduct 20% from Driver
                            return [4 /*yield*/, this.updateBalance(driverWallet.id, -commissionAmount)];
                        case 8:
                            // Deduct 20% from Driver
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(driverWallet.id, commissionAmount, 'debit', 'commission_deduction', "Commission Deduction (Cash Order)")];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10: return [2 /*return*/, {
                                success: true,
                                distribution: {
                                    driver: paymentMethod === 'WALLET' ? driverEarnings : orderTotal, // If cash, they keep all cash physically
                                    admin: commissionAmount,
                                    method: paymentMethod
                                }
                            }];
                    }
                });
            });
        };
        WalletService_1.prototype.payBill = function (userId, provider, identifier, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var wallet, paymentResponse, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserWallet(userId)];
                        case 1:
                            wallet = _a.sent();
                            if (Number(wallet.balance) < amount) {
                                throw new common_1.BadRequestException('Insufficient wallet balance');
                            }
                            // 1. Validate Bill Service (Optional but recommended)
                            // await this.flutterwaveService.validateBillService(provider, identifier, provider);
                            // 2. Deduct from Wallet
                            return [4 /*yield*/, this.updateBalance(wallet.id, -amount)];
                        case 2:
                            // 1. Validate Bill Service (Optional but recommended)
                            // await this.flutterwaveService.validateBillService(provider, identifier, provider);
                            // 2. Deduct from Wallet
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(wallet.id, amount, 'debit', "Bill Payment: ".concat(provider), "BILL_".concat(Date.now(), "_").concat(userId))];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 9]);
                            return [4 /*yield*/, this.flutterwaveService.createPayment({
                                    country: 'NG',
                                    customer: identifier,
                                    amount: amount,
                                    recurrence: 'ONCE',
                                    type: provider, // e.g., AIRTIME, DSTV
                                    reference: "BILL_".concat(Date.now(), "_").concat(userId),
                                })];
                        case 5:
                            paymentResponse = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Bill payment successful',
                                    data: paymentResponse,
                                    newBalance: Number(wallet.balance) - amount,
                                }];
                        case 6:
                            error_1 = _a.sent();
                            // Rollback if external API fails
                            return [4 /*yield*/, this.updateBalance(wallet.id, amount)];
                        case 7:
                            // Rollback if external API fails
                            _a.sent();
                            return [4 /*yield*/, this.createTransaction(wallet.id, amount, 'credit', "Refund: Failed Bill Payment ".concat(provider))];
                        case 8:
                            _a.sent();
                            throw error_1;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        return WalletService_1;
    }());
    __setFunctionName(_classThis, "WalletService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WalletService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WalletService = _classThis;
}();
exports.WalletService = WalletService;
