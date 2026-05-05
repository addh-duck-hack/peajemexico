import { Component } from '@angular/core';
import { CarouselItem } from '../../interfaces/carousel-item.interface';

@Component({
  selector: 'color-carousel',
  imports: [],
  templateUrl: './color-carousel.html',
  styleUrl: './color-carousel.css'
})
export class ColorCarousel {
  carouselItems: CarouselItem[] = [
      {id: 1, title: 'Fletes y Servicios ROMAGA S.A. de C.V.', description: 'También conocida como Transportes ROMAGA, es una empresa que brinda servicio público de transporte de carga general y especializada, respaldada con una experiencia de más de 20 años y un firme compromiso con la calidad de su servicio.', image: 'images/carousel-1.png', route: '/item1'},
      {id: 2, title: 'Misión', description: 'Ser una empresa competitiva que brinda soluciones inmediatas a las necesidades de transporte de carga general y especializada para la industria del petróleo, decididos a brindar la excelencia en nuestros servicios, con una flotilla moderna y un equipo de trabajo comprometido con la calidad, seguridad y el medio ambiente, logramos la satisfacción y preferencia de nuestros clientes.', image: 'images/20240810_171355.jpg', route: '/item2'},
      {id: 3, title: 'Visión', description: 'Consolidarnos como empresa líder de transporte de carga general y especializada, diversificando nuestra plataforma de servicios para brindar mayores y mejores soluciones a las necesidades de nuestros clientes.', image: 'images/photo_9.png', route: '/item3'
      // {id: 3, title: 'Item 4', description: 'Description for Item 4', image: 'images/photo_4.png', route: '/item4'},
      // {id: 4, title: 'Item 5', description: 'Description for Item 5', image: 'images/photo_5.png', route: '/item5'},
      // {id: 5, title: 'Item 6', description: 'Description for Item 6', image: 'images/photo_6.png', route: '/item6'},
      // {id: 6, title: 'Item 7', description: 'Description for Item 7', image: 'images/photo_7.png', route: '/item7'},
      // {id: 7, title: 'Item 8', description: 'Description for Item 8', image: 'images/photo_8.png', route: '/item8'},
      // {id: 8, title: 'Item 9', description: 'Description for Item 9', image: 'images/photo_9.png', route: '/item9'},
      // {id: 9, title: 'Item 10', description: 'Description for Item 10', image: 'images/photo_10.png', route: '/item10'
      }
    ];

    classOfMainCarousel(): string{
      const numberOfItems = this.carouselItems.length
      let classStr = "relative h-[100%] flex transition-all duration-500 ease-in-out ";
      let widthTotal = 'w-[' + numberOfItems + '00vw]';
      classStr += widthTotal

      for (let index = 0; index < numberOfItems; index++) {
        let indexPlus = index + 1
        if (index == 0){
          classStr += ' peer-checked/slider' + indexPlus +':-left-0'
        }else{
          classStr += ' peer-checked/slider' + indexPlus +':-left-[' + index + '00vw]'
        }
      }

      return classStr;
    }

}
