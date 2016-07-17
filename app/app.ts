import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import * as firebase from 'firebase';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    var config = {
      apiKey: "AIzaSyDlWcfovPyG0u0zULeT01xZkiP330-C8TA",
      authDomain: "ionic2-918c4.firebaseapp.com",
      databaseURL: "https://ionic2-918c4.firebaseio.com",
      storageBucket: "ionic2-918c4.appspot.com",
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // If there's a user take him to the home page.
        this.rootPage = HomePage;
      } else {
        // If there's no user logged in send him to the LoginPage
        this.rootPage = LoginPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
