import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TemplatesModule } from './templates/templates.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TemplatesModule,
    DatabaseModule,
    DocumentsModule,
  ],
})
export class AppModule {}
