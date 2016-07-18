import {Component} from '@angular/core';
import {NavController ,Loading} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/common';
import {AuthData} from '../../providers/auth-data/auth-data';
import {LoginPage} from '../login/login';
import {UserdataPage} from '../userdata/userdata';


@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [AuthData]
})
export class HomePage {
  public userInfo :any;

  constructor(private navController: NavController, public authData: AuthData, public formBuilder: FormBuilder) {
    this.authData = authData;

    this.userInfo = formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      comments :['', Validators.required]
    })
  }
  logOut() {
    this.authData.logoutUser().then(() => {
      this.navController.rootNav.setRoot(LoginPage);
    });
  }

  allUserData(event) {
    event.preventDefault();
    this.authData.sendDataToFirebase(this.userInfo.value.name, this.userInfo.value.age ,this.userInfo.value.comments);
    let loading = Loading.create({
      dismissOnPageChange: true,
    });
   // this.navController.present(loading);
  }
  showFirebaseData(){
    this.navController.push(UserdataPage);
  }
}
