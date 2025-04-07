import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FiltreCvDto } from './dto/filtre-cv.dto';
import { Cv } from './entities/cv.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }


  
  @Get()
  async findAll(
    @Query() filter: FiltreCvDto,
    @Query() pagination: PaginationDto
  ) {
    if (filter.critere || filter.age !== undefined) {
      // Return filtered results WITHOUT pagination
      return this.cvService.findWithFilters(filter);
    }
    // Return non-filtered results WITH pagination
    return this.cvService.findAll(pagination);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
}
