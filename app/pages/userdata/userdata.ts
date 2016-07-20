import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AuthData} from '../../providers/auth-data/auth-data';

/*
  Generated class for the UserdataPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/userdata/userdata.html',
  providers: [AuthData]
})
export class UserdataPage {
  public dataArray;
  public userData: any[];
  public some;
  public testingObj: any = {};

  constructor(private nav: NavController, public authData: AuthData) {
    this.userData = [];
    this.testingObj = {}
    this.authData = authData;
    this.authData.receiveDataFromFirebase(this.mycallback.bind(this));
    //this.mycallback({});
    // console.log(this.dataArray);
  }




  mycallback(key, data): void {    //callback

    console.log(key, data);
    this.testingObj = data;
    this.testingObj.key = key
    this.userData.push(this.testingObj);
    console.log(this.userData);

    // this.userData = Object.keys(data).map(key => data[key]); 
    // console.log(this.userData);
    // this.userData = [];

    // for(let key in data){
    //   if(data.hasOwnProperty(key)){        
    //     // console.log(key,data[key]);
    //     this.testingObj = data[key];
    //     // this.testingObj.key = key;
    //     // console.log("Final object" , this.testingObj);
    //     this.userData.push(this.testingObj);
    //     console.log("this is final array" , this.userData)

    //   }
    // }
  }

  delete(user) {

    console.log(user);
    console.log(user.key)
    this.authData.deleteDataFromFirebase(user.key, this.onComplete.bind(this));

  }
  onComplete(a) {
    console.log(a);    
    for (let i = 0; i < this.userData.length; i++) {
      console.log(this.userData[i]);      
      if(this.userData[i].key == a){
        console.log("found" , this.userData[i].key  , "at" , i, "match" ,a);
        this.userData.splice(i,1);
      }
      else{
        console.log("not found");
      }
    }
  }

}
