import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  /* Check if the user is authenticated or not */
  isAuth: boolean = false;

  // Destroy the subscription after done
  authSubscription: Subscription;

  @Output() sideNavToggle = new EventEmitter<void>();

  onToggleNav() {
    this.sideNavToggle.emit();
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      (authValue) => {
        this.isAuth = authValue;
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authSubscription.unsubscribe();
  }

} 
