import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubscription: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
      () => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm): void {
    if (form.invalid) { return; }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}
