import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }


  async findByUsernameOrEmail(identifier: string): Promise<HttpException | User> {

    try {
      const user = await this.userRepository.findOne({
        where: [
          { username: identifier },
          { email: identifier },
        ],
      });
      if (!user) {
        return new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}