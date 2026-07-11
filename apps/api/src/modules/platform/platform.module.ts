import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { PlatformController } from './platform.controller';
@Module({ imports: [UsersModule, AuthModule], controllers: [PlatformController] }) export class PlatformModule {}
