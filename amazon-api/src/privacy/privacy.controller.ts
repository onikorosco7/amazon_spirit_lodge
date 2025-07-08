import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('privacy')
export class PrivacyController {
    constructor(private readonly privacyService: PrivacyService) { }

    @Get()
    get() {
        return this.privacyService.get();
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    update(@Body() dto: UpdatePrivacyDto) {
        return this.privacyService.update(dto);
    }
}
