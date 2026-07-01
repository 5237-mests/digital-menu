import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';

// @Module({
//   imports: [DatabaseModule, UsersModule, JwtModule.register({})],
//   controllers: [AuthController],
//   providers: [AuthService, RefreshTokensRepository, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
//   exports: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard]
// })
// export class AuthModule {}



@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UsersModule),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokensRepository,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
