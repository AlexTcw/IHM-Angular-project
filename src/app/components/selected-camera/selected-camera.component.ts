import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavUtilComponent } from 'src/app/sidenav/side-nav-util/side-nav-util.component';

@Component({
  selector: 'app-selected-camera',
  templateUrl: './selected-camera.component.html',
  styleUrls: ['./selected-camera.component.scss'],
})
export class SelectedCameraComponent implements OnInit {
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('cameraSelect') cameraSelect!: ElementRef;

  videoDevices: MediaDeviceInfo[] = [];

  constructor(private util: SideNavUtilComponent) {}

  ngOnInit(): void {
    this.loadCameraList();
  }

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }

  startCapture() {
    const selectedDeviceId = this.cameraSelect.nativeElement.value;
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: selectedDeviceId }, audio: false })
      .then((stream) => this.streamVideo(stream))
      .catch((error) => this.handleError(error));
  }

  streamVideo(stream: MediaStream) {
    this.videoInput.nativeElement.srcObject = stream;
    this.videoInput.nativeElement.play();
  }

  handleError(error: any) {
    console.error('An error occurred:', error);
  }

  loadCameraList() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => this.enumerateDevices(devices))
      .catch((error) => this.handleError(error));
  }

  enumerateDevices(devices: MediaDeviceInfo[]) {
    this.videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );

    // Inicia la captura con la primera cámara encontrada
    if (this.videoDevices.length > 0) {
      this.startCapture();
    }
  }
}
