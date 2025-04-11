import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './common/auth.middleware';

import * as dotenv from 'dotenv';
import { Skill } from './skill/entities/skill.entity';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';
dotenv.config();
@Module({
  imports: [
    UserModule,
    CvModule,
    SkillModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ExerciceWeb2',
      entities: [Skill, User, Cv],
      synchronize: false,
      dropSchema: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'cv', method: RequestMethod.POST, version: '2' },
        { path: 'cv/:id', method: RequestMethod.PUT, version: '2' },
        { path: 'cv/:id', method: RequestMethod.DELETE, version: '2' },
      );
  }
}
