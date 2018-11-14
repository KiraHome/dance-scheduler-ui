import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {map} from 'rxjs/internal/operators';

interface UserObject {
  username: string;
  fb_id: string;
  email: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Output()
  closeEvent = new EventEmitter();

  users: [UserObject];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUsers().pipe(map(
      (res: [UserObject]) => {
        this.users = res;
      }
    )).subscribe();
  }

  getProfileImage(id: string): string {
    return 'https://graph.facebook.com/' + id + '/picture?type=normal';
  }

  closeUsers(): void {
    this.closeEvent.emit();
  }
}
