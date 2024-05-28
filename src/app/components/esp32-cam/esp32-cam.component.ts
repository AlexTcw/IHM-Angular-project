import { Component, OnInit } from '@angular/core';
import {CamService} from "../../services/cam.service";
import {SideNavUtilComponent} from "../../sidenav/side-nav-util/side-nav-util.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-esp32-cam',
  templateUrl: './esp32-cam.component.html',
  styleUrls: ['./esp32-cam.component.scss']
})
export class Esp32CamComponent implements OnInit {

  cameraImageUrl:string="";
  sliderValue: number = 90;
  motorAddress:string = "";
  cameraAddress:string = "";
  constructor(private camService:CamService,private util: SideNavUtilComponent) { }

  ngOnInit(): void {
    this.motorAddress = localStorage.getItem('motorAddress') || "";
    this.cameraAddress = localStorage.getItem('cameraAddress') || "";

    if (!this.motorAddress || !this.cameraAddress) {
      Swal.fire({
        title: 'Configuración requerida',
        text: 'Por favor, configure las direcciones del motor y de la cámara para continuar.',
        icon: 'warning',
        confirmButtonText: 'Configurar ahora'
      }).then((result:any) => {
        if (result.isConfirmed) {
          this.navigateToComponent('settings'); // Cambia 'welcome' por el nombre del componente
        }
      });
    } else {
      this.streamImage();
      setInterval(() => {
        this.streamImage();
      }, 10000);
    }
  }

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }

  streamImage(){
    this.cameraImageUrl = `http://cameraAddress/stream?${new Date().getTime()}`
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  sendAngle(angle: number, servo: number) {
    this.camService.sendAngleWithIP(this.motorAddress,angle, servo).subscribe(
      () => console.log('Petición enviada exitosamente'),
      error => console.error('Error al enviar la petición:', error)
    );
  }
}
