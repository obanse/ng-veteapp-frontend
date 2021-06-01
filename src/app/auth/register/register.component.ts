import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth.service';
import {AuthUser} from '../models/auth-user.model';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  isLoading = false;
  user: AuthUser;
  form: FormGroup;

  private mode = 'register';
  private userId: string;
  private authStatusSubscription: Subscription;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      hitbnr: new FormControl(null, {validators: [Validators.minLength(12)]}),
      hitmbn: new FormControl(null, {validators: [Validators.maxLength(2)]}),
      hitpass: new FormControl()
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'update';
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.authService.getAuthUser(this.userId).subscribe(userData => {
          this.isLoading = false;
          this.user = {
            email: userData.u_email,
            hitbnr: userData.hit_bnr,
            hitmbn: userData.hit_mbn,
            hitpass: userData.hit_pass,
            password: userData.u_pass,
            isHitUser: userData.isHitUser
          };
          this.form.setValue({
            email: this.user.email,
            hitbnr: this.user.hitbnr,
            hitmbn: this.user.hitmbn,
            hitpass: this.user.hitpass,
            password: this.user.password
          });
        });
      } else {
        this.mode = 'register';
        this.userId = null;
      }
    });
  }

  getMode(): string {
    return this.mode;
  }

  onSaveUser(): void {
    if (this.form.invalid) { return; }
    this.isLoading = true;
    if (this.mode === 'register') {
      this.authService.createUser(
        this.form.value.email,
        this.form.value.password,
        this.form.value.hitbnr,
        this.form.value.hitmbn,
        this.form.value.hitpass
      );
    } else if (this.mode === 'update') {
      this.authService.updateUser(
        this.userId,
        this.form.value.email,
        null,
        this.form.value.hitbnr,
        this.form.value.hitmbn,
        this.form.value.hitpass
      );
    }
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}
