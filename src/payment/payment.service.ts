import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DB_MESSAGES } from 'src/constants/database.constants';
import { Prisma } from 'generated/prisma/client';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { GetPaymentDto } from './dto/get-payment.dto';
@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async processPayment(
    dto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingPayment = await this.prisma.payment.findUnique({
          where: { payment_id: dto.payment_id },
        });

        if (existingPayment) {
          return existingPayment; // idempotente
        }
        const user = await tx.user.findUnique({ where: { id: dto.user_id } });
        if (!user) throw new NotFoundException(DB_MESSAGES.USER_NOT_FOUND);

        const merchant = await tx.merchant.findUnique({
          where: { id: dto.merchant_id },
        });
        if (!merchant)
          throw new NotFoundException(DB_MESSAGES.MERCHANT_NOT_FOUND);

        if (Number(user.balance) < Number(dto.amount))
          throw new BadRequestException(DB_MESSAGES.INSUFFICIENT_BALANCE);
        //restar al user
        await tx.user.update({
          where: { id: dto.user_id },
          data: { balance: { decrement: dto.amount } },
        });

        // Sumar al merchant
        await tx.merchant.update({
          where: { id: dto.merchant_id },
          data: { balance: { increment: dto.amount } },
        });
        return await tx.payment.create({
          data: {
            payment_id: dto.payment_id,
            user_id: dto.user_id,
            merchant_id: dto.merchant_id,
            amount: dto.amount,
            currency: dto.currency,
            status: 'Pagado',
          },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' //Unique constraint violation
      ) {
        const existentPayment = await this.prisma.payment.findUnique({
          where: { payment_id: dto.payment_id },
        });
        if (!existentPayment) {
          throw new InternalServerErrorException(DB_MESSAGES.PAYMENT_NOT_FOUND);
        }
        return existentPayment;
      }
      throw error;
    }
  }
  async getPaymenByMerchant(merchant_id: string): Promise<GetPaymentDto[]> {
    const existentPayment = await this.prisma.payment.findMany({
      where: { merchant_id: merchant_id },
    });
    if (!existentPayment) {
      throw new InternalServerErrorException(DB_MESSAGES.PAYMENT_NOT_FOUND);
    }
    return existentPayment;
  }
  async getAll(): Promise<GetPaymentDto[]>{
    const payments = await this.prisma.payment.findMany({
       orderBy: { created_at: 'desc' },
    })
    if (!payments) {
      throw new InternalServerErrorException(DB_MESSAGES.PAYMENT_NOT_FOUND);
    }
    return payments
  }
}
