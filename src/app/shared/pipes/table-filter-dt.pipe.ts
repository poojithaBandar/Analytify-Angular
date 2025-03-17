import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilterDT',
  standalone: true
})
export class TableFilterDTPipe implements PipeTransform {

  transform(tables: any[], searchText: string): any[] {
    if (!tables || !searchText) {
      return tables;
    }
    return tables.filter(table => 
      table.tables.toLowerCase().includes(searchText.toLowerCase())
    );
  }

}
