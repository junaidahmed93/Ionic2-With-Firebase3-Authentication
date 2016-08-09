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
  public facebookAuth: any;
  public googleAuth : any;
  local: Storage;

  constructor(public nav: NavController) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/userProfile');
    this.userData = firebase.database().ref('/userData');
    this.facebookAuth = new firebase.auth.FacebookAuthProvider();
    this.googleAuth = new firebase.auth.GoogleAuthProvider();
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password).then((authData) => {
      this.nav.push(HomePage);
    }, (error) => {
      let prompt = Alert.create({
        message: error.message,
        buttons: [{ text: "Ok" }]
      });
      this.nav.present(prompt);
    });
  }

  facebookLogin(): any {
    firebase.auth().signInWithPopup(this.facebookAuth).then(function (result) {
       this.nav.push(HomePage);
       console.log(result);
      console.log("Facebook Login");
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function (error) {
      console.log("Facebook Login Error");
      // Handle Errors here.
      var errorCode = error;
      var errorMessage = error;
      // The email of the user's account used.
      var email = error;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error;
      // ...
      console.log(error);
    });
  }

  googleLogin(): any {
    firebase.auth().signInWithPopup(this.googleAuth).then(function (result) {
      console.log("google Login");
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result;
      // The signed-in user info.
      var user = result.user;

      console.log("user" , user);
      // ...
    }).catch(function (error) {
      console.log("Google Login Error");
      // Handle Errors here.
      console.log("error" , error);
      var errorCode = error;
      var errorMessage = error;
      // The email of the user's account used.
      var email = error;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error;
      // ...
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
      callback(snapshot.key, snapshot.val());
    });
    this.userData.child("Node").on("child_removed", function (snapshot) {
      console.log("Child remove running", snapshot.key, snapshot.val());
      // callback(snapshot.key,snapshot.val());
    });
  }

  deleteDataFromFirebase(key, onComplete): any {

    console.log("hitting");
    console.log(key);
    this.userData.child("Node").child(key).set(null, onComplete);
    onComplete(key);
  }
}