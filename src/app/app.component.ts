import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  AuthService,
  AuthWeb3Service,
  SessionService,
} from './modules/auth/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  zone = inject(NgZone);

  user$ = this.sessionService.user$;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private web3Auth: AuthWeb3Service
  ) {}

  ngOnInit(): void {
    this.sessionService
      .loadUserSession()
      .pipe(
        switchMap((res) => {
          this.sessionService.user = res;

          return this.web3Auth.getSavedAddress();
        })
      )
      .subscribe({
        next: (address) => {
          const currentUser = this.sessionService.user;
          if (address !== currentUser?.walletAddress) {
            this.logout();
          }
        },
        error: (err) => {
          this.disposeSession();
        },
      });

    this.web3Auth.onAccountsChanged().subscribe({
      next: () => {
        /** Logout user if switch wallet */
        this.zone.run(() => {
          if (this.sessionService.user) {
            this.logout();
          }
        });
      },
    });

    // Debug session
    // this.sessionService.session$.subscribe((res) => {
    //   console.log('app component', res);
    // });

    // Debug user
    // this.sessionService.user$.subscribe({
    //   next: (user) => {
    //     console.log('user:', user);
    //   },
    // });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.disposeSession();
      },
    });
  }

  private disposeSession() {
    this.sessionService.disposeSession();
    this.router.navigate(['/auth']);
  }
}
