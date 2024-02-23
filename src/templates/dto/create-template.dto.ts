import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttributeDto } from './create-attribute.dto';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateAttributeDto)
  attributes: CreateAttributeDto[];
}
