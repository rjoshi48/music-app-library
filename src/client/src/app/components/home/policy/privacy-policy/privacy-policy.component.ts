import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  policy : any ;
  item: boolean;
  editable = false;
  updatedpolicy: any;

  constructor(public _http: HttpService, public _auth: AuthService) { 
    //this.getPolicy();

    //let new_policy = "Good policy"

  }

  ngOnInit() {
  }

  getPolicy(){
    this.policy = this.updatedpolicy;
    //this.policy = this._http.getPrivacyPolicy();
    this._http.getPrivacyPolicy().subscribe(
      res => { 
        this.policy = res.policy;
        //console.log(res);
      },
      err => console.log('error', err.error)
    ); 
    console.log(this.policy);
  
  }

  editPolicy(){
    //this.policy = this._http.getPrivacyPolicy();
/*
    this._http.editPrivacyPolicy(JSON.stringify(new_policy)).subscribe(
      res => { 
        this.policy = res.policy;
        //console.log(res);
      },
      err => console.log('error', err.error)
    ); 
    console.log(this.policy);*/
  
    // this._http.editPrivacyPolicy(this.updatedpolicy).subscribe(
    //   res => {
    //       console.log(res);
    //   },
    //   err => console.log('error', err.error)
    // );

    this._http.editPrivacyPolicy({ policy: this.updatedpolicy}).subscribe(
      res => {
          console.log(res);
      },
      err => console.log('error', err.error)
    );
  }

  setTitleEdit(policy: any) {

    this.policy.canEditCode = true;
 
  }

  onToggle() {
    this.editable = !this.editable;
  }

  onNameChange(val) {

    console.log("Changed now", val);
    this.updatedpolicy = val.toString();
    console.log(this.updatedpolicy);
  }
 
}


