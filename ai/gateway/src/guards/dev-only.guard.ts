import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const isDev = process.env.NODE_ENV === 'development' || process.env.AI_DEBUG_MODE === 'true';
    
    if (!isDev) {
      throw new ForbiddenException('Debug endpoints only available in development mode');
    }
    
    return true;
  }
}