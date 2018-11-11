import {Component, OnInit} from '@angular/core';

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
  avatars: any[];

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
        url: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-9/45464828_2223308117739924_6776106083980148736_n.jpg?_nc_cat=110&_nc_ht=scontent-amt2-1.xx&oh=5b8df302dd37c95ba809db82a8c1233b&oe=5C7E7484',
        title: 'first'
      },
      {
        url: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-9/45276546_2223275637743172_7451150921435709440_n.jpg?_nc_cat=103&_nc_ht=scontent-amt2-1.xx&oh=b002639090a358c418024c22fdff368a&oe=5C75F539',
        title: 'second'
      },
      {
        url: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-9/44977676_2209923415745061_1401277039310274560_n.jpg?_nc_cat=106&_nc_ht=scontent-amt2-1.xx&oh=82d23ba462452b2f4cedc3656be2b44f&oe=5C3FE450',
        title: 'third'
      },
      {
        url: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-9/44934570_2209917295745673_3521106711446290432_n.jpg?_nc_cat=105&_nc_ht=scontent-amt2-1.xx&oh=75ffcbd50c29b1366c70853d1ad3fd6a&oe=5C78828A',
        title: 'forth'
      },
    ];
  }
}
