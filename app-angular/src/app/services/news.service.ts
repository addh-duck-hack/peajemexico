import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { NewsArticle } from '../shared/interfaces/news-article.interface';

interface NewsListResponse {
  ok: boolean;
  news: NewsArticle[];
}

interface NewsDetailResponse {
  ok: boolean;
  article: NewsArticle;
}

/** Payload de creación/edición: todo lo de NewsArticle salvo lo que asigna el propio backend. */
export type NewsInput = Omit<NewsArticle, '_id'>;

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);
  env = environment;

  /**
   * Listado de noticias. Por defecto excluye borradores (comportamiento del
   * listado público /noticias); `includeDrafts` lo usa app.routes.server.ts
   * durante el build para prerenderizar también las notas aún no publicadas,
   * y el panel /admin para poder listarlas y editarlas.
   */
  getAll(includeDrafts = false): Observable<NewsArticle[]> {
    const params = includeDrafts ? new HttpParams().set('includeDrafts', 'true') : undefined;

    return this.http.get<NewsListResponse>(
      `${this.env.urlbackend}/api/ds/news`,
      { params }
    ).pipe(map(({ news }) => news));
  }

  /** Detalle por slug: incluye borradores (así se puede revisar una nota por URL directa antes de publicarla). */
  getBySlug(slug: string): Observable<NewsArticle> {
    return this.http.get<NewsDetailResponse>(
      `${this.env.urlbackend}/api/ds/news/${slug}`
    ).pipe(map(({ article }) => article));
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  create(input: NewsInput, token: string): Observable<NewsArticle> {
    return this.http.post<NewsDetailResponse>(
      `${this.env.urlbackend}/api/ds/news`,
      input,
      { headers: this.authHeaders(token) }
    ).pipe(map(({ article }) => article));
  }

  update(id: string, patch: Partial<NewsInput>, token: string): Observable<NewsArticle> {
    return this.http.put<NewsDetailResponse>(
      `${this.env.urlbackend}/api/ds/news/${id}`,
      patch,
      { headers: this.authHeaders(token) }
    ).pipe(map(({ article }) => article));
  }

  remove(id: string, token: string): Observable<void> {
    return this.http.delete<void>(
      `${this.env.urlbackend}/api/ds/news/${id}`,
      { headers: this.authHeaders(token) }
    );
  }
}
