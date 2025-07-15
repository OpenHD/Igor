import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorBannerState {
  isVisible: boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorBannerService {
  private errorBannerState = new BehaviorSubject<ErrorBannerState>({
    isVisible: false,
    message: '',
    type: 'error'
  });

  private backendConnectivityState = new BehaviorSubject<boolean>(true);

  public errorBanner$: Observable<ErrorBannerState> = this.errorBannerState.asObservable();
  public backendConnectivity$: Observable<boolean> = this.backendConnectivityState.asObservable();

  showError(message: string, type: 'error' | 'warning' | 'info' = 'error') {
    this.errorBannerState.next({
      isVisible: true,
      message,
      type
    });
  }

  hideError() {
    this.errorBannerState.next({
      isVisible: false,
      message: '',
      type: 'error'
    });
  }

  setBackendConnectivity(isConnected: boolean) {
    this.backendConnectivityState.next(isConnected);
    
    if (!isConnected) {
      this.showError('Backend nicht erreichbar - Verbindung wird versucht wiederherzustellen', 'error');
    } else {
      this.hideError();
    }
  }

  isBackendConnected(): boolean {
    return this.backendConnectivityState.value;
  }
}