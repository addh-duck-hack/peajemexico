import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NewsService, NewsInput } from 'src/app/services/news.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { NewsArticle } from 'src/app/shared/interfaces/news-article.interface';

@Component({
  selector: 'admin-news-form',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-news-form.html',
  styleUrl: './admin-news-form.css',
})
export default class AdminNewsForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);
  private userService = inject(UserService);
  private seo = inject(SeoService);

  private editingId: string | null = null;
  isEditMode = false;
  loading = signal(true);
  notFound = signal(false);
  saving = signal(false);
  error = signal('');
  savedMessage = signal('');

  slug = signal('');
  title = signal('');
  description = signal('');
  author = signal('');
  sourceName = signal('');
  sourceUrl = signal('');
  publishedDate = signal(this.today());
  updatedDate = signal('');
  image = signal('');
  readingMinutes = signal(3);
  contentHtml = signal('');

  constructor() {
    this.seo.setNoIndex();
    this.editingId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.editingId;

    if (!this.isEditMode) {
      this.loading.set(false);
      return;
    }

    // Se reutiliza el listado con borradores incluidos en vez de sumar un
    // endpoint "por id" nuevo al backend: el volumen de contenido es chico,
    // así que no vale la pena la ruta extra solo para esto.
    this.newsService.getAll(true).subscribe({
      next: (news) => {
        const found = news.find((n) => n._id === this.editingId);
        if (!found) {
          this.notFound.set(true);
        } else {
          this.fillForm(found);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo cargar la noticia.');
        this.loading.set(false);
      },
    });
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private fillForm(item: NewsArticle): void {
    this.slug.set(item.slug);
    this.title.set(item.title);
    this.description.set(item.description);
    this.author.set(item.author);
    this.sourceName.set(item.sourceName);
    this.sourceUrl.set(item.sourceUrl);
    this.publishedDate.set(item.publishedDate);
    this.updatedDate.set(item.updatedDate ?? '');
    this.image.set(item.image);
    this.readingMinutes.set(item.readingMinutes);
    this.contentHtml.set(item.contentHtml);
  }

  private buildInput(draft: boolean): NewsInput {
    return {
      slug: this.slug().trim().toLowerCase(),
      title: this.title().trim(),
      description: this.description().trim(),
      author: this.author().trim(),
      sourceName: this.sourceName().trim(),
      sourceUrl: this.sourceUrl().trim(),
      publishedDate: this.publishedDate(),
      ...(this.updatedDate() ? { updatedDate: this.updatedDate() } : {}),
      image: this.image().trim(),
      readingMinutes: Number(this.readingMinutes()),
      contentHtml: this.contentHtml(),
      draft,
    };
  }

  private validate(): string | null {
    if (!this.slug().trim()) return 'El slug es requerido.';
    if (!this.title().trim()) return 'El título es requerido.';
    if (!this.description().trim()) return 'La descripción es requerida.';
    if (!this.author().trim()) return 'El autor es requerido.';
    if (!this.sourceName().trim()) return 'El medio colaborador es requerido.';
    if (!this.sourceUrl().trim()) return 'El enlace a la publicación original es requerido.';
    if (!this.image().trim()) return 'La imagen es requerida.';
    if (!this.publishedDate()) return 'La fecha de publicación es requerida.';
    if (!this.contentHtml().trim()) return 'El cuerpo (contentHtml) es requerido.';
    if (!Number.isInteger(Number(this.readingMinutes())) || Number(this.readingMinutes()) < 1) {
      return 'Los minutos de lectura deben ser un entero mayor a 0.';
    }
    return null;
  }

  // publish=false ("Guardar"): guarda sin forzar el estado de publicación
  // (una nota existente conserva su draft actual; una nueva se crea como
  // borrador) y se queda en el formulario -para poder seguir editando sin
  // que cada guardado te regrese al listado-.
  // publish=true ("Publicar"): guarda, fuerza draft=false, y ahí sí regresa
  // al listado (es la acción que da por terminada la edición).
  save(publish: boolean): void {
    if (this.saving()) return;
    const validationError = this.validate();
    if (validationError) {
      this.error.set(validationError);
      return;
    }
    const token = this.userService.sessionUser()?.token;
    if (!token) {
      this.error.set('Tu sesión expiró, vuelve a iniciar sesión.');
      return;
    }

    this.error.set('');
    this.savedMessage.set('');
    this.saving.set(true);

    if (this.isEditMode && this.editingId) {
      const { draft, ...fields } = this.buildInput(false);
      const body = publish ? { ...fields, draft: false } : fields;
      this.newsService.update(this.editingId, body, token).subscribe({
        next: () => {
          this.saving.set(false);
          if (publish) {
            this.router.navigate(['/admin/noticias']);
          } else {
            this.savedMessage.set('Cambios guardados.');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err.error?.error?.message ?? 'No se pudo guardar la noticia.');
        },
      });
    } else {
      const body = this.buildInput(!publish);
      this.newsService.create(body, token).subscribe({
        next: (created) => {
          this.saving.set(false);
          if (publish) {
            this.router.navigate(['/admin/noticias']);
            return;
          }
          // "Guardar" en modo creación: pasa a modo edición sobre el
          // registro recién creado -si no, un segundo click en "Guardar"
          // crearía otra nota duplicada en vez de actualizar esta-.
          this.editingId = created._id;
          this.isEditMode = true;
          this.router.navigate(['/admin/noticias', created._id, 'editar'], { replaceUrl: true });
          this.savedMessage.set('Noticia creada como borrador.');
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err.error?.error?.message ?? 'No se pudo crear la noticia.');
        },
      });
    }
  }
}
