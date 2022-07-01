import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { systemManagerOption } from '../system-manager.token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromBodyField('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: systemManagerOption.jwt.secret,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      username: payload.username,
      displayName: payload.displayName,
      roleId: payload.roleId,
    };
  }
}
