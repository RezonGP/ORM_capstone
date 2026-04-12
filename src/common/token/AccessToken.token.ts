import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules-system/prisma/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private token: TokenService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const auth = req.headers.authorization;

        if (!auth?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing access token');
        }

        const accessToken = auth.slice('Bearer '.length).trim();

        try {
            const decoded: any = this.token.verifyAccessToken(accessToken);
            req['user'] = { userId: decoded.userId };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}