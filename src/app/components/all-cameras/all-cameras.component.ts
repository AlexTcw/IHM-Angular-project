import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { SideNavUtilComponent } from 'src/app/sidenav/side-nav-util/side-nav-util.component';

@Component({
  selector: 'app-all-cameras',
  templateUrl: './all-cameras.component.html',
  styleUrls: ['./all-cameras.component.scss'],
})
export class AllCamerasComponent implements OnInit {
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  cameraIds: string[] = [];
  streams: MediaStream[] = [];

  constructor(private util: SideNavUtilComponent) {}

  ngOnInit(): void {
    // Obtener los IDs de todas las cámaras disponibles
    this.getAvailableCameraIds().then((cameraIds) => {
      console.log('Cámaras disponibles:', cameraIds);
      this.cameraIds = cameraIds;
    });
  }

  getStream(cameraId: string): MediaStream | undefined {
    const index = this.cameraIds.indexOf(cameraId);
    if (index !== -1) {
      if (!this.streams[index]) {
        this.startCapture(cameraId, index);
      }
      return this.streams[index];
    }
    return undefined;
  }

  startCapture(selectedDeviceId: string, index: number) {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: selectedDeviceId }, audio: false })
      .then((stream) => {
        this.streams[index] = stream;
      })
      .catch((error) => this.handleError(error));
  }

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }

  async getAvailableCameraIds(): Promise<string[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameraIds: string[] = [];
    devices.forEach((device) => {
      if (device.kind === 'videoinput') {
        cameraIds.push(device.deviceId);
      }
    });
    return cameraIds;
  }

  handleError(error: any) {
    console.error('An error occurred:', error);
  }
}
