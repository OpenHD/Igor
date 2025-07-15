import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBannerService, ErrorBannerState } from '../../services/error-banner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-banner-container">
      @if (errorBanner$ | async; as banner) {
        @if (banner.isVisible) {
          <div class="error-banner" [class]="'error-banner--' + banner.type">
            <div class="error-banner__content">
              <i class="error-banner__icon" [class]="getIconClass(banner.type)"></i>
              <span class="error-banner__message">{{ banner.message }}</span>
              <button class="error-banner__close" (click)="onClose()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        }
      }
    </div>
  `,
  styleUrls: ['./error-banner.component.scss']
})
export class ErrorBannerComponent implements OnInit {
  errorBanner$: Observable<ErrorBannerState>;

  constructor(private errorBannerService: ErrorBannerService) {
    this.errorBanner$ = this.errorBannerService.errorBanner$;
  }

  ngOnInit() {}

  onClose() {
    this.errorBannerService.hideError();
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-exclamation-triangle';
    }
  }
}