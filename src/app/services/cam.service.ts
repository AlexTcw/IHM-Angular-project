import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CamService {
  baseCamURL: string = 'http://192.168.143.19/servo';

  constructor(private httpClient: HttpClient) {}

  sendAngle(angle: number, servo: number): Observable<any> {
    const url = `${this.baseCamURL}?servo=${servo}&angle=${angle}`;
    console.log(url);
    return this.httpClient.get<any>(url);
  }
}
