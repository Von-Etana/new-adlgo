# ADLgo Project Architecture

## 1. Folder Structure Tree

This structure assumes a monorepo approach (e.g., using Turborepo or Nx) to manage the Backend, Mobile, and Admin apps in a single repository.

```text
adlgo/
├── apps/
│   ├── backend/                # NestJS Application
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # OTP, Social Login, KYC
│   │   │   │   ├── wallet/     # Double-Entry Ledger, Payments
│   │   │   │   ├── bidding/    # Socket.io Gateway, Events
│   │   │   │   ├── orders/     # CRUD, Proof of Delivery
│   │   │   │   └── users/      # User profiles, Driver verification
│   │   │   ├── common/         # Guards, Interceptors, Decorators
│   │   │   └── app.module.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── mobile/                 # React Native Application
│   │   ├── src/
│   │   │   ├── assets/         # 3D Icons (Bike, Car, Van), Fonts
│   │   │   ├── components/     # Reusable Flat UI (Buttons, Cards, Modals)
│   │   │   ├── navigation/     # AuthStack, AppTabs, DriverStack
│   │   │   ├── screens/
│   │   │   │   ├── auth/       # Login, OTP, Onboarding
│   │   │   │   ├── customer/   # Home, CreateOrder, Tracking
│   │   │   │   └── driver/     # Map, Bidding, Earnings
│   │   │   ├── store/          # Zustand (useAuthStore, useUserMode)
│   │   │   ├── services/       # API clients, Socket connection
│   │   │   └── utils/          # Helpers, Constants
│   │   ├── package.json
│   │   └── babel.config.js
│   │
│   └── admin/                  # React.js Admin Dashboard
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── hooks/
│       └── package.json
│
├── packages/                   # Shared libraries (Optional)
│   └── shared-types/           # Shared TypeScript interfaces/DTOs
│
├── package.json                # Root package.json
└── README.md
```

## 2. Database Schema (TypeORM / PostgreSQL)

Below is the schema definition for the core entities: User, Wallet, Transaction, Order, and Bid.

```typescript
// entities/User.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: ['customer', 'driver', 'admin'], default: 'customer' })
  role: string;

  // Driver specific fields
  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'jsonb', nullable: true })
  vehicleDetails: {
    type: 'bike' | 'car' | 'van' | 'truck';
    brand: string;
    model: string;
    plateNumber: string;
  };

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}

// entities/Wallet.entity.ts
@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ default: 'NGN' })
  currency: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}

// entities/Transaction.entity.ts
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['credit', 'debit'] })
  type: 'credit' | 'debit';

  @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'payment', 'commission'] })
  category: string;

  @Column({ nullable: true })
  reference: string; // e.g., Paystack ref or Order ID

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}

// entities/Order.entity.ts
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User) // Customer
  customer: User;

  @ManyToOne(() => User, { nullable: true }) // Assigned Driver
  driver: User;

  @Column()
  pickupAddress: string;

  @Column({ type: 'jsonb' })
  pickupCoordinates: { lat: number; lng: number };

  @Column()
  dropoffAddress: string;

  @Column({ type: 'jsonb' })
  dropoffCoordinates: { lat: number; lng: number };

  @Column('decimal', { precision: 10, scale: 2 })
  offerPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  finalPrice: number;

  @Column({ type: 'enum', enum: ['pending', 'bidding', 'accepted', 'in_transit', 'delivered', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ nullable: true })
  proofOfDeliveryUrl: string;

  @OneToMany(() => Bid, (bid) => bid.order)
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;
}

// entities/Bid.entity.ts
@Entity()
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.bids)
  order: Order;

  @ManyToOne(() => User) // Driver
  driver: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
```
