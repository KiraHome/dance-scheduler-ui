import {Component, OnInit} from '@angular/core';

interface ImageObject {
  url: string;
  title: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  index = 0;
  infinite = true;
  direction = 'right';
  directionToggle = true;
  autoPlay = true;
  mourseOver = true;
  avatars: ImageObject[];

  constructor() {
  }

  isImageLandscape(): boolean {
    const width = document.getElementsByClassName('img').item(this.index + 1)['naturalWidth'];
    const height = document.getElementsByClassName('img').item(this.index + 1)['naturalHeight'];
    return height < width;
  }

  toggleAutoPlay(): void {
    this.autoPlay = !this.autoPlay;
  }

  ngOnInit() {
    this.avatars = [
      {
        url: 'https://i.ytimg.com/vi/txsAY1GOOHA/maxresdefault.jpg',
        title: 'first'
      },
      {
        url: 'https://i.ytimg.com/vi/BHGkhCcohOY/maxresdefault.jpg',
        title: 'second'
      },
      {
        url: 'https://i.pinimg.com/originals/d7/49/46/d749469e003595274ee560706a898627.jpg',
        title: 'third'
      },
      {
        url: 'https://i.pinimg.com/originals/4a/14/4e/4a144e6c26236e5431e175896e374fd4.jpg',
        title: 'forth'
      },
    ];
  }
}
