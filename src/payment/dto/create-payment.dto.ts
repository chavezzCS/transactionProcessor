import {
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  merchant_id: string;

  @IsUUID()
  payment_id: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['PEN']) // ajusta según el reto
  currency: string;
}