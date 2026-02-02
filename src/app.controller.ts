import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './user/user.service';
import { CreatePaymentDto } from './payment/dto/create-payment.dto';
import { PaymentService } from './payment/payment.service';
import { UserResponseDto } from './user/dto/user-response.dto';
import { CreatePaymentResponseDto } from './payment/dto/create-payment-response.dto';
import { MerchantResponseDto } from './merchant/dto/merchant-response.dto';
import { MerchantService } from './merchant/merchant.service';
import { GetPaymentDto } from './payment/dto/get-payment.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly paymentService: PaymentService,
    private readonly merchantService: MerchantService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('users')
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => ({
      id: user.id,
      balance: String(user.balance),
      currency: user.currency,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }
  @Get('merchants')
  async getMerchants(): Promise<MerchantResponseDto[]> {
  const merchants = await this.merchantService.findAll();

  const result = await Promise.all(
    merchants.map(async (merchant) => ({
      id: merchant.id,
      balance: String(merchant.balance),
      currency: merchant.currency,
      payments: await this.paymentService.getPaymenByMerchant(merchant.id),
      createdAt: merchant.created_at,
      updatedAt: merchant.updated_at,
    }))
  );

  return result;
  }
  @Post('payment')
  async registerPayment(
    @Body() dto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    return await this.paymentService.processPayment(dto);
  }
  @Get('payment')
  async getPayments(): Promise<GetPaymentDto[]> {
    return await this.paymentService.getAll();
  }
}
