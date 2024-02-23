import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentFieldDto } from './create-documentField.dto';
export class UpdateDocumentFieldtDto extends PartialType(
  CreateDocumentFieldDto,
) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
