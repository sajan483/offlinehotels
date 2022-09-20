import { Annotations } from './annotations';
import { Holidays } from './holidays';
export interface MonthYear {
    year: number;
    month: number;
    annotation: Annotations;
    holidays: Holidays;
    component: any;
    id: string;
}
