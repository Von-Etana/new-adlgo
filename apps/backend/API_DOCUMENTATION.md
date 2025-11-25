# ADLgo API Documentation

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   cd apps/backend
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run the server**:
   ```bash
   npm run start:dev
   ```

4. **Access Swagger Docs**: http://localhost:3000/api/docs

---

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "phone": "+2348012345678",
  "password": "securepassword",
  "role": "customer",
  "fullName": "John Doe"
}
```

**Response**:
```json
{
  "id": "uuid",
  "phone": "+2348012345678",
  "role": "customer",
  "fullName": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+2348012345678",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "token": "session-token-here",
  "user": {
    "id": "uuid",
    "phone": "+2348012345678",
    "role": "customer",
    "fullName": "John Doe"
  }
}
```

---

### Wallet

#### Get Balance
```http
GET /wallet/:userId/balance
Authorization: Bearer {token}
```

**Response**:
```json
{
  "balance": 5000,
  "currency": "NGN",
  "canGoOnline": true
}
```

#### Fund Wallet
```http
POST /wallet/fund
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id",
  "amount": 1000,
  "reference": "payment-ref-123"
}
```

#### Pay Bill
```http
POST /wallet/bill-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id",
  "provider": "electricity",
  "identifier": "1234567890",
  "amount": 5000
}
```

---

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id",
  "pickup": {
    "lat": 6.5244,
    "lng": 3.3792,
    "address": "Lagos Island"
  },
  "dropoff": {
    "lat": 6.4541,
    "lng": 3.3947,
    "address": "Ikeja"
  },
  "offerPrice": 5000,
  "type": "Express"
}
```

---

### WebSocket Events

Connect to: `ws://localhost:3000/bidding`

#### Authentication
```javascript
const socket = io('http://localhost:3000/bidding', {
  auth: {
    token: 'your-session-token'
  }
});
```

#### Create Order (Customer)
```javascript
socket.emit('create_order', {
  userId: 'user-id',
  pickup: { lat: 6.5244, lng: 3.3792, address: 'Lagos' },
  dropoff: { lat: 6.4541, lng: 3.3947, address: 'Ikeja' },
  offerPrice: 5000,
  type: 'Express'
});
```

#### Place Bid (Driver)
```javascript
socket.emit('driver_bid', {
  orderId: 'order-id',
  driverId: 'driver-id',
  amount: 4500
});
```

#### Accept Bid (Customer)
```javascript
socket.emit('accept_bid', {
  orderId: 'order-id',
  bidId: 'bid-id',
  driverId: 'driver-id'
});
```

#### Listen for Events
```javascript
// New order notification (Drivers)
socket.on('new_request', (order) => {
  console.log('New order:', order);
});

// Bid received (Customer)
socket.on('bid_received', (bid) => {
  console.log('New bid:', bid);
});

// Bid accepted (Driver)
socket.on('bid_accepted', (result) => {
  console.log('Your bid was accepted:', result);
});
```

---

## 🔐 Authentication

All protected endpoints require a Bearer token:

```http
Authorization: Bearer {your-session-token}
```

Get the token from the `/auth/login` response.

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": ["phone must be a string"],
  "error": "Bad Request"
}
```

### Unauthorized (401)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Rate Limit (429)
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## 🎯 Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Window**: 60 seconds
- **Response**: 429 Too Many Requests

---

## 🏥 Health Check

```http
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

---

## 📖 Interactive Documentation

Visit http://localhost:3000/api/docs for interactive Swagger documentation where you can:
- Test all endpoints
- See request/response schemas
- Try authentication
- View examples

---

## 🔧 Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `FLUTTERWAVE_PUBLIC_KEY` - Payment gateway public key
- `FLUTTERWAVE_SECRET_KEY` - Payment gateway secret key
- `GOOGLE_APPLICATION_CREDENTIALS` - Firebase service account path
- `PORT` - Server port (default: 3000)
- `ALLOWED_ORIGINS` - CORS allowed origins

---

## 🎊 Happy Coding!
