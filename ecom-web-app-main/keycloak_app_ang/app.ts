import {Component, inject, OnInit, signal} from '@angular/core';
import Keycloak, {KeycloakProfile} from 'keycloak-js';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App  implements OnInit{
  protected readonly title = signal('ecom-app-angular');

  private readonly keycloak = inject(Keycloak);

  public profile = signal<KeycloakProfile | undefined>(undefined);

  async ngOnInit() {
    if (this.keycloak.authenticated) {
      try {
        const userProfile = await this.keycloak.loadUserProfile();

        this.profile.set(userProfile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil', error);
      }
    }
  }

  async handleLogin() {
    await this.keycloak.login({
      redirectUri: window.location.origin
    });
  }

   handleLogout() {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }
}
