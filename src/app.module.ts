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
<<<<<<< HEAD
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

=======
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CvModule,
    SkillModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Skill, User, Cv],
      synchronize: false,
      dropSchema: false,
    }),
<<<<<<< HEAD
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
=======
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
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
