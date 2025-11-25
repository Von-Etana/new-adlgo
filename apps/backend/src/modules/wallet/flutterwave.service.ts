import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { configuration } from '../../config/configuration';
import { CreatePaymentDto } from '../../common/dto';

@Injectable()
export class FlutterwaveService {
    private readonly logger = new Logger(FlutterwaveService.name);
    private readonly baseUrl = 'https://api.flutterwave.com/v3';
    private readonly secretKey = configuration().flutterwave.secretKey;

    private get headers() {
        return {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }

    async getBillCategories() {
        try {
            const response = await axios.get(`${this.baseUrl}/bill-categories`, {
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            this.logger.error('Error fetching bill categories', error.response?.data || error.message);
            throw error;
        }
    }

    async validateBillService(itemCode: string, customerIdentifier: string, billerCode: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/bill-items/${itemCode}/validate?code=${billerCode}&customer=${customerIdentifier}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            this.logger.error('Error validating bill service', error.response?.data || error.message);
            throw error;
        }
    }

    async createPayment(payload: CreatePaymentDto) {
        try {
            const response = await axios.post(`${this.baseUrl}/bills`, payload, {
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            this.logger.error('Error creating bill payment', error.response?.data || error.message);
            throw error;
        }
    }
}

