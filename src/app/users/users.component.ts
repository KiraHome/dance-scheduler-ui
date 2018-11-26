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

  users: UserObject[];
  filteredUsers: UserObject[];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUsers().pipe(map(
      (res: UserObject[]) => {
        this.users = res;
        this.filteredUsers = res.slice();
      }
    )).subscribe();
  }

  filterUsers(userName: string): void {
    if (userName === '') {
      this.filteredUsers = this.users.slice();
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.username.match(userName.split('').reduce((c1, c2) => c1 + '[^' + c2 + ']*' + c2))
      );
    }
  }

  isMyCard(user: UserObject): boolean {
    return window.localStorage.getItem('user') === user.username;
  }

  getProfileImage(id: string): string {
    return 'https://graph.facebook.com/' + id + '/picture?type=normal';
  }

  closeUsers(): void {
    this.closeEvent.emit();
  }
}
