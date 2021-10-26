import { JwtModuleOptions } from '@nestjs/jwt';

export interface SystemManagerOptions {
  connection?: string;
  jwt?: JwtModuleOptions;
}

export let systemManagerOption: SystemManagerOptions = {};
export function setOption(option?: SystemManagerOptions) {
  systemManagerOption = option || {};
  systemManagerOption.jwt = {
    secret:
      '401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1',
    signOptions: { expiresIn: '7 days' },
    ...systemManagerOption.jwt,
  };
}
