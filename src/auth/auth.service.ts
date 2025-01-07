import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User_Role } from '../enums/user.role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  // **Register New User**
  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { username, email, password, role } = createUserDto;

    // 1. Check if the username or email already exists
    const existingEmailUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingEmailUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Check if the username already exists
    const existingUsernameUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUsernameUser) {
      throw new ConflictException('User with this username already exists');
    }

    // 2. Ensure admin uniqueness
    if (role === User_Role.Admin) {
      const adminExists = await this.userRepository.findOne({
        where: { role: User_Role.Admin },
      });
      if (adminExists) {
        throw new ConflictException('An admin account already exists');
      }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role || User_Role.User,
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    delete user.refreshToken;

    return savedUser;
  }


  // **Login**
  async login(email: string, password: string, response: any): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate Tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    // Set refresh token in cookies
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  // **Logout**
  async logout(accessToken: string, response: any): Promise<{ message: string }> {
    const payload = this.jwtService.verify(accessToken);
    const user = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.refreshToken = null;
    await this.userRepository.save(user);

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Successfully logged out' };
  }

  // **Refresh Token**
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const user = await this.userRepository.findOne({ where: { refreshToken } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    return { accessToken };
  }

  // **Get Current User**
  async getMe(accessToken: string): Promise<Partial<User>> {
    const payload = this.jwtService.verify(accessToken);
    const user = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    delete user.password;
    delete user.refreshToken;

    return user;
  }

  // **Get All Users (Admin Only)**
  async getAllUsers(role: User_Role): Promise<Partial<User[]>> {
    if (role !== User_Role.Admin) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    const users = await this.userRepository.find();
    return users.map(user => {
      delete user.password;
      delete user.refreshToken;
      return user;
    });
  }
}
