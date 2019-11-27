import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  public fNameValue = '';
  public lNameValue = '';
  userRef: AngularFireList<any>
  public userInfo;
  public adminYOLO: boolean = false;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public db: AngularFireDatabase,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.checkUser();
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
        window.location.reload()
        });
      }).catch((error) => {
        window.alert(error.message);
      });

  }
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        window.location.reload()
      }).catch((error) => {
        window.alert(error.message);
      });
  }
  SetUserData(user) {
    const memberRef = this.db.list('/users/');
    memberRef.update(user.uid,
      {
        uid: user.uid,
        email: user.email,
        fName: this.fNameValue,
        lName: this.lNameValue,
      });
  }
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      window.location.reload()
    })
  }
  checkUser() {
    console.log("hello")
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if (user != null) {
      console.log("adsfbaoisu")
      this.userRef = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
      this.userRef.snapshotChanges(['child_added'])
        .subscribe(actions => {
          actions.forEach(action => {
            this.userInfo = action.payload.val();
            if (this.userInfo.is_admin === true) {
             console.log("is_admin=true")
             return true
            }
          });
        })
    }
    if (user === null) {
      return [true, false];
    }

    else {
      return [false, true];
    }

  }

}
