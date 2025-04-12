import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from 'src/skill/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { FiltreCvDto } from './dto/filtre-cv.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createCvDto: CreateCvDto): Promise<Cv> {
    const newCv = this.cvRepository.create(createCvDto);
    return this.cvRepository.save(newCv);
  }
  async createCv(
    arg0: {
      name: string;
      firstname: string;
      age: number;
      cin: string;
      job: string;
      path: string;
    },
    userId: number,
    skillIds: number[],
  ): Promise<Cv> {
    const { name, firstname, age, cin, job, path } = arg0;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const skills = await this.skillRepository.findByIds(skillIds);
    const newCv = this.cvRepository.create({
      name,
      firstname,
      age,
      cin,
      job,
      path,
      user,
      skills,
    });

    return this.cvRepository.save(newCv);
  }

  findOne(id: number): Promise<Cv | null> {
    return this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });
  }
  async findAll(pagination?: PaginationDto) {
    return this.paginationService.paginate(
      this.cvRepository,
      pagination?.page,
      pagination?.limit,
      { relations: ['user', 'skills'] },
    );
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv | null> {
    await this.cvRepository.update(id, updateCvDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cvRepository.delete(id);
  }

  async addSkillToCv(cvId: number, skillId: number): Promise<Cv | null> {
    const cv = await this.findOne(cvId);
    const skill = await this.skillRepository.findOneBy({ id: skillId });
    if (cv != null) {
      if (!cv.skills) cv.skills = [];
      if (skill != null) cv.skills.push(skill);
      return this.cvRepository.save(cv);
    } else return null;
  }

  findCvsByUser(userId: number): Promise<Cv[]> {
    return this.cvRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'skills'],
    });
  }

  async findWithFilters(filter: FiltreCvDto): Promise<Cv[]> {
    const { critere, age } = filter;

    const query = this.cvRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.user', 'user')
      .leftJoinAndSelect('cv.skills', 'skills');

    if (critere) {
      query.andWhere(
        'cv.name LIKE :crit OR cv.firstname LIKE :crit OR cv.job LIKE :crit',
        { crit: `%${critere}%` },
      );
    }

    if (age !== undefined) {
      query.andWhere('cv.age = :age', { age });
    }

    return await query.getMany();
  }
  async updatev2(id: number, updateDto, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });
    if (!cv || cv.user.id !== userId) {
      throw new UnauthorizedException("You can't modify this CV.");
    }
    cv.skills = [];

    const newSkills = await this.skillRepository.findByIds(updateDto.skillIds);

    cv.skills = newSkills;

    if (updateDto.name) cv.name = updateDto.name;
    if (updateDto.firstname) cv.firstname = updateDto.firstname;
    if (updateDto.age) cv.age = updateDto.age;
    if (updateDto.cin) cv.cin = updateDto.cin;
    if (updateDto.job) cv.job = updateDto.job;
    if (updateDto.path) cv.path = updateDto.path;

    return this.cvRepository.save(cv);
  }

  async removev2(id: number, userId: string) {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cv || cv.user.id !== +userId) {
      throw new UnauthorizedException("You can't delete this CV.");
    }
    return this.cvRepository.delete(id);
  }
  async createv2(createCvDto: CreateCvDto, user: any): Promise<Cv> {
    const userFound = await this.userRepository.findOne({
      where: { id: user.id },
    });
    console.log('User from middleware:', userFound);

    if (!userFound) {
      throw new Error('User not found');
    }

    const skills = await this.skillRepository.findByIds(
      createCvDto.skillIds || [],
    );

    const newCv = this.cvRepository.create({
      ...createCvDto,
      user: userFound,
      skills,
    });
    return this.cvRepository.save(newCv);
  }
  async updateImage(id: number, fileName: string) {
    const cv = await this.cvRepository.findOneBy({ id });
    if (!cv) throw new NotFoundException('CV not found');
    cv.path = fileName;
    return this.cvRepository.save(cv);
  }
  async findAllv2(user) {
    if (user.role == 'admin') {
      return await this.cvRepository.find();
    }
    return await this.cvRepository.find({
      where: {
        user: {
          id: user.userId,
        },
      },
    });
  }

  async findOnev2(id: number) {
    return await this.cvRepository.findOne({ where: { id } });
  }
}
