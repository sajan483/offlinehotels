import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'DateTimeToGDStime'})
export class DateTimeToGDStime implements PipeTransform {
    transform(date: any): any {
        return date.split('T')[1].split('Z')[0]
   }
}