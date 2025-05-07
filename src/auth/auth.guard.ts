import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWT_SECRET } from 'src/shared/constants';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  email?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const { userId } = request.params;
    if (!userId) return true;

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    try {
      const user = this.jwtService.verify<JwtPayload>(token, {
        secret: JWT_SECRET,
      });
      if (!user || user.sub !== parseInt(userId)) {
        return false;
      }
      request['user'] = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
