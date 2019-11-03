import { User } from "./user.model";
// import { AppData } from "./auth-data.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from "../training/new-training/training.service";
import { MatSnackBar } from "@angular/material";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {
  // private user: User;1
  private isAuthenticated = false;
  private currentUsername: string;
  authChange: Subject<boolean> = new Subject<any>();

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uiService: UIService
  ) {}

  initUserAuth() {
    this.afauth.authState.subscribe(
      // outputs a user
      user => {
        if (user != null) {
          // console.log(user);
          this.authChange.next(true);
          this.isAuthenticated = true;
          this.router.navigate(["/training"]);
          // this.getUsername();
        } else {
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.isAuthenticated = false;
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    // now it returns a promise thus we use "then" so that we can listen to the success
    this.afauth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        this.uiService.loadingStateChanged.next(false);
        this.router.navigate(["training"]);
        this.authChange.next(true);

        this.isAuthenticated = true;
        // console.log(res);
      })
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);

        // alert(err);
        this.snackbar.open(err.message, null, { duration: 3000 });
      });
    //this changed
    // this.authChange.next(true);
    // this.router.navigate(["/training"]);
  }

  // getUsername() {
  //   // console.log('Getted username' + this.afauth.);
  //   let response = '';
  //   this.afauth.authState.subscribe(
  //     (resp) => {
  //       // console.log('Getted user' + response.email);
  //       // return response;
  //       response = resp.email;
  //     }
  //   );
  //   return response;
  // }
  getUsername(): string {
    return this.currentUsername;
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afauth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        this.currentUsername = authData.email;
        this.uiService.loadingStateChanged.next(false);
        this.authChange.next(true);
        this.isAuthenticated = true;
        this.router.navigate(["/training"]);
      })
      .catch(err => {
        // console.log(err);
        this.router.navigate(["/login"]);
        this.snackbar.open(err.message, null, { duration: 3000 });
        this.uiService.loadingStateChanged.next(false);
      });
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 1000).toString()
    // };
  }

  logout() {
    // this.user = null;
    this.afauth.auth.signOut();
    this.trainingService.cancelSubscriptions();
    this.authChange.next(false);
    this.isAuthenticated = false;
    this.router.navigate(["/login"]);
  }

  // getUser() {
  //   return {
  //     ...this.user
  //   };
  // }

  /*Check if user is authenticated or not */
  isAuth() {
    // return this.user != null;
    return this.isAuthenticated;
  }
}
