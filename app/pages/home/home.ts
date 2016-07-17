import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthData} from '../../providers/auth-data/auth-data';
import {LoginPage} from '../login/login';


@Component({
  templateUrl: 'build/pages/home/home.html',
  providers : [AuthData]
})
export class HomePage {
  
  constructor(private navController: NavController , public authData : AuthData) {
    this.authData = authData;
  }
  logOut(){
  this.authData.logoutUser().then(() => {
    this.navController.rootNav.setRoot(LoginPage);
  });
}
}
