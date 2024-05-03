import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SelectedCameraComponent } from './components/selected-camera/selected-camera.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AllCamerasComponent } from './components/all-cameras/all-cameras.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'selectedCamera', component: SelectedCameraComponent },
  { path: 'all-cameras', component: AllCamerasComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
