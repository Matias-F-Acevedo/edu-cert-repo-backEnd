import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto:LoginDto) {
    const user = await this.userService.findByUsernameOrEmail(loginDto.identifier);

    if (!(user instanceof User)) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(createUserDto: CreateUserDto): Promise<HttpException | User> {
    try {
      const userFound = await this.userService.findByUsernameOrEmail(createUserDto.email);

      if (userFound) throw new Error('This email is registered');
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 8),
      });

      const newUserSave = await this.userRepository.save(newUser);

      const userWithoutPassword = { ...newUserSave };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    } catch (error) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }
  }
}
