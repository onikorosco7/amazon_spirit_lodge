import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Terms } from './entities/terms.entity';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Terms])],
  providers: [TermsService],
  controllers: [TermsController],
})
export class TermsModule {}
