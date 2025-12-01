import { Body, Controller, Post, Put } from '@nestjs/common';
import type { User, User as UserType } from '@prisma/client';
import { Role } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User as UserDecoretor } from 'src/common/decorators/user.decorator';
import { CreateUserInput } from './dto/create-user-input';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() data: CreateUserInput): Promise<User> {
        return this.userService.create(data);
    }

    @Auth(Role.CLIENT, Role.PROVIDER)
    @Put()
    async update(
        @UserDecoretor() user: UserType,
        @Body() data: CreateUserInput,
    ): Promise<User> {
        return this.userService.update(user.id, data);
    }
}
