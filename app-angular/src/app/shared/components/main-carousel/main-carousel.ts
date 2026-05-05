import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarouselItem } from '../../interfaces/carousel-item.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'main-carousel',
  imports: [RouterLink],
  templateUrl: './main-carousel.html',
  styleUrl: './main-carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCarousel {
  currentSlide = 0;

  carouselItems: CarouselItem[] = [
    {id: 0, title: 'Fletes y Servicios ROMAGA S.A. de C.V.', description: 'También conocida como Transportes ROMAGA, es una empresa que brinda servicio público de transporte de carga general y especializada, respaldada con una experiencia de más de 20 años y un firme compromiso con la calidad de su servicio.', image: 'images/photo_1.png', route: '/item1'},
    {id: 1, title: 'Misión', description: 'Ser una empresa competitiva que brinda soluciones inmediatas a las necesidades de transporte de carga general y especializada para la industria del petróleo, decididos a brindar la excelencia en nuestros servicios, con una flotilla moderna y un equipo de trabajo comprometido con la calidad, seguridad y el medio ambiente, logramos la satisfacción y preferencia de nuestros clientes.', image: 'images/photo_2.png', route: '/item2'},
    {id: 2, title: 'Visión', description: 'Consolidarnos como empresa líder de transporte de carga general y especializada, diversificando nuestra plataforma de servicios para brindar mayores y mejores soluciones a las necesidades de nuestros clientes.', image: 'images/photo_3.png', route: '/item3'
    // {id: 3, title: 'Item 4', description: 'Description for Item 4', image: 'images/photo_4.png', route: '/item4'},
    // {id: 4, title: 'Item 5', description: 'Description for Item 5', image: 'images/photo_5.png', route: '/item5'},
    // {id: 5, title: 'Item 6', description: 'Description for Item 6', image: 'images/photo_6.png', route: '/item6'},
    // {id: 6, title: 'Item 7', description: 'Description for Item 7', image: 'images/photo_7.png', route: '/item7'},
    // {id: 7, title: 'Item 8', description: 'Description for Item 8', image: 'images/photo_8.png', route: '/item8'},
    // {id: 8, title: 'Item 9', description: 'Description for Item 9', image: 'images/photo_9.png', route: '/item9'},
    // {id: 9, title: 'Item 10', description: 'Description for Item 10', image: 'images/photo_10.png', route: '/item10'
    }
  ];

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.carouselItems.length - 1 : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide === this.carouselItems.length - 1 ? 0 : this.currentSlide + 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
