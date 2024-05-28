import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const motorAddress = localStorage.getItem('motorAddress');
    const cameraAddress = localStorage.getItem('cameraAddress');

    console.log('Motor Address:', motorAddress);
    console.log('Camera Address:', cameraAddress);
  }

}
