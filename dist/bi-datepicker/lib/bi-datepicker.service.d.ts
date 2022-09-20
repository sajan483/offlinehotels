import { Day } from './models/day';
export declare class BiDatepickerService {
    constructor();
    private months;
    getMonth(month: string): Day[][];
    addMonth(key: string, month: Day[][]): void;
}
