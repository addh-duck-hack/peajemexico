import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DestinationInegi } from 'src/app/shared/interfaces/destination.interface';

export interface RouteHistoryEntry {
  id: string;
  date: number;
  origen: DestinationInegi;
  destinos: DestinationInegi[];
  vehicle: number;
  over: number;
  totalCost: number;
}

const STORAGE_KEY = 'peajesmx_route_history';
const MAX_ENTRIES = 8;

/**
 * Historial de rutas calculadas, guardado en localStorage del navegador (sin backend),
 * disponible tanto para invitados como para usuarios con sesión.
 */
@Injectable({
  providedIn: 'root'
})
export class RouteHistoryService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  history = signal<RouteHistoryEntry[]>(this.load());

  add(entry: Omit<RouteHistoryEntry, 'id' | 'date'>): void {
    if (!this.isBrowser) return;
    const newEntry: RouteHistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: Date.now()
    };
    const updated = [newEntry, ...this.history()].slice(0, MAX_ENTRIES);
    this.history.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  clear(): void {
    this.history.set([]);
    if (this.isBrowser) localStorage.removeItem(STORAGE_KEY);
  }

  private load(): RouteHistoryEntry[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
