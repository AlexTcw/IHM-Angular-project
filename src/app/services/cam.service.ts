import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CamService {
  baseCamURL: string = 'http://192.168.1.86/led?number=';

  constructor(private httpClient: HttpClient) {}

  sendAngle(angle: number): Observable<any> {
    console.log(`${this.baseCamURL}${angle}`);
    return this.httpClient.get<any>(`${this.baseCamURL}${angle}`);
  }
}
