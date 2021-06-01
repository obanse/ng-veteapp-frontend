import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';

import {environment} from '../../environments/environment';
import {AuthData} from './models/auth-data.model';
import {AuthUser} from './models/auth-user.model';

const BACKEND_URL = environment.apiUrl + '/auth/';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private userId: string;
  private isHitUser: boolean;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  // private static saveAuthData(token: string, expirationDate: Date, userId: string) {
  private static saveAuthData(token: string, expirationDate: Date, userId: string, isHitUser: boolean): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    if (isHitUser) { localStorage.setItem('userRole', 'HitUser'); }
  }

  private static clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  private static getAuthData(): { token: string, expirationDate: Date, userId: string, userRole: string } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (!token || !expirationDate) { return; }
    return { token, expirationDate: new Date(expirationDate), userId, userRole };
  }

  getToken(): string {
    return this.token;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getAuthState(): boolean {
    return this.isAuthenticated;
  }

  getUserIsHitUser(): boolean {
    return this.isHitUser;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthUser(id: string): Observable<{ _id: string; u_email: string; u_pass: string;
                                        hit_bnr: string; hit_mbn: string; hit_pass: string;
                                        isHitUser: boolean; isEnabled: boolean }> {
    return this.http.get<{ _id: string, u_email: string, u_pass: string,
      hit_bnr: string, hit_mbn: string, hit_pass: string,
      isHitUser: boolean, isEnabled: boolean}>(
        BACKEND_URL + 'update/' + id
    );
  }

  createUser(email: string, password: string, hitbnr: string, hitmbn: string, hitpass: string): Subscription {
    let isHitUser = false;
    if (hitbnr && hitmbn && hitpass) { isHitUser = true; }
    const authData: AuthUser = { email, password, hitbnr, hitmbn, hitpass, isHitUser };
    return this.http.post<{message: string, result: { _id: string }}>(BACKEND_URL + 'register', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, () => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post<{token: string, expiresIn: number, userId: string, isHitUser: boolean}>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.isHitUser = response.isHitUser;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          AuthService.saveAuthData(token, expirationDate, this.userId, this.isHitUser);
          this.router.navigate(['/']);
        }
      }, () => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser(): void {
    const authInfo = AuthService.getAuthData();
    if (!authInfo) { return; }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.isHitUser = authInfo.userRole === 'HitUser';
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.isHitUser = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    AuthService.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  updateUser(id: string, email: string, password: string, hitbnr: string, hitmbn: string, hitpass: string): void {
    let isHitUser = false;
    if (hitbnr && hitmbn && hitpass) { isHitUser = true; }
    const userData: AuthUser = { email, hitbnr, hitmbn, hitpass, password, isHitUser };
    this.http
      .put(BACKEND_URL + 'update/' + id, userData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
