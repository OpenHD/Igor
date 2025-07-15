import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  private loadingStates = new Map<string, BehaviorSubject<boolean>>();

  getLoadingState(key: string): Observable<boolean> {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<boolean>(false));
    }
    return this.loadingStates.get(key)!.asObservable();
  }

  setLoading(key: string, isLoading: boolean) {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<boolean>(false));
    }
    this.loadingStates.get(key)!.next(isLoading);
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key)?.value || false;
  }
}