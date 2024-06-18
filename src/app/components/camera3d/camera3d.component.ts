import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-camera3d',
  templateUrl: './camera3d.component.html',
  styleUrls: ['./camera3d.component.scss']
})
export class Camera3dComponent implements OnInit {
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

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThreeJS();
    this.loadImage();
    this.animate();
  }

  initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
}
