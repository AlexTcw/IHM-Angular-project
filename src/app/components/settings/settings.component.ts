import { Component, OnInit } from '@angular/core';
import { SideNavUtilComponent } from "../../sidenav/side-nav-util/side-nav-util.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private util: SideNavUtilComponent) { }

  value: string = '';
  value1: string = '';

  ngOnInit(): void {
    this.value = localStorage.getItem('motorAddress') || 'ingresa un ip sin http ni / por ejemplo "192.168.1.100" ';
    this.value1 = localStorage.getItem('cameraAddress') || 'ingresa un ip sin http ni / por ejemplo "192.168.1.100" ';
  }

  onSaveMotorAddress() {
    localStorage.setItem('motorAddress', this.value);
    Swal.fire({
      title: 'Guardado',
      text: 'La dirección del motor se ha guardado correctamente.',
      icon: 'success'
    });
  }

  onSaveCameraAddress() {
    localStorage.setItem('cameraAddress', this.value1);
    Swal.fire({
      title: 'Guardado',
      text: 'La dirección de la cámara se ha guardado correctamente.',
      icon: 'success'
    });
  }

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }
}
