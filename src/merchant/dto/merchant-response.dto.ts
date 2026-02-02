import { GetPaymentDto } from "src/payment/dto/get-payment.dto";


export class MerchantResponseDto {
  id: string;
  balance: number;
  currency: string;
  payments?: GetPaymentDto[];
  createdAt: Date;
  updatedAt: Date;
}