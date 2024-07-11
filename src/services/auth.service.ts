import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminsService } from './admins.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.adminsService.findOneUsername(username);
    if (!user) {
      throw new NotFoundException('Username not found.');
    }

    const isMatch = bcrypt.compareSync(pass, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username, type: 'access' };
    const refPayload = {
      sub: Math.random() + new Date().getTime(),
      type: 'refresh',
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(refPayload);
    if (!accessToken || !refreshToken) {
      throw new Error('Bruh!');
    }

    user.refresh_token = refreshToken;
    await this.adminRepository.save(user);

    const res = this.req.res as Response;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      access_token: accessToken,
    };
  }

  async refresh(): Promise<{ access_token: string; refresh_token: string }> {
    const req = this.req;
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    const admin = await this.adminRepository.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const payload = { sub: admin.id, username: admin.username, type: 'access' };
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);

      if (!decoded || decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(payload);
      if (!newAccessToken) {
        throw new InternalServerErrorException(
          'Failed to generate access token.',
        );
      }

      const newRefreshToken = await this.jwtService.signAsync(
        { sub: Math.random() + new Date().getTime(), type: 'refresh' },
        { expiresIn: '7d' },
      );

      admin.refresh_token = newRefreshToken;
      await this.adminRepository.save(admin);

      req.res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('#2 Unauthorized');
    }
  }
}
