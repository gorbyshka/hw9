import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserSchema } from '../model/user.model';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategy/local.strategy';
import { NotFoundMiddleware } from '../middleware/notFound.middleware';

@Module({

  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/db'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],

  controllers: [UserController],
  providers: [UserService, AuthService, LocalStrategy],

})

export class UserModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NotFoundMiddleware)
      .forRoutes('*');

  }

}
