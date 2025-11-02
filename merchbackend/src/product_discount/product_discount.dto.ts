import { IsBoolean, isBoolean, IsDate, IsDateString, IsInt, isInt, IsNumber, IsString, isString } from "class-validator";

export class CerateProductDiscountDto{
    @IsInt()
    product_id: number;
    
    @IsString()
    discount_type: string;

    @IsNumber({maxDecimalPlaces: 2})
    discount_value: number;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsBoolean()
    is_active: boolean;
}