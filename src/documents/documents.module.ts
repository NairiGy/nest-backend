import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Template } from 'src/templates/entities/template.entity';
import { Attribute } from 'src/templates/entities/attribute.entity';
import { DocumentField } from './entities/documentField.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Template, Attribute, DocumentField]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
