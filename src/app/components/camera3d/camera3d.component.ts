import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-camera3d',
  templateUrl: './camera3d.component.html',
  styleUrls: ['./camera3d.component.scss']
})
export class Camera3dComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  angleupdown: number = 90;
  angleleftright: number = 90;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThreeJS();
    this.animate();
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00CC00, wireframe: false }); // Cambiado a wireframe
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.scale.set(5, 5, 5); // Aumenta el tamaño en el eje x, y y z
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
}
