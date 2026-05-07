//Verifies the token on every protected request
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-secret-in-production';

// This guard runs BEFORE the controller method.
// It reads the Authorization header, verifies the token,
// and attaches the userId to the request object so controllers can use it.
// If the token is missing or invalid it throws 401 and the controller never runs.

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      // Attach userId to the request — controllers read it from here
      request.userId = payload.id;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}