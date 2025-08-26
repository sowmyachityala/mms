import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, BehaviorSubject<any>> = new Map();

  constructor() { }

  set(key: string, value: any): void {
    if (!this.cache.has(key)) {
      this.cache.set(key, new BehaviorSubject<any>(value));
    } else {
      this.cache.get(key)?.next(value);
    }
  }

  get(key: string): BehaviorSubject<any> | null {
    return this.cache.has(key) ? this.cache.get(key)! : null;
  }

  clear(): void {
    this.cache.clear();
  }

}
