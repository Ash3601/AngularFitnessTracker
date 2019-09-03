import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  isAuth = false;

  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  @Output() toggle = new EventEmitter<void>();

  onClose() {
    this.toggle.emit();
    this.authService.logout();
  }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      (auth) => {
        this.isAuth = auth;
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authSubscription.unsubscribe();
  }

}
