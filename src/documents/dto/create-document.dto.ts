import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { CreateDocumentFieldDto } from './create-documentField.dto';

export type Entry = {
  name: string;
  value: string;
};
export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  templateId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateDocumentFieldDto)
  fields: CreateDocumentFieldDto[];
}
