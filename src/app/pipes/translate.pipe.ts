import { Pipe, PipeTransform } from '@angular/core';
import i18n from '../i18n';

@Pipe({
  name: 't'
})
export class TranslatePipe implements PipeTransform {
  transform(key: string, options?: any): string {
    return i18n.t(key, options) as string;
  }
}