import { Article } from 'src/app/shared/interfaces/article.interface';

/**
 * Artículos de la sección /guias.
 *
 * Para publicar uno nuevo:
 * 1. Agrega un objeto a este arreglo (slug único, sin acentos ni espacios).
 * 2. Asígnale una `category` de las ya existentes en ArticleCategory
 *    (article.interface.ts); solo agrega una categoría nueva ahí si de
 *    verdad vas a agrupar varios artículos bajo ese tema.
 * 3. El artículo se prerenderiza automáticamente (ver app.routes.server.ts,
 *    que lee este mismo arreglo para generar sus rutas estáticas).
 * 4. Agrega su URL a public/sitemap.xml (con <lastmod> = publishedDate) para
 *    que se indexe cuanto antes.
 */
export const ARTICLES: Article[] = [
  {
    slug: 'tipos-de-vehiculo-y-ejes-excedentes',
    title: 'Tipos de vehículo y ejes excedentes: guía para entender tu tarifa de caseta',
    description:
      'Qué significan las categorías de vehículo (motocicleta, automóvil, autobús, camión) y los "ejes excedentes" que pide la calculadora de PeajesMX, y por qué cambian el costo de una caseta.',
    category: 'Vehículos y ejes',
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
        de la calculadora es una estimación de apoyo para planear tu ruta, no un cobro garantizado. Si quieres
        ver ejemplos concretos con el tipo de vehículo más común (automóvil sin ejes excedentes), tenemos el
        costo real hacia varios destinos en
        <a href="/guias/cuanto-cuestan-casetas-rutas-populares-desde-cdmx">esta guía de rutas populares desde la Ciudad de México</a>.
      </p>
    `
  },
  {
    slug: 'como-se-calculan-las-tarifas-de-casetas-en-mexico',
    title: 'Cómo se calculan las tarifas de casetas en México',
    description:
      'De dónde salen los datos que usa PeajesMX para estimar el costo de tu ruta, qué factores influyen en la tarifa de una caseta y qué limitaciones tiene este tipo de cálculo.',
    category: 'Tarifas y cálculo',
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
          tener ajustes en temporadas de alta afluencia -como el
          <a href="/guias/aumento-tarifas-casetas-mexico-2026">ajuste de abril de 2026</a>, que subió el costo
          en 43 autopistas concesionadas.</li>
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
        <li>El mapa de carreteras del INEGI no se actualiza al instante: una caseta nueva o un cambio muy
          reciente en la red puede tardar en reflejarse en el cálculo.</li>
        <li>El tiempo de viaje que ves es un estimado en condiciones ideales; no considera tráfico, clima ni
          paradas en el camino.</li>
        <li>La tarifa cobrada en la caseta puede diferir ligeramente de la mostrada aquí, sobre todo si hubo
          un ajuste de temporada reciente.</li>
      </ul>
      <p>
        PeajesMX no publica ni fija estas tarifas: solo las consulta y las presenta de forma clara para que
        puedas planear tu viaje con anticipación. Si buscas el detalle legal completo de esta independencia
        frente al INEGI, CAPUFE y la SICT, está en nuestro <a href="/legales">Aviso Legal</a>.
      </p>
    `
  },
  {
    slug: 'pago-con-tag-en-casetas-capufe',
    title: 'Pago con TAG en las casetas: qué es #CeroEfectivo de CAPUFE y qué pasa si no tienes uno',
    description:
      'Qué cambió con las nuevas reglas de CAPUFE del 30 de julio de 2026, si de verdad desapareció el efectivo en las casetas, y qué hacer si tu vehículo no trae TAG.',
    category: 'Pagos y TAG',
    publishedDate: '2026-08-02',
    readingMinutes: 5,
    contentHtml: `
      <p>
        Desde julio de 2026, Caminos y Puentes Federales (CAPUFE) empujó fuerte su campaña
        <strong>#CeroEfectivo</strong>: nuevas reglas publicadas en el Diario Oficial de la Federación, más
        carriles con cobro electrónico y una recomendación insistente de traer un TAG antes de subir a la
        carretera. Si vas a <a href="/calcular-mi-ruta">calcular tu ruta en PeajesMX</a>, vale la pena entender
        qué cambió de verdad y qué no.
      </p>

      <h2>¿Qué cambió el 30 de julio de 2026?</h2>
      <p>
        Ese día entraron en vigor nuevos lineamientos de CAPUFE que regulan cómo debe colocarse el dispositivo
        (en el parabrisas, debajo del espejo retrovisor, para que el sensor lo detecte) y cómo funcionan los dos
        esquemas de pago: <strong>prepago</strong> (recargas manualmente el saldo desde la app o el portal de tu
        operador) y <strong>pospago</strong> (el cobro se hace automático contra una tarjeta de crédito o débito
        registrada). Según CAPUFE, el cobro electrónico ya está habilitado en 917 de sus 1,012 carriles a nivel
        nacional.
      </p>

      <h2>¿Desapareció el pago en efectivo?</h2>
      <p>
        No, al menos no todavía. A pesar del nombre de la campaña, CAPUFE aclaró que quien no cuente con un
        dispositivo electrónico puede seguir pagando en la caseta de forma tradicional, y hasta agosto de 2026
        no se ha anunciado una fecha específica para que el TAG sea obligatorio en todas las casetas. La
        dirección del cambio es clara -cada vez más carriles operan solo con cobro electrónico-, pero
        "cero efectivo" describe hacia dónde va el sistema, no una regla que ya aplique en todas partes.
      </p>

      <h2>¿Qué pasa si tu vehículo no trae TAG?</h2>
      <p>
        Depende del carril al que te formes: en los carriles mixtos puedes seguir pagando en efectivo o con
        tarjeta directamente con el operador; en los carriles exclusivos de telepeaje -cada vez más comunes,
        sobre todo en las plazas con más tráfico- necesitas un TAG para pasar sin detenerte. Si tu ruta cruza
        varias casetas, conviene revisar la señalización antes de acercarte, porque formarte por error en un
        carril solo-TAG sin dispositivo puede obligarte a retroceder o esperar a que te reubiquen.
      </p>

      <h2>¿Conviene sacar uno aunque no sea obligatorio?</h2>
      <p>
        Si viajas por carretera de cuota con cierta frecuencia, sí: evitas la fila de los carriles de cobro
        manual -que suelen ser los más saturados- y varios operadores dan descuentos por pagar con TAG en
        ciertas autopistas. Si va a ser tu primer TAG, en
        <a href="/guias/iave-pase-televia-easytrip-diferencias">esta guía comparamos IAVE, PASE, Televía y EasyTrip</a>
        para ayudarte a elegir según tu tipo de viaje.
      </p>
      <p>
        El costo de casetas que te muestra la calculadora de PeajesMX es el mismo sin importar cómo pagues -TAG
        o efectivo-, así que puedes usarla para presupuestar tu viaje sin importar el método de pago que elijas.
        PeajesMX es un servicio independiente y no está afiliado a CAPUFE; puedes ver el detalle en nuestro
        <a href="/legales">Aviso Legal</a>.
      </p>
    `
  },
  {
    slug: 'iave-pase-televia-easytrip-diferencias',
    title: 'IAVE, PASE, Televía o EasyTrip: diferencias entre los TAG de las casetas y cuál te conviene',
    description:
      'Comparamos costo de adquisición, cobertura y trámite de los principales TAG de telepeaje en México para ayudarte a elegir antes de tu próximo viaje.',
    category: 'Pagos y TAG',
    publishedDate: '2026-08-04',
    readingMinutes: 5,
    contentHtml: `
      <p>
        Si decidiste sacar un TAG después de leer sobre
        <a href="/guias/pago-con-tag-en-casetas-capufe">el impulso de CAPUFE al cobro electrónico en las casetas</a>,
        el siguiente paso es elegir cuál. En México conviven varios operadores -IAVE, PASE, Televía, EasyTrip y
        ViaPass, entre otros- y la buena noticia es que casi todos son interoperables entre sí: un TAG de
        cualquiera de ellos funciona en la mayoría de las autopistas federales y concesionadas del país, así que
        la elección depende más de costo y comodidad de trámite que de "dónde sí funciona".
      </p>

      <h2>Qué comparar antes de elegir</h2>
      <ul>
        <li><strong>Costo de adquisición del dispositivo:</strong> ronda entre $80 y $150 pesos según el
          operador y la promoción vigente; conviene revisar el precio directamente en el sitio de cada uno antes
          de comprar, porque cambia con frecuencia.</li>
        <li><strong>Saldo mínimo o depósito inicial:</strong> algunos operadores piden dejar un saldo cargado
          desde el arranque, además del costo del dispositivo.</li>
        <li><strong>Cobertura:</strong> todos cubren la mayoría de la red federal, pero cada uno tiene fuerza
          particular en ciertas zonas (ver abajo).</li>
        <li><strong>Dónde se recarga:</strong> por app o portal del operador (normalmente sin comisión), o en
          puntos físicos como tiendas de conveniencia (con una comisión pequeña por recarga).</li>
      </ul>

      <h2>Fortalezas de cada operador</h2>
      <ul>
        <li><strong>IAVE:</strong> es el TAG operado directamente por CAPUFE, con la cobertura más amplia en
          autopistas federales, además del Circuito Exterior Mexiquense y el Arco Norte.</li>
        <li><strong>PASE:</strong> uno de los sistemas con mayor cobertura de concesiones privadas del país (más
          de 65), y trámite de alta desde la app.</li>
        <li><strong>Televía:</strong> opera Aleatica (antes OHL México), con presencia fuerte en autopistas del
          centro del país y la zona metropolitana de la Ciudad de México, incluyendo integración con algunos
          estacionamientos.</li>
        <li><strong>EasyTrip y ViaPass:</strong> alternativas más recientes, también interoperables con la red
          principal; útiles si ya tienes cuenta con ellos por otro motivo (por ejemplo, si tu empresa los usa
          para flotillas).</li>
      </ul>

      <h2>¿Cuál te conviene según tu caso?</h2>
      <p>
        Si viajas ocasionalmente por distintas partes del país, <strong>IAVE</strong> es la opción más segura
        por su cobertura directa en la red federal. Si vives en la Ciudad de México y usas la autopista casi a
        diario, <strong>Televía</strong> puede convenir por su presencia local. Si eres transportista o manejas
        una flotilla, vale la pena comparar directamente con cada operador las condiciones de facturación y
        descuentos por volumen antes de decidir, ya que suelen variar más que el costo del dispositivo para un
        solo vehículo.
      </p>
      <p>
        Sea cual sea el que elijas, el costo que verás en la caseta es el mismo: el TAG solo cambia cómo pagas,
        no cuánto pagas. Puedes seguir usando la <a href="/calcular-mi-ruta">calculadora de PeajesMX</a> para
        presupuestar tu ruta antes de salir, sin importar con qué operador viajes.
      </p>
    `
  },
  {
    slug: 'aumento-tarifas-casetas-mexico-2026',
    title: 'Aumento de tarifas de casetas en México en 2026: qué subió y cuánto',
    description:
      'El ajuste de tarifas de CAPUFE de abril de 2026: cuánto subieron las casetas, en qué autopistas, y por qué el resultado de la calculadora puede diferir de lo que recordabas.',
    category: 'Tarifas y cálculo',
    publishedDate: '2026-07-08',
    readingMinutes: 4,
    contentHtml: `
      <p>
        El 13 de abril de 2026, poco después de la temporada vacacional de Semana Santa, entró en vigor un
        ajuste de tarifas en 43 autopistas concesionadas de México. Si la última vez que viajaste por alguna de
        estas rutas fue antes de esa fecha, es normal que el costo que te muestre la
        <a href="/calcular-mi-ruta">calculadora de PeajesMX</a> hoy sea distinto al que recuerdas.
      </p>

      <h2>De cuánto fue el aumento</h2>
      <p>
        En promedio, el ajuste fue de <strong>4.7%</strong>, por encima de la inflación de diciembre de 2025
        (3.69%), aunque el incremento varió bastante según el tramo: desde aumentos casi imperceptibles hasta
        otros de más de 20% en algunas autopistas concesionadas específicas. Para un automóvil particular, el
        aumento típico fue de $10 a $30 pesos por caseta, aunque en rutas largas con varias casetas la diferencia
        acumulada es mayor.
      </p>

      <h2>Algunos ejemplos (automóvil)</h2>
      <ul>
        <li><strong>Tehuacán-Oaxaca:</strong> de $640 a $702 (+9.7%)</li>
        <li><strong>Cuernavaca-Acapulco:</strong> de $640 a $670 (+4.7%)</li>
        <li><strong>Durango-Mazatlán:</strong> de $784 a $820 (+4.6%)</li>
        <li><strong>La Tinaja-Cosoleacaque:</strong> de $535 a $560 (+4.7%)</li>
        <li><strong>Estación Don-Nogales:</strong> de $518 a $542 (+4.6%)</li>
      </ul>
      <p>
        No todas las autopistas subieron: tramos como México-Querétaro o Torreón-Saltillo se mantuvieron sin
        cambio en este ajuste. Esta lista es solo una muestra de ejemplos publicados, no el listado completo de
        las 43 autopistas ajustadas; para el costo exacto y actualizado de tu ruta, lo más confiable es
        <a href="/calcular-mi-ruta">consultarlo directamente en la calculadora</a>, que trae datos vigentes en
        cada búsqueda.
      </p>

      <h2>¿Por qué suben las tarifas?</h2>
      <p>
        Según CAPUFE, los ajustes responden a costos de mantenimiento, conservación de infraestructura y
        operación de la red carretera federal. Es un ajuste que suele repetirse cada cierto tiempo -no es la
        primera vez ni será la última-, así que si planeas un viaje con meses de anticipación, vale la pena
        volver a calcular el costo cerca de la fecha del viaje en lugar de confiar en una cotización antigua.
      </p>
      <p>
        Si quieres entender qué otros factores además de la tarifa base influyen en el costo final de una
        caseta -tipo de vehículo, ejes excedentes, el concesionario de cada tramo-, tenemos el detalle completo
        en <a href="/guias/como-se-calculan-las-tarifas-de-casetas-en-mexico">esta guía sobre cómo se calculan las tarifas</a>.
      </p>
    `
  },
  {
    slug: 'cuanto-cuestan-casetas-rutas-populares-desde-cdmx',
    title: 'Cuánto cuestan las casetas desde Ciudad de México a los destinos más buscados',
    description:
      'El costo real de casetas desde la Ciudad de México hacia Acapulco, Guadalajara, Puebla, Cancún y Puerto Vallarta en automóvil, calculado con datos del INEGI.',
    category: 'Rutas y carreteras',
    publishedDate: '2026-08-13',
    readingMinutes: 4,
    contentHtml: `
      <p>
        Si estás planeando un viaje por carretera desde la Ciudad de México, esto es lo que cuestan las casetas
        hacia algunos de los destinos más buscados, calculado con el mismo motor que usa la
        <a href="/calcular-mi-ruta">calculadora de PeajesMX</a>: datos en tiempo real de la API de Ruteo del
        INEGI, para un automóvil particular sin ejes excedentes.
      </p>

      <h2>Costo aproximado por destino</h2>
      <ul>
        <li><strong>CDMX → Puebla:</strong> $226 pesos, ~130 km, alrededor de 1 hora 35 minutos.</li>
        <li><strong>CDMX → Acapulco:</strong> $1,018 pesos, ~378 km, alrededor de 4 horas.</li>
        <li><strong>CDMX → Guadalajara:</strong> $1,469 pesos, ~552 km, alrededor de 5 horas 45 minutos.</li>
        <li><strong>CDMX → Puerto Vallarta:</strong> $3,101 pesos, ~862 km, alrededor de 9 horas 30 minutos.</li>
        <li><strong>CDMX → Cancún:</strong> $2,394 pesos, ~1,606 km, un trayecto largo de más de 17 horas que la
          mayoría de la gente parte en dos días.</li>
      </ul>
      <p>
        Estas cifras se consultaron el 13 de agosto de 2026 y son solo de referencia: las tarifas de casetas
        cambian por temporada y pueden ajustarse en cualquier momento (como pasó con el
        <a href="/guias/aumento-tarifas-casetas-mexico-2026">aumento de abril de 2026</a>), así que el número
        exacto de tu viaje puede variar ligeramente respecto a esta lista.
      </p>

      <h2>Por qué el costo de tu viaje puede ser distinto</h2>
      <p>
        Estas cifras son para un automóvil sin ejes excedentes; si viajas en autobús, camión o con un remolque,
        el costo cambia -a veces bastante- según la categoría del vehículo. Puedes ver exactamente qué
        categorías existen y qué son los ejes excedentes en
        <a href="/guias/tipos-de-vehiculo-y-ejes-excedentes">esta guía</a>. También influye la ruta exacta que
        tomes: entre el mismo origen y destino suele haber más de una carretera de cuota posible, con distinto
        número de casetas cada una.
      </p>
      <p>
        Para el costo exacto de tu viaje -con tu tipo de vehículo, tu fecha y el desglose caseta por caseta sobre
        el mapa-, usa directamente la <a href="/calcular-mi-ruta">calculadora de PeajesMX</a>: estas cifras son
        un punto de partida para presupuestar, no un cobro garantizado.
      </p>
    `
  }
];
