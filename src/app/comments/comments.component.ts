import {Component, OnInit} from '@angular/core';
import {CommentsService} from '../_services/comments.service';
import {catchError, map} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: any[];
  userName: string;
  pageName: string;
  newComment: string;

  constructor(private service: CommentsService) {
  }

  ngOnInit() {
    this.service.getComments().pipe(
      map((result) => {
        function compare(a, b) {
          if (a.last_nom < b.last_nom) {
            return -1;
          }
          if (a.last_nom > b.last_nom) {
            return 1;
          }
          return 0;
        }

        this.comments = result.sort(compare);
      }),
      catchError((err) => {
        // this.comments = [];
        if (err.status === 404) {
          return [];
        }
        return throwError(err);
      })
    ).subscribe();

    // dummy
    this.comments = [];
    this.comments.push({
      name: 'Béla',
      date: new Date(1530976560000),
      comment: 'Comment for test',
      onPage: 'timeTable'
    });
    this.comments.push({
      name: 'Géza',
      date: new Date(1540893600000),
      comment: 'Comment for test 2',
      onPage: 'timeTable'
    });
  }

  addComment(comment: string): void {
    const now = new Date();
    const commentObject = {
      name: 'ADMIN',
      date: now,
      comment: comment,
      onPage: 'timeTable'
    };

    this.comments.push(commentObject);
    this.service.saveComment(commentObject).subscribe();
  }
}
