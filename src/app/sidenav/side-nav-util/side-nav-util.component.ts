import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-side-nav-util',
  templateUrl: './side-nav-util.component.html',
  styleUrls: ['./side-nav-util.component.scss'],
})
export class SideNavUtilComponent {
  constructor(private router: Router) {}

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  goToComponent(link: string) {
    this.router.navigate([`/${link}`]);
  }
}
