import {Component, OnInit} from '@angular/core';
import {EmbedVideoService} from 'ngx-embed-video/dist';
import {DomSanitizer} from '@angular/platform-browser';
import * as $ from '../../../node_modules/jquery/dist/jquery';

@Component({
  selector: 'app-video-embedder',
  templateUrl: './video-embedder.component.html',
  styleUrls: ['./video-embedder.component.css']
})
export class VideoEmbedderComponent implements OnInit {

  youtubeId = ['kIgmXQXqIDQ', 'kKqNREJzYpI', 'IVbG2ObkFSs'];
  requirement: string;
  index = 0;

  constructor(private embedService: EmbedVideoService, private domSanitizer: DomSanitizer) {
  }

  prevVideo(): void {
    if (this.index > 0) {
      --this.index;
    } else {
      this.index = this.youtubeId.length - 1;
    }
  }

  nextVideo(): void {
    if (this.index < this.youtubeId.length - 1) {
      ++this.index;
    } else {
      this.index = 0;
    }
  }

  addNewRequirement(): void {
    if (this.requirement) {
      const newId = this.requirement.split('=')[1];
      this.youtubeId.push(newId);
    }
  }

  getSanitizedHtmlElement(): any {
    const options = {
      image: 'hqdefault',
      attr: {
        width: 1280,
        height: 720
      }
    };
    const iframeHtml = this.embedService.embed_youtube(this.youtubeId[this.index], options);
    return this.domSanitizer.bypassSecurityTrustHtml(iframeHtml);
  }

  ngOnInit() {
  }
}
