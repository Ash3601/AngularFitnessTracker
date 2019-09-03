import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate;

  // Spinner
  isLoading = false;

  // spinner sub
  spinnerSub: Subscription;

  constructor(private authService: AuthService,private uiService: UIService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.spinnerSub = this.uiService.loadingStateChanged.subscribe(
      (state) => {this.isLoading = state;}
    );
  }

  onSubmit(form: NgForm) {
    //  console.log(form);
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.spinnerSub.unsubscribe();
  }

}
