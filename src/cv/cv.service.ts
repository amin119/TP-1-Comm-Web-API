import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>
  ) {}
  create(cvData: Partial<Cv>) {
    const newCv = this.cvRepository.create(cvData);
    return this.cvRepository.save(newCv);
  }


  findAll() {
    return this.cvRepository.find({ relations: ['user', 'skills'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} cv`;
  }

  update(id: number, updateCvDto: UpdateCvDto) {
    return `This action updates a #${id} cv`;
  }

  remove(id: number) {
    return `This action removes a #${id} cv`;
  }
}
