import { Component, OnInit } from '@angular/core';
import {SideNavUtilComponent} from "../../sidenav/side-nav-util/side-nav-util.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private util: SideNavUtilComponent,) { }

  ngOnInit(): void {
    const motorAddress = localStorage.getItem('motorAddress');
    const cameraAddress = localStorage.getItem('cameraAddress');

    console.log('Motor Address:', motorAddress);
    console.log('Camera Address:', cameraAddress);
  }

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }

}
