import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-help-guide',
  standalone: true,
  imports: [SharedModule,NgbModule],
  templateUrl: './help-guide.component.html',
  styleUrl: './help-guide.component.scss'
})
export class HelpGuideComponent {
  defaults = ['Collapse Group Item #1','Collapse Group Item #2','Collapse Group Item #3'];

}
