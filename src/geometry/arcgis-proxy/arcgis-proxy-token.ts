export interface ArcgisProxyOptions {
  arcUrl: string;
  route: string;
  user?: {
    username: string;
    password: string;
  };
}

export let moduleOptions: {
  [key: string]: ArcgisProxyOptions;
} = {};
export function setOptions(options: ArcgisProxyOptions) {
  moduleOptions[options.route] = options;
}

export function getOption(route: string) {
  return moduleOptions[route];
}
