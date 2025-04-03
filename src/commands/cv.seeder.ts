import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { CreateCvDto } from '../cv/dto/create-cv.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateSkillDto } from '../skill/dto/create-skill.dto';
import { randFirstName, randLastName, randEmail, randJobTitle, randNumber } from '@ngneat/falso';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const skillService = app.get(SkillService);
  const cvService = app.get(CvService);

  console.log('🔹 Seeding database...');

  // Creating random users
  const user1 = await userService.create({
    username: randFirstName().toLowerCase(),
    email: randEmail(),
    password: 'password123',
  } as CreateUserDto);

  const user2 = await userService.create({
    username: randFirstName().toLowerCase(),
    email: randEmail(),
    password: 'securepass',
  } as CreateUserDto);

  // Creating random skills
  const skill1 = await skillService.create({ Designation: 'NestJS' } as CreateSkillDto);
  const skill2 = await skillService.create({ Designation: 'TypeScript' } as CreateSkillDto);
  const skill3 = await skillService.create({ Designation: 'Docker' } as CreateSkillDto);

  // Creating random CVs
  await cvService.create({
    name: randLastName(),
    firstname: randFirstName(),
    age: randNumber({ min: 20, max: 50 }),
    Cin: randNumber({ min: 10000000, max: 99999999 }).toString(),
    Job: randJobTitle(),
    path: '/cv/sample.pdf',
    user: user1,
    skills: [skill1, skill2],
  } as CreateCvDto);

  await cvService.create({
    name: randLastName(),
    firstname: randFirstName(),
    age: randNumber({ min: 20, max: 50 }),
    Cin: randNumber({ min: 10000000, max: 99999999 }).toString(),
    Job: randJobTitle(),
    path: '/cv/sample2.pdf',
    user: user2,
    skills: [skill2, skill3],
  } as CreateCvDto);

  console.log('✅ Database seeding complete!');
  await app.close();
}

bootstrap();
