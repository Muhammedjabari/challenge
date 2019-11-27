import { Component, OnInit, Pipe } from '@angular/core';
import { AuthService } from "../app/auth/auth.service"
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Prac';
  events: Observable<any[]>;
  currentDate = new Date();
  userRef;
  userInfo;
  public nameValue = '';
  public loggedIn: boolean = true;
  public loggedOut: boolean = false;
  public titleValue = '';
  public amountValue;
  public emailValue = '';
  public passwordValue = '';
  public dateValue;
  public venueValue;
  public timeValue;
  constructor(
    public authService: AuthService,
    public db: AngularFireDatabase,
  ) { }

  ngOnInit() {
    this.events = this.db.list('event').valueChanges();
    this.checkIfLoggedIn();

  }
  onSubmitLogin() {
    this.authService.SignIn(this.emailValue, this.passwordValue)
    this.events = this.db.list('event').valueChanges();
  }
  onSubmitRegister() {
    this.authService.SignUp(this.emailValue, this.passwordValue)
  }
  isAdmin() {

  }
  updateEvent() {

  }
  logout() {
    this.authService.SignOut()
  }
  checkIfLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.loggedIn = true;
      this.loggedOut = false;
    }
    else {
      this.loggedIn = false;
      this.loggedOut = true;
    }
  }

  checkTime(date) {
    console.log(date)

    date = date.replace('-', '');
    date = date.replace('-', '');
    let currentMonth = this.currentDate.getMonth() + 1;
    let dateString = this.currentDate.getFullYear() + '' + currentMonth + '' + this.currentDate.getDate()
    let thing = +dateString
    if (thing < date) {
      return true
    }
    else {
      return false
    }
  }
  pastEvents(date) {

    date = date.replace('-', '');
    date = date.replace('-', '');
    let currentMonth = this.currentDate.getMonth() + 1;
    let dateString = this.currentDate.getFullYear() + '' + currentMonth + '' + this.currentDate.getDate()
    let thing = +dateString
    if (thing > date) {
      return true
    }
    else {
      return false
    }
  }
  createEvent() {

    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.userRef = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
      this.userRef.snapshotChanges(['child_added'])
        .subscribe(actions => {
          actions.forEach(action => {
            this.userInfo = action.payload.val();
            if (this.userInfo.is_admin === true) {
              let id = this.timeValue + this.dateValue + this.venueValue;
              const eventRef = this.db.list('/event/');
              eventRef.update(id,
                {
                  time: this.timeValue,
                  date: this.dateValue,
                  venue: this.venueValue,
                }
              );
            }
            else {
              console.log('user is not admin')
            }
          });
        })
    }
  }
}