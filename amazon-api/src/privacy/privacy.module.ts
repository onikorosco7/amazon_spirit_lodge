import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privacy } from './entities/privacy.entity';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Privacy])],
  controllers: [PrivacyController],
  providers: [PrivacyService],
})
export class PrivacyModule { }
