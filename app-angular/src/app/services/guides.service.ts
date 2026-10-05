import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { Article } from '../shared/interfaces/article.interface';

interface GuidesListResponse {
  ok: boolean;
  guides: Article[];
}

interface GuideDetailResponse {
  ok: boolean;
  guide: Article;
}

/** Payload de creación/edición: todo lo de Article salvo lo que asigna el propio backend. */
export type GuideInput = Omit<Article, '_id'>;

@Injectable({
  providedIn: 'root'
})
export class GuidesService {
  private http = inject(HttpClient);
  env = environment;

  /**
   * Listado de guías. Por defecto excluye borradores (comportamiento del
   * listado público /guias); `includeDrafts` lo usa app.routes.server.ts
   * durante el build para prerenderizar también las guías aún no publicadas,
   * y el panel /admin para poder listarlas y editarlas.
   */
  getAll(includeDrafts = false): Observable<Article[]> {
    const params = includeDrafts ? new HttpParams().set('includeDrafts', 'true') : undefined;

    return this.http.get<GuidesListResponse>(
      `${this.env.urlbackend}/api/ds/guides`,
      { params }
    ).pipe(map(({ guides }) => guides));
  }

  /** Detalle por slug: incluye borradores (así se puede revisar una guía por URL directa antes de publicarla). */
  getBySlug(slug: string): Observable<Article> {
    return this.http.get<GuideDetailResponse>(
      `${this.env.urlbackend}/api/ds/guides/${slug}`
    ).pipe(map(({ guide }) => guide));
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  create(input: GuideInput, token: string): Observable<Article> {
    return this.http.post<GuideDetailResponse>(
      `${this.env.urlbackend}/api/ds/guides`,
      input,
      { headers: this.authHeaders(token) }
    ).pipe(map(({ guide }) => guide));
  }

  update(id: string, patch: Partial<GuideInput>, token: string): Observable<Article> {
    return this.http.put<GuideDetailResponse>(
      `${this.env.urlbackend}/api/ds/guides/${id}`,
      patch,
      { headers: this.authHeaders(token) }
    ).pipe(map(({ guide }) => guide));
  }

  remove(id: string, token: string): Observable<void> {
    return this.http.delete<void>(
      `${this.env.urlbackend}/api/ds/guides/${id}`,
      { headers: this.authHeaders(token) }
    );
  }
}
