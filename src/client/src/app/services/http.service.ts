import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly registerUrl;

  constructor(private http: HttpClient) { 
    this.registerUrl = 'http://localhost:1000/'
   }

fetchTrackDetails(searchTerm: string){
  console.log(`${this.registerUrl}`+`api/open/song/search/${searchTerm}`);
  const userResponse =  this.http.get(`${this.registerUrl}`+`api/open/song/search/${searchTerm}`);
  console.log(userResponse);
  return userResponse;
}

}
