import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {
  private readonly meterPerMile: number = 1609.34;

  transform(value: number, from: string, to: string): number {
    const miles = Math.round(value / this.meterPerMile);

    return miles;
  }
}
