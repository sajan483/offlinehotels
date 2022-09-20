import { Holiday } from './holiday';

export interface Holidays {
    year: number;
    month: number;
    holidays: Holiday[];
}