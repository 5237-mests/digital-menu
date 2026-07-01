
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// @Module({
//   imports: [DatabaseModule, AuthModule],
//   controllers: [UsersController],
//   providers: [UsersRepository, UsersService],
//   exports: [UsersRepository, UsersService]
// })
// export class UsersModule {}


@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
