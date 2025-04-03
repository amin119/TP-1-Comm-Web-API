import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './cv/entities/cv.entity';
import { Skill } from './skill/entities/skill.entity';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database : 'db.sqlite',
      synchronize: true,
      entities:[Cv, Skill, User]
    }),
    CvModule,
    UserModule,
    SkillModule],
})
export class AppModule {}

