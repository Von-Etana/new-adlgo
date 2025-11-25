import { IsString, IsNumber, IsEnum, IsObject, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Location DTO
export class LocationDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;

    @IsString()
    address: string;
}

// Create Order DTO
export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    pickup: LocationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    dropoff: LocationDto;

    @IsNumber()
    @Min(0)
    offerPrice: number;

    @IsEnum(['Express', 'Standard'])
    type: 'Express' | 'Standard';
}

// Bid DTO
export class CreateBidDto {
    @IsString()
    orderId: string;

    @IsString()
    driverId: string;

    @IsNumber()
    @Min(0)
    amount: number;
}

// Accept Bid DTO
export class AcceptBidDto {
    @IsString()
    orderId: string;

    @IsString()
    bidId: string;

    @IsString()
    driverId: string;
}

// Fund Wallet DTO
export class FundWalletDto {
    @IsNumber()
    @Min(1)
    amount: number;

    @IsString()
    reference: string;
}

// Bill Payment DTO
export class PayBillDto {
    @IsString()
    provider: string;

    @IsString()
    identifier: string;

    @IsNumber()
    @Min(1)
    amount: number;
}

// Flutterwave Payment DTO
export class CreatePaymentDto {
    @IsString()
    country: string;

    @IsString()
    customer: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsEnum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'])
    recurrence: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

    @IsString()
    type: string;

    @IsString()
    reference: string;
}

// User DTO
export class UserDto {
    @IsString()
    id: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(['customer', 'driver', 'admin'])
    role: 'customer' | 'driver' | 'admin';

    @IsString()
    @IsOptional()
    email?: string;
}

// Register DTO
export class RegisterDto {
    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    name: string;

    @IsEnum(['customer', 'driver'])
    role: 'customer' | 'driver';

    @IsString()
    @IsOptional()
    email?: string;
}

// Login DTO
export class LoginDto {
    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    password?: string;
}
