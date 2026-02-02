import { Decimal } from 'generated/prisma/internal/prismaNamespace';
export class GetPaymentDto {
  payment_id: string;
  amount: Decimal;
  currency: string;
  status: string;
  user_id: string;
  merchant_id: string;
  created_at: Date;
}
