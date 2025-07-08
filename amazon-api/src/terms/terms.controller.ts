import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { TermsService } from './terms.service';
import { UpdateTermsDto } from './dto/update-terms.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('terms')
export class TermsController {
  constructor(private readonly service: TermsService) {}

  @Get()
  getTerms() {
    return this.service.get();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() dto: UpdateTermsDto) {
    return this.service.update(dto);
  }
}
