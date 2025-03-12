import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'test',
  standalone: true
})
export class TestPipe implements PipeTransform {

  transform(items: any[], searchText: string, key: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
  //   searchText = searchText.toLowerCase();
  //   return items.filter(item => {
  //     return item[key]?.toLowerCase()?.includes(searchText);
  //   });
  // }
  return items.filter(item => {
    const value = item[key];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchText);
    } else if (typeof value === 'number') {
      return value.toString().includes(searchText);
    }
    return false;
  });
}
}
