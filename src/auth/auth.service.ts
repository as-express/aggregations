import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { signupDto } from './dto/singup.dto';
import { hash, verify } from 'argon2';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async signup(dto: signupDto) {
    dto.password = await hash(dto.password);
    const user = await this.userService.createUser(dto);

    return this.issueTokens(user.id);
  }

  async login(dto: loginDto) {
    const user = await this.userService.getUser(dto.email);
    const validPassword = await verify(user.password, dto.password);
    if (!validPassword) {
      throw new BadRequestException('Password is not valid');
    }
    return this.issueTokens(user.id);
  }

  private issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, { expiresIn: '1d' });

    return { accessToken: accessToken };
  }
}
