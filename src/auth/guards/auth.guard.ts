import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ALLOW_GUEST } from '../constants/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowGuest) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // check session only
    // return request.session.userId;

    const cookieToken = request.cookies?.access_token;
    const token = cookieToken || this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Access token is not found');
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('auth.secret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
    return request['user'] || request.session.userId;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
