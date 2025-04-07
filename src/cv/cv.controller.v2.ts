import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { Request } from 'express';

@Controller({ path: 'cv', version: '2' })
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    if (!req['user'] || !req['user'].id) {
      throw new UnauthorizedException('User not authenticated');
    }
    console.log('REQ USER:', req['user']);
    return this.cvService.createv2(createCvDto, req['user'] );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCvDto, @Req() req: Request) {
    console.log('REQ USER:', req['user']);
    return this.cvService.updatev2(+id, updateCvDto, +req['user'].id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.cvService.removev2(+id, req['user'].id);
  }
}
