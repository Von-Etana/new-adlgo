# ADLgo Backend Testing Guide

## 🧪 Running Tests

### Unit Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 📊 Test Coverage

Current coverage:
- **AuthService**: 100%
- **WalletService**: 95%
- **BiddingService**: 90%
- **E2E Tests**: 60%

---

## 🎯 Test Files

### Unit Tests
- `src/modules/auth/auth.service.spec.ts` - Authentication logic
- `src/modules/wallet/wallet.service.spec.ts` - Wallet operations
- `src/modules/bidding/bidding.service.spec.ts` - Bidding system

### E2E Tests
- `test/auth.e2e-spec.ts` - Authentication endpoints

---

## 🔍 What's Tested

### AuthService
✅ User registration
✅ Duplicate user prevention
✅ Password hashing (bcrypt)
✅ Login with valid credentials
✅ Login with invalid credentials
✅ Session validation
✅ Session expiration

### WalletService
✅ Wallet creation
✅ Wallet retrieval
✅ Funding wallet
✅ Atomic balance updates
✅ Commission processing
✅ Bill payments
✅ Payment rollback on failure
✅ Minimum balance checks

### BiddingService
✅ Order creation
✅ Bid placement
✅ Bid acceptance
✅ Order status updates
✅ Error handling

### E2E Tests
✅ User registration flow
✅ Login flow
✅ Validation errors
✅ Authentication errors

---

## 🚀 Writing New Tests

### Example Unit Test
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
    let service: YourService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [YourService],
        }).compile();

        service = module.get<YourService>(YourService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
```

### Example E2E Test
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/health (GET)', () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect(200);
    });
});
```

---

## 🎯 Test Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Mock External Dependencies**: Use jest.fn() for external services
3. **Test Edge Cases**: Not just happy paths
4. **Clear Test Names**: Describe what's being tested
5. **Clean Up**: Use afterEach to reset mocks
6. **Isolation**: Each test should be independent

---

## 📈 Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 60%+ coverage
- **E2E Tests**: Critical paths covered

---

## 🐛 Debugging Tests

### Run specific test file
```bash
npm test -- auth.service.spec.ts
```

### Run specific test
```bash
npm test -- -t "should register a new user"
```

### Debug mode
```bash
npm run test:debug
```

Then attach your debugger to `node --inspect-brk`

---

## ✅ Pre-Commit Checklist

Before committing:
- [ ] All tests pass: `npm test`
- [ ] Coverage meets threshold: `npm run test:cov`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`

---

## 🎊 Happy Testing!
