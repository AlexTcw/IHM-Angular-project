import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {CamService} from "../../services/cam.service";
import {SideNavUtilComponent} from "../../sidenav/side-nav-util/side-nav-util.component";
import Swal from "sweetalert2";
import * as THREE from "three";

@Component({
  selector: 'app-esp32-cam',
  templateUrl: './esp32-cam.component.html',
  styleUrls: ['./esp32-cam.component.scss']
})
export class Esp32CamComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  angleupdown: number = 90;
  angleleftright: number = 90;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  cameraImageUrl:string="";
  cameraControlsUrl:string="";
  sliderValue: number = 90;
  sliderValue2: number = 90;
  motorAddress:string = "";
  cameraAddress:string = "";
  cameraURL:string= "";
  constructor(private camService:CamService,
              private util: SideNavUtilComponent,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.initThreeJS();
    this.animate();
    this.motorAddress = localStorage.getItem('motorAddress') || "";
    this.cameraAddress = localStorage.getItem('cameraAddress') || "";
    console.log(this.cameraAddress)
    this.cameraURL=`http://${this.cameraAddress}:81/stream`
    console.log(this.cameraURL)
    this.cameraControlsUrl=`http://${this.cameraAddress}/`
    //cameraControlsUrl
    console.log(this.cameraControlsUrl)

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

  //canvas
  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.8, 1000);
    this.camera.position.z = 5;

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00CC00, wireframe: false });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.scale.set(30, 30, 30); // Aumenta el tamaño en el eje x, y y z
    this.cube.position.y = -15; // Baja la posición en el eje y
    this.cube.position.x = 20; // Mueve la posición hacia la derecha en el eje x
    this.cube.position.z = -15; // Mueve la posición hacia atrás en el eje z
    this.scene.add(this.cube);
  }



  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        requestAnimationFrame(render);
        this.renderer.render(this.scene, this.camera);
      };
      render();
    });
  }

  public rotateCube() {
    // Convertir los ángulos de grados a radianes
    const angleUpDownRad = THREE.MathUtils.degToRad(this.angleupdown);
    const angleLeftRightRad = THREE.MathUtils.degToRad(this.angleleftright);

    // Aplicar las rotaciones al cubo
    this.cube.rotation.x = angleUpDownRad;
    this.cube.rotation.y = angleLeftRightRad;
  }

  public changeLR(newAngleLeftRight: number) {
    this.angleleftright = newAngleLeftRight;
    this.rotateCube(); // Llama a la función para aplicar las rotaciones
  }

  public changeUD(newAngleUpDown: number) {
    this.angleupdown = newAngleUpDown;
    this.rotateCube(); // Llama a la función para aplicar las rotaciones
  }

}


