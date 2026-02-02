import { Decimal } from "generated/prisma/internal/prismaNamespace";

export class CreatePaymentResponseDto {
  id: string;
  payment_id: string;
  amount: Decimal;
  currency: string;
  status: string;
  user_id: string;
  merchant_id: string;
  created_at: Date;

    constructor(payment: Partial<CreatePaymentResponseDto>) {
    Object.assign(this, payment);
  }
}
