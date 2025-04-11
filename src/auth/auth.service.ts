import { Injectable, ConflictException,UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByUsernameOrEmail(dto.username, dto.email);
    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const { username, email } = dto;
    const user = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        salt,
        role: 'user' 
      });

      const { password: _, salt: __, ...result } = user;
      return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const { password, ...result } = user;
    return result;
  }
}
