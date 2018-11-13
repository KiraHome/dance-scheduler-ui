import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {CommentsService} from '../_services/comments.service';
import {catchError, map} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';
import {EventFlowService, FlowEvent} from '../_services/event-flow.service';

interface CommentObject {
  name: string;
  created_date: Date;
  comment: string;
  onPage: string;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input()
  pageName: string;

  @Input()
  userName: string;

  comments: CommentObject[];
  newComment: string;


  constructor(private service: CommentsService, private change: ChangeDetectorRef, private eventFlowService: EventFlowService) {
  }

  ngOnInit() {
    this.comments = [];

    this.service.getComments().pipe(
      map((result) => {
        this.comments = result.filter(res => res.on_page === this.pageName);
        this.change.detectChanges();
      }),
      catchError((err) => {
        if (err.status === 404) {
          return [];
        }
        this.change.detectChanges();
        return throwError(err);
      })
    ).subscribe();
  }

  addComment(comment: string): void {
    if (!comment) {
      return;
    }

    const now = new Date();
    const commentObject = {
      name: window.localStorage.getItem('user'),
      created_date: now,
      comment: comment,
      onPage: this.pageName
    };

    this.service.saveComment(commentObject).subscribe(() => {
      this.comments.unshift(commentObject);
      this.newComment = '';
      this.change.detectChanges();
    }, (err) => {
      if (err.status !== 400) {
        this.comments.unshift(commentObject);
        this.newComment = '';
      }
      this.change.detectChanges();
    });

    const event: FlowEvent = {
      source: this.pageName + ' : Comment',
      content: comment,
      priority: 0,
      timestamp: now,
      username: window.localStorage.getItem('user')
    };
    this.eventFlowService.addEventToFlow(event).subscribe();
  }
}
