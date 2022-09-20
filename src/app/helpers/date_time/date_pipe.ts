import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'DateTimeToDateFormat'})
export class DateTimeToDateFormat implements PipeTransform {
    transform(date: any): any {
        return date.split('T')[0]
   }
}
