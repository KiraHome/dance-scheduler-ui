import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-video-embedder',
  templateUrl: './video-embedder.component.html',
  styleUrls: ['./video-embedder.component.css']
})
export class VideoEmbedderComponent implements OnInit, OnDestroy {

  youtubeId = ['kIgmXQXqIDQ', 'kKqNREJzYpI', 'IVbG2ObkFSs'];
  requirement: string;
  index = 0;

  player: YT.Player;

  constructor() {
  }

  getVideoId(): string {
    return this.youtubeId[this.index];
  }

  prevVideo(): void {
    if (this.index > 0) {
      --this.index;
    } else {
      this.index = this.youtubeId.length - 1;
    }
    this.player.loadVideoById(this.getVideoId(), 0, 'hd720');
    this.player.stopVideo();
  }

  nextVideo(): void {
    if (this.index < this.youtubeId.length - 1) {
      ++this.index;
    } else {
      this.index = 0;
    }
    this.player.loadVideoById(this.getVideoId(), 0, 'hd720');
    this.player.stopVideo();
  }

  addNewRequirement(): void {
    if (this.requirement) {
      if (this.requirement.includes('=')) {
        const newId = this.requirement.split('=')[1];
        this.youtubeId.push(newId);
      } else {
        this.youtubeId.push(this.requirement);
      }
    }

    this.requirement = '';
  }

  savePlayer(player): void {
    this.player = player;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
}
