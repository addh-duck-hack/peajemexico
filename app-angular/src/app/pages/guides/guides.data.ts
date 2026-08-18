import { Article } from 'src/app/shared/interfaces/article.interface';

/**
 * Artículos de la sección /guias.
 *
 * Para publicar uno nuevo:
 * 1. Agrega un objeto a este arreglo (slug único, sin acentos ni espacios).
 * 2. El artículo se prerenderiza automáticamente (ver app.routes.server.ts,
 *    que lee este mismo arreglo para generar sus rutas estáticas).
 * 3. Agrega su URL a public/sitemap.xml para que se indexe cuanto antes.
 */
export const ARTICLES: Article[] = [
  {
    slug: 'tipos-de-vehiculo-y-ejes-excedentes',
    title: 'Tipos de vehículo y ejes excedentes: guía para entender tu tarifa de caseta',
    description:
      'Qué significan las categorías de vehículo (motocicleta, automóvil, autobús, camión) y los "ejes excedentes" que pide la calculadora de PeajesMX, y por qué cambian el costo de una caseta.',
    publishedDate: '2026-08-10',
    readingMinutes: 5,
    contentHtml: `
      <p>
        En las casetas de cuota de México, la tarifa que se paga no depende solo de la distancia recorrida:
        depende sobre todo del <strong>tipo de vehículo</strong> y, en el caso de camiones, del
        <strong>número de ejes</strong>. Es la misma lógica que usa la calculadora de PeajesMX cuando te pide
        seleccionar estos dos datos antes de mostrarte un costo.
      </p>

      <h2>Categorías de vehículo</h2>
      <p>
        La red de casetas federal clasifica los vehículos en categorías que, de forma general, se agrupan así:
      </p>
      <ul>
        <li><strong>Motocicleta:</strong> la categoría con la tarifa más baja en la mayoría de las casetas.</li>
        <li><strong>Automóvil:</strong> vehículos particulares de pasajeros de dos ejes (la categoría "Auto").</li>
        <li><strong>Autobús:</strong> transporte de pasajeros, subdividido según su número de ejes (dos, tres o
          cuatro ejes), ya que un autobús de más ejes suele pesar y ocupar más espacio en la carretera.</li>
        <li><strong>Camión:</strong> transporte de carga, subdividido de dos a nueve ejes. A mayor número de
          ejes, mayor es la tarifa, porque estos vehículos representan más desgaste para el pavimento.</li>
      </ul>
      <p>
        Estas son exactamente las opciones que encuentras en el selector "Tipo de vehículo" de la
        <a href="/calcular-mi-ruta">calculadora de PeajesMX</a>: de motocicleta a camión de nueve ejes.
      </p>

      <h2>¿Qué es un "eje excedente"?</h2>
      <p>
        Un camión no siempre trae exactamente el número de ejes de su categoría base. Cuando arrastra un
        remolque adicional, una plataforma extra o cualquier configuración que sume ejes por encima de lo
        estándar para su clase, esos ejes de más se conocen como <strong>ejes excedentes</strong>. Cada eje
        excedente añade un cargo adicional sobre la tarifa base, porque representa peso y espacio extra en la
        vía.
      </p>
      <p>
        Por eso, después de elegir el tipo de vehículo, la calculadora te pide indicar cuántos ejes excedentes
        tiene tu unidad, de cero hasta cinco. Si tu vehículo no trae ejes adicionales a los de su categoría,
        simplemente selecciona "Sin ejes excedentes".
      </p>

      <h2>¿Por qué importa esto al planear un viaje?</h2>
      <p>
        Si eres transportista, operas una flotilla o simplemente viajas con un remolque, seleccionar
        correctamente el tipo de vehículo y los ejes excedentes es lo que hace que el costo estimado por
        PeajesMX se acerque al que realmente vas a pagar en cada caseta de tu ruta. Un error común es cotizar
        como "Automóvil" un vehículo con remolque, lo que puede subestimar el costo real del viaje.
      </p>
      <p>
        Recuerda que estas tarifas pueden actualizarse por temporada y variar por región, así que el resultado
        de la calculadora es una estimación de apoyo para planear tu ruta, no un cobro garantizado.
      </p>
    `
  },
  {
    slug: 'como-se-calculan-las-tarifas-de-casetas-en-mexico',
    title: 'Cómo se calculan las tarifas de casetas en México',
    description:
      'De dónde salen los datos que usa PeajesMX para estimar el costo de tu ruta, qué factores influyen en la tarifa de una caseta y qué limitaciones tiene este tipo de cálculo.',
    publishedDate: '2026-08-17',
    readingMinutes: 4,
    contentHtml: `
      <p>
        Cuando capturas un origen y uno o varios destinos en la
        <a href="/calcular-mi-ruta">calculadora de PeajesMX</a>, la herramienta consulta en tiempo real la
        <a href="https://www.inegi.org.mx/servicios/Ruteo/Default.html" target="_blank" rel="noreferrer">API de Ruteo del INEGI</a>
        (Instituto Nacional de Estadística y Geografía) para trazar la ruta sobre la red de carreteras federales
        y calcular el costo de cada caseta en el camino.
      </p>

      <h2>Factores que determinan el costo de una caseta</h2>
      <ul>
        <li><strong>La ruta elegida:</strong> el mismo origen y destino pueden conectarse por más de una
          carretera; una autopista de cuota suele ser más rápida pero implica más casetas que una carretera
          libre.</li>
        <li><strong>El tipo de vehículo y los ejes excedentes:</strong> como se explica en nuestra guía sobre
          <a href="/guias/tipos-de-vehiculo-y-ejes-excedentes">tipos de vehículo y ejes excedentes</a>,
          cada categoría tiene una tarifa distinta en cada caseta.</li>
        <li><strong>El concesionario de cada tramo:</strong> algunas autopistas son operadas por Caminos y
          Puentes Federales (CAPUFE) y otras por concesionarios privados o estatales, cada uno con su propio
          tarifario autorizado.</li>
        <li><strong>La temporada:</strong> las tarifas de casetas suelen actualizarse periódicamente y pueden
          tener ajustes en temporadas de alta afluencia.</li>
      </ul>

      <h2>Qué te muestra el resultado</h2>
      <p>
        Además del costo total, la calculadora desglosa el costo por cada caseta individual de la ruta, junto
        con la distancia y el tiempo estimado de recorrido, y los ubica sobre un mapa interactivo para que
        puedas revisar el trayecto completo antes de salir a carretera.
      </p>

      <h2>Limitaciones a tener en cuenta</h2>
      <p>
        Al ser una estimación basada en datos de una fuente externa, el resultado tiene algunas limitaciones
        que vale la pena conocer antes de usarlo para planear un viaje:
      </p>
      <ul>
        <li>La red de caminos que utiliza el INEGI se actualiza de forma periódica, por lo que puede haber
          diferencias con cambios muy recientes en carreteras o casetas.</li>
        <li>Los tiempos estimados de viaje asumen condiciones óptimas, sin tráfico, clima ni paradas.</li>
        <li>Las tarifas mostradas pueden variar respecto al costo real vigente en la caseta.</li>
      </ul>
      <p>
        PeajesMX es un servicio independiente y no está afiliado al INEGI, a Caminos y Puentes Federales
        (CAPUFE) ni a la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT); el objetivo de la
        herramienta es darte una referencia confiable para presupuestar tu viaje con anticipación, no sustituir
        la tarifa oficial cobrada en cada caseta.
      </p>
    `
  }
];
