import {Injectable} from '@angular/core';
import {NavController, Alert} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LoginPage} from '../../pages/login/login';
import * as firebase from 'firebase';

@Injectable()
export class AuthData {
  public fireAuth: any;
  public userProfile: any;
  public userData: any;
  local: Storage;

  constructor(public nav: NavController) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/userProfile');
    this.userData = firebase.database().ref('/userData');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password).then((authData) => {
      this.nav.setRoot(HomePage);
    }, (error) => {
      let prompt = Alert.create({
        message: error.message,
        buttons: [{ text: "Ok" }]
      });
      this.nav.present(prompt);
    });
  }

  signupUser(email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        this.userProfile.child(authenticatedUser.uid).set({
          email: email
        }).then(() => {
          this.nav.setRoot(HomePage);
        });

      })
    }, (error) => {
      var errorMessage: string = error.message;
      let prompt = Alert.create({
        message: errorMessage,
        buttons: [{ text: "Ok" }]
      });
      this.nav.present(prompt);
    });
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email).then((user) => {
      let prompt = Alert.create({
        message: "We just sent you a reset link to your email",
        buttons: [{ text: "Ok" }]
      });
      this.nav.present(prompt);

    }, (error) => {
      var errorMessage: string;
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "You'll need to write a valid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "That user does not exist";
          break;
        default:
          errorMessage = error.message;
      }

      let prompt = Alert.create({
        message: errorMessage,
        buttons: [{ text: "Ok" }]
      });

      this.nav.present(prompt);
    });
  }
  logoutUser(): any {
    return this.fireAuth.signOut();
  }

  sendDataToFirebase(name: string, age: number, comments: string): any {
    console.log(name, age, comments);
    this.userData.child("Node").push({
      name: name,
      age: age,
      comments: comments
    }).then(() => {
      let prompt = Alert.create({
        message: "Save Data",
        buttons: [{ text: "Ok" }]
      });
      this.nav.present(prompt);
    });
  }

  receiveDataFromFirebase(callback): any {
    this.userData.child("Node").on("child_added", function (snapshot) {
      console.log("Child Added Running", snapshot.key);
      callback(snapshot.key , snapshot.val());
    });
    this.userData.child("Node").on("child_removed", function (snapshot) {      
       console.log("Child remove running", snapshot.key , snapshot.val());      
      // callback(snapshot.key,snapshot.val());
    });
  }

  deleteDataFromFirebase(key , onComplete): any {
    
    console.log("hitting");
    console.log(key);
    this.userData.child("Node").child(key).set(null,onComplete);
    onComplete(key);
  }
}