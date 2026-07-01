import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import type { PublicUser } from './types/user-record';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<PublicUser[]>;
    create(dto: CreateUserDto): Promise<PublicUser>;
    update(id: number, dto: UpdateUserDto): Promise<PublicUser>;
    remove(id: number): Promise<{
        readonly success: true;
    }>;
}
