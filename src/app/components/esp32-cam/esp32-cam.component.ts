import { Component, OnInit } from '@angular/core';
import {CamService} from "../../services/cam.service";

@Component({
  selector: 'app-esp32-cam',
  templateUrl: './esp32-cam.component.html',
  styleUrls: ['./esp32-cam.component.scss']
})
export class Esp32CamComponent implements OnInit {

  cameraImageUrl:string="";
  sliderValue: number = 90;

  constructor(private camService:CamService) { }

  ngOnInit(): void {
    this.streamImage()
    setInterval(()=>{
      this.streamImage()
    }, 10000)
  }

  streamImage(){
    this.cameraImageUrl = `http://192.168.143.151:81/stream?${new Date().getTime()}`
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  sendAngle(angle: number, servo: number) {
    this.camService.sendAngle(angle, servo).subscribe(
      () => console.log('Petición enviada exitosamente'),
      error => console.error('Error al enviar la petición:', error)
    );
  }
}
