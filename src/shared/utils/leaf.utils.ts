export const leaf = <T>(obj: any, path: any): T | undefined =>
  `${path}`
    .split('.')
    .reduce((value, el) => (value ? value[el] : undefined), obj);
