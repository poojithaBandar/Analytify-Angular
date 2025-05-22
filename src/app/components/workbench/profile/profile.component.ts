import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgbModule,CommonModule,SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  active!:1;
  imageData = data;

}


const data = [
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/1.jpg",
    previewUrl: "./assets/images/media/1.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/2.jpg",
    previewUrl: "./assets/images/media/2.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/3.jpg",
    previewUrl: "./assets/images/media/3.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/4.jpg",
    previewUrl: "./assets/images/media/4.jpg"
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-4 mb-4 border-bottom-0",
    srcUrl: './assets/images/media/5.jpg',
    previewUrl: './assets/images/media/5.jpg',
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-4 mb-4 border-bottom-0",
    srcUrl: './assets/images/media/6.jpg',
    previewUrl: './assets/images/media/6.jpg',
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-4 mb-4 border-bottom-0",
    srcUrl: './assets/images/media/7.jpg',
    previewUrl: './assets/images/media/7.jpg',
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/8.jpg",
    previewUrl: "./assets/images/media/8.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/9.jpg",
    previewUrl: "./assets/images/media/9.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/10.jpg",
    previewUrl: "./assets/images/media/10.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/11.jpg",
    previewUrl: "./assets/images/media/11.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/12.jpg",
    previewUrl: "./assets/images/media/12.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/13.jpg",
    previewUrl: "./assets/images/media/13.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/14.jpg",
    previewUrl: "./assets/images/media/14.jpg",
  },
  {
    class:"col-xs-6 col-sm-4 col-md-4 col-xl-3 mb-4 border-bottom-0",
    srcUrl: "./assets/images/media/15.jpg",
    previewUrl: "./assets/images/media/15.jpg",
  },
];