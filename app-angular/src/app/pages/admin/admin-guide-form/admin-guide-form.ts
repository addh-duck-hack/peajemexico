import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GuidesService, GuideInput } from 'src/app/services/guides.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { Article, ArticleCategory, ARTICLE_CATEGORIES } from 'src/app/shared/interfaces/article.interface';

@Component({
  selector: 'admin-guide-form',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-guide-form.html',
  styleUrl: './admin-guide-form.css',
})
export default class AdminGuideForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private guidesService = inject(GuidesService);
  private userService = inject(UserService);
  private seo = inject(SeoService);

  categories = ARTICLE_CATEGORIES;

  // null mientras carga (o en modo creación); con id en la URL pero sin
  // encontrar el registro, notFound() distingue "cargando" de "no existe".
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
  category = signal<ArticleCategory>('Tarifas y cálculo');
  publishedDate = signal(this.today());
  updatedDate = signal('');
  readingMinutes = signal(4);
  image = signal('');
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
    this.guidesService.getAll(true).subscribe({
      next: (guides) => {
        const found = guides.find((g) => g._id === this.editingId);
        if (!found) {
          this.notFound.set(true);
        } else {
          this.fillForm(found);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error?.message ?? 'No se pudo cargar la guía.');
        this.loading.set(false);
      },
    });
  }

  setCategory(value: string): void {
    this.category.set(value as ArticleCategory);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private fillForm(guide: Article): void {
    this.slug.set(guide.slug);
    this.title.set(guide.title);
    this.description.set(guide.description);
    this.category.set(guide.category);
    this.publishedDate.set(guide.publishedDate);
    this.updatedDate.set(guide.updatedDate ?? '');
    this.readingMinutes.set(guide.readingMinutes);
    this.image.set(guide.image ?? '');
    this.contentHtml.set(guide.contentHtml);
  }

  private buildInput(draft: boolean): GuideInput {
    return {
      slug: this.slug().trim().toLowerCase(),
      title: this.title().trim(),
      description: this.description().trim(),
      category: this.category(),
      publishedDate: this.publishedDate(),
      ...(this.updatedDate() ? { updatedDate: this.updatedDate() } : {}),
      readingMinutes: Number(this.readingMinutes()),
      image: this.image().trim() || undefined,
      contentHtml: this.contentHtml(),
      draft,
    };
  }

  private validate(): string | null {
    if (!this.slug().trim()) return 'El slug es requerido.';
    if (!this.title().trim()) return 'El título es requerido.';
    if (!this.description().trim()) return 'La descripción es requerida.';
    if (!this.publishedDate()) return 'La fecha de publicación es requerida.';
    if (!this.contentHtml().trim()) return 'El cuerpo (contentHtml) es requerido.';
    if (!Number.isInteger(Number(this.readingMinutes())) || Number(this.readingMinutes()) < 1) {
      return 'Los minutos de lectura deben ser un entero mayor a 0.';
    }
    return null;
  }

  // publish=false ("Guardar"): guarda sin forzar el estado de publicación
  // (una guía existente conserva su draft actual; una nueva se crea como
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
      // draft solo se toca explícitamente al publicar; "Guardar" no lo envía
      // para no reactivar sin querer una guía que el usuario ya despublicó
      // desde el listado.
      const { draft, ...fields } = this.buildInput(false);
      const body = publish ? { ...fields, draft: false } : fields;
      this.guidesService.update(this.editingId, body, token).subscribe({
        next: () => {
          this.saving.set(false);
          if (publish) {
            this.router.navigate(['/admin/guias']);
          } else {
            this.savedMessage.set('Cambios guardados.');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err.error?.error?.message ?? 'No se pudo guardar la guía.');
        },
      });
    } else {
      const body = this.buildInput(!publish);
      this.guidesService.create(body, token).subscribe({
        next: (created) => {
          this.saving.set(false);
          if (publish) {
            this.router.navigate(['/admin/guias']);
            return;
          }
          // "Guardar" en modo creación: pasa a modo edición sobre el
          // registro recién creado -si no, un segundo click en "Guardar"
          // crearía otra guía duplicada en vez de actualizar esta-.
          this.editingId = created._id;
          this.isEditMode = true;
          this.router.navigate(['/admin/guias', created._id, 'editar'], { replaceUrl: true });
          this.savedMessage.set('Guía creada como borrador.');
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err.error?.error?.message ?? 'No se pudo crear la guía.');
        },
      });
    }
  }
}
