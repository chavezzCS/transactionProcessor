import { GetPaymentDto } from "src/payment/dto/get-payment.dto";


export class MerchantResponseDto {
  id: string;
  balance: number;      // puedes usar number o string si manejas Decimal.js
  currency: string;

  payments?: GetPaymentDto[]; // opcional, array de pagos relacionados

  createdAt: Date;
  updatedAt: Date;
}