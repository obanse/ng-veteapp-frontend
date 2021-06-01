import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'cc-control';
  constructor(private authService: AuthService,
              private swUpdate: SwUpdate
  ) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(e => {
        console.log(e);
        const currentVersion = e.current.appData['version'];
        const newVersion = e.available.appData['version'];
        const changeLog = e.current.appData['changelog'];
        const confirmationText = `Ein Update ist verfügbar von ${currentVersion} auf ${newVersion}.
        Änderungen: ${changeLog}
        Update installieren?`;
        if (window.confirm(confirmationText)) {
          window.location.reload();
        }
      });
    }
  }

}
