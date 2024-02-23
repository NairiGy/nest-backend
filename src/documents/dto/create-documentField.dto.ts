import { IsNotEmpty, IsString } from 'class-validator';
export class CreateDocumentFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string;
}
