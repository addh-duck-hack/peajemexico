import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NewsService } from 'src/app/services/news.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { NewsArticle } from 'src/app/shared/interfaces/news-article.interface';

@Component({
  selector: 'admin-news-list',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-news-list.html',
  styleUrl: './admin-news-list.css',
})
export default class AdminNewsList {
  private newsService = inject(NewsService);
  private userService = inject(UserService);
  private seo = inject(SeoService);

  items = signal<NewsArticle[]>([]);
  loading = signal(true);
  error = signal('');
  busyId = signal<string | null>(null);

  constructor() {
    this.seo.setNoIndex();
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.newsService.getAll(true).subscribe({
      next: (news) => {
        this.items.set([...news].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudieron cargar las noticias.');
        this.loading.set(false);
      },
    });
  }

  togglePublish(item: NewsArticle): void {
    const token = this.userService.sessionUser()?.token;
    if (!token || this.busyId()) return;
    this.busyId.set(item._id);
    this.newsService.update(item._id, { draft: !item.draft }, token).subscribe({
      next: (updated) => {
        this.items.update((list) => list.map((n) => (n._id === updated._id ? updated : n)));
        this.busyId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo actualizar la noticia.');
        this.busyId.set(null);
      },
    });
  }

  deleteItem(item: NewsArticle): void {
    const token = this.userService.sessionUser()?.token;
    if (!token || this.busyId()) return;
    if (!confirm(`¿Borrar la noticia "${item.title}"? Esta acción no se puede deshacer.`)) return;
    this.busyId.set(item._id);
    this.newsService.remove(item._id, token).subscribe({
      next: () => {
        this.items.update((list) => list.filter((n) => n._id !== item._id));
        this.busyId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo borrar la noticia.');
        this.busyId.set(null);
      },
    });
  }
}
