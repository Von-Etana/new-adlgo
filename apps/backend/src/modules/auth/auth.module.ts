import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';
import { Session } from './session.entity';
import { SessionGuard } from './session.guard';

@Module({
    imports: [TypeOrmModule.forFeature([User, Session])],
    providers: [AuthService, SessionGuard],
    controllers: [AuthController],
    exports: [AuthService, SessionGuard], // Export for use in other modules
})
export class AuthModule { }
