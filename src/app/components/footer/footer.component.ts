import { Component } from '@angular/core';
import { SideNavUtilComponent } from 'src/app/sidenav/side-nav-util/side-nav-util.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private util: SideNavUtilComponent) {}

  navigateToComponent(componentName: string) {
    this.util.goToComponent(componentName);
  }
}
