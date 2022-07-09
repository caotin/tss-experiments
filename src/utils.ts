import * as fs from 'fs';

export const strToHex = (str: string) => Buffer.from(str).toString('hex');
