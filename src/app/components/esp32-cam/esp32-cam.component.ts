import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CamService } from "../../services/cam.service";
import { SideNavUtilComponent } from "../../sidenav/side-nav-util/side-nav-util.component";
import Swal from "sweetalert2";
import * as THREE from "three";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-esp32-cam',
  templateUrl: './esp32-cam.component.html',
  styleUrls: ['./esp32-cam.component.scss']
})
export class Esp32CamComponent implements OnInit {
  angleupdown: number = 0;
  angleleftright: number = 0;
  // @ts-ignore
  @ViewChild('rendererContainer', { static: true }) rendererContainer: ElementRef;
  // @ts-ignore
  scene: THREE.Scene;
  // @ts-ignore
  camera: THREE.PerspectiveCamera;
  // @ts-ignore
  renderer: THREE.WebGLRenderer;
  // @ts-ignore
  imageTexture: THREE.Texture;
  // @ts-ignore
  mesh: THREE.Mesh;

  cameraImageUrl: string = "";
  cameraControlsUrl: string = "";
  sliderValue: number = 90;
  sliderValue2: number = 90;
  motorAddress: string = "";
  cameraAddress: string = "";
  cameraURL: string = "";
  cameraPanelURL:SafeResourceUrl = "";

  constructor(
    private camService: CamService,
    private util: SideNavUtilComponent,
    private ngZone: NgZone,
    private sanitizer:DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.initThreeJS();
    this.loadImage();
    this.animate();
    this.motorAddress = localStorage.getItem('motorAddress') || "";
    this.cameraAddress = localStorage.getItem('cameraAddress') || "";
    console.log(this.cameraAddress)
    this.cameraURL = `http://${this.cameraAddress}:81/stream`
    console.log(this.cameraURL)
    this.cameraControlsUrl = `http://${this.cameraAddress}/`
    console.log(this.cameraControlsUrl)
    this.cameraPanelURL = this.sanitizer.bypassSecurityTrustResourceUrl(`http://${this.cameraAddress}/`);

    if (!this.motorAddress || !this.cameraAddress) {
      Swal.fire({
        title: 'Configuración requerida',
        text: 'Por favor, configure las direcciones del motor y de la cámara para continuar.',
        icon: 'warning',
        confirmButtonText: 'Configurar ahora'
      }).then((result: any) => {
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

  streamImage() {
    this.cameraImageUrl = `http://${this.cameraAddress}/stream?${new Date().getTime()}`
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  sendAngle(angle: number, servo: number) {
    this.camService.sendAngleWithIP(this.motorAddress, angle, servo).subscribe(
      () => console.log('Petición enviada exitosamente'),
      error => console.error('Error al enviar la petición:', error)
    );
  }

  initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.5, 1000); // Aspect ratio 1 for square canvas
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(150, 150); // Set renderer size to match container size
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  loadImage(): void {
    const loader = new THREE.TextureLoader();
    loader.load('/assets/img/camera.png', (texture) => {
      this.imageTexture = texture;
      const geometry = new THREE.PlaneGeometry(3, 3);
      const material = new THREE.MeshBasicMaterial({ map: this.imageTexture });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
      this.updateRotation();
    });
  }

  animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateLoop = () => {
        requestAnimationFrame(animateLoop);
        this.renderer.render(this.scene, this.camera);
      };
      animateLoop();
    });
  }

  updateRotation(): void {
    if (this.mesh) {
      this.mesh.rotation.x = THREE.MathUtils.degToRad(this.angleupdown);
      this.mesh.rotation.y = THREE.MathUtils.degToRad(this.angleleftright);
    }
  }

  public changeUD(newAngleUpDown: number) {
    this.angleupdown = newAngleUpDown;
    this.updateRotation();
  }

  public changeLR(newAngleLeftRight: number) {
    this.angleleftright = newAngleLeftRight;
    this.updateRotation();
  }
}
