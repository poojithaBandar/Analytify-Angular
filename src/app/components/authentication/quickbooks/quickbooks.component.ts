import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-quickbooks',
  standalone: true,
  imports: [],
  templateUrl: './quickbooks.component.html',
  styleUrl: './quickbooks.component.scss'
})
export class QuickbooksComponent implements OnInit {
constructor(private router:Router,private authService:AuthService){
  const currentUrl = this.router.url;
  if ((currentUrl.includes('integrations/quickbooks?code='))) {
    let url = this.router.url;
    console.log(url);
    this.getToken(url);
  }
}

ngOnInit(){

}
getToken(url:any){
  const obj = {
    redirect_url: url
  }
  this.authService.getTokenQuickbook(obj)
    .subscribe(
      {
        next: (data: any) => {
          console.log(data);
          if (data.message === 'Success') {
            //const connectedToQuickbooks = data.quickbooksConnected;
            //localStorage.setItem('connectedToQuickbooks', JSON.stringify(connectedToQuickbooks));
            // this.connectionSuccess = true;
            // this.getCompanyDetails();
            
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
}
}
