import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEmbedderComponent } from './video-embedder.component';

describe('VideoEmbedderComponent', () => {
  let component: VideoEmbedderComponent;
  let fixture: ComponentFixture<VideoEmbedderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoEmbedderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoEmbedderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
