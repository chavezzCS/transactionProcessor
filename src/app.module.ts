import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentService } from './payment/payment.service';
import { MerchantService } from './merchant/merchant.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, UsersService, PaymentService, MerchantService],
})
export class AppModule {}
