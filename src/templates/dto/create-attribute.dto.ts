import { AttributeType } from '../entities/attribute.entity';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(Object.values(AttributeType))
  type: AttributeType;
}
