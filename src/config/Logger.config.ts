import { Logger } from 'tslog';

export const log = new Logger({
  type: 'pretty',
  prettyLogTimeZone: 'UTC',
});
