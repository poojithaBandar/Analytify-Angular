import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  pure: true,
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
  }
}
