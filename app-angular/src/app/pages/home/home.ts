import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { SectionItem } from 'src/app/shared/interfaces/section-separator.interface';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

@Component({
  selector: 'home',
  imports: [Navbar, MainFooter, ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home {
  separator1:SectionItem = {
    id: 0,
    title: 'Experiencia',
    description: 'Nos especializamos en ofrecer soluciones integrales de transporte de carga general y especializada, garantizando seguridad, puntualidad y eficiencia en cada servicio. Con más de 20 años de experiencia en el sector, somos el aliado estratégico de empresas que requieren logística confiable y adaptada a sus necesidades.',
    image: 'images/fondo-1.jpg',
    route: '/section1'
  };

  cardsServices:SectionItem[] = [
    {
      id: 0,
      title: 'Experiencia',
      description: 'Por más de 20 años Transportes ROMAGA, se ha desarrollado en la industria del transporte de carga federal, brindando sus servicios en diferentes partes de la República Mexicana.\n Se ha consolidado en el estado de Veracruz, enfatizando su experiencia en el servicio de transporte a empresas del ramo petrolero, por más de 15 años.',
      image: 'images/photo_9.png',
      route: '/section1'
    },
    {
      id: 1,
      title: 'Experiencia 2',
      description: 'Por más de 20 años Transportes ROMAGA, se ha desarrollado en la industria del transporte de carga federal, brindando sus servicios en diferentes partes de la República Mexicana.\n Se ha consolidado en el estado de Veracruz, enfatizando su experiencia en el servicio de transporte a empresas del ramo petrolero, por más de 15 años.',
      image: 'images/photo_3.png',
      route: '/section1'
    },
    {
      id: 3,
      title: 'Excelencia',
      description: 'Por más de 20 años Transportes ROMAGA, se ha desarrollado en la industria del transporte de carga federal, brindando sus servicios en diferentes partes de la República Mexicana.\n Se ha consolidado en el estado de Veracruz, enfatizando su experiencia en el servicio de transporte a empresas del ramo petrolero, por más de 15 años.',
      image: 'images/photo_5.png',
      route: '/section1'
    }
  ];
}
