import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CvService } from './cv/cv.service';
import { UserService } from './user/user.service';
import { SkillService } from './skill/skill.service';
import { CreateCvDto } from './cv/dto/create-cv.dto';
import { CreateUserDto } from './user/dto/create-user.dto';
import { CreateSkillDto } from './skill/dto/create-skill.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cvService = app.get(CvService);
  const userService = app.get(UserService);
  const skillService = app.get(SkillService);

  console.log('Seeding database...');

  // Seed Users
  const user1 = await userService.create({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
  } as CreateUserDto);

  const user2 = await userService.create({
    username: 'jane_doe',
    email: 'jane@example.com',
    password: 'securepass',
  } as CreateUserDto);

  // Seed Skills
  const skill1 = await skillService.create({ Designation: 'NestJS' } as CreateSkillDto);
  const skill2 = await skillService.create({ Designation: 'TypeScript' } as CreateSkillDto);
  const skill3 = await skillService.create({ Designation: 'Docker' } as CreateSkillDto);

  // Seed CVs
  await cvService.create({
    name: 'John',
    firstname: 'Doe',
    age: 30,
    Cin: '12345678',
    Job: 'Software Engineer',
    path: '/cv/john-doe.pdf',
    user: user1,
    skills: [skill1, skill2],
  } as CreateCvDto);

  await cvService.create({
    name: 'Jane',
    firstname: 'Doe',
    age: 28,
    Cin: '87654321',
    Job: 'DevOps Engineer',
    path: '/cv/jane-doe.pdf',
    user: user2,
    skills: [skill2, skill3],
  } as CreateCvDto);

  console.log('Database seeding complete! ✅');
  await app.close();
}

bootstrap();
