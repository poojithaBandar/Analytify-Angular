import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { LoaderService } from './loader.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private loaderService: LoaderService,private zone: NgZone) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    this.zone.run(() => {
      console.log('Interceptor: show loader'); // Debugging statement
      this.loaderService.show();
    });

    return next.handle(req).pipe(
      finalize(() => {
        this.zone.run(() => {
          console.log('Interceptor: hide loader'); // Debugging statement
          this.loaderService.hide();
        });
      })
    );
  }
}