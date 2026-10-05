import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GuidesService } from 'src/app/services/guides.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { Article } from 'src/app/shared/interfaces/article.interface';

@Component({
  selector: 'admin-guides-list',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-guides-list.html',
  styleUrl: './admin-guides-list.css',
})
export default class AdminGuidesList {
  private guidesService = inject(GuidesService);
  private userService = inject(UserService);
  private seo = inject(SeoService);

  items = signal<Article[]>([]);
  loading = signal(true);
  error = signal('');
  // _id de la fila cuya acción (publicar/despublicar/borrar) está en curso, para deshabilitar sus botones sin bloquear el resto de la tabla.
  busyId = signal<string | null>(null);

  constructor() {
    this.seo.setNoIndex();
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.guidesService.getAll(true).subscribe({
      next: (guides) => {
        this.items.set([...guides].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudieron cargar las guías.');
        this.loading.set(false);
      },
    });
  }

  togglePublish(item: Article): void {
    const token = this.userService.sessionUser()?.token;
    if (!token || this.busyId()) return;
    this.busyId.set(item._id);
    this.guidesService.update(item._id, { draft: !item.draft }, token).subscribe({
      next: (updated) => {
        this.items.update((list) => list.map((g) => (g._id === updated._id ? updated : g)));
        this.busyId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo actualizar la guía.');
        this.busyId.set(null);
      },
    });
  }

  deleteItem(item: Article): void {
    const token = this.userService.sessionUser()?.token;
    if (!token || this.busyId()) return;
    if (!confirm(`¿Borrar la guía "${item.title}"? Esta acción no se puede deshacer.`)) return;
    this.busyId.set(item._id);
    this.guidesService.remove(item._id, token).subscribe({
      next: () => {
        this.items.update((list) => list.filter((g) => g._id !== item._id));
        this.busyId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo borrar la guía.');
        this.busyId.set(null);
      },
    });
  }
}
