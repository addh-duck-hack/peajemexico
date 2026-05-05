import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InegiService } from 'src/app/services/inegi.service';
import { UserService } from 'src/app/services/user.service';
import { DestinationInegi } from 'src/app/shared/interfaces/destination.interface';
import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { SkeletonContentLoader } from 'src/app/shared/components/skeleton/skeleton-content-loader/skeleton-content-loader';
import { DataCostInegi } from 'src/app/shared/interfaces/route.cost.interface';
import { DetailCostData } from 'src/app/shared/interfaces/detail-cost-data.interface';
import { DetailCostItem } from 'src/app/shared/components/dashboard/detail-cost-item/detail-cost-item';
import { DataDetailCostInegi } from 'src/app/shared/interfaces/detail-route.cost.interface';

@Component({
  selector: 'price-dashboard',
  imports: [SkeletonContentLoader, DetailCostItem],
  templateUrl: './price-dashboard.html',
  styleUrl: './price-dashboard.css'
})

export default class PriceDashboard implements AfterViewInit{
  // Variables para el origen
  origen = signal('');
  errorOrigen = signal('');
  origenResponse = signal<DestinationInegi[]>([]);
  origenSeleccionado = signal<DestinationInegi | null>(null);
  botonOrigenTitulo = signal('Buscar');
  origenLoading = signal(false);
  ultimoOrigenBuscado = signal("");

  // Variables para el manejo de los destinos
  destino = signal('');
  errorDestino = signal('');
  destinoResponse = signal<DestinationInegi[]>([]);
  destinosSeleccionados = signal<DestinationInegi[]>([]);
  destinoLoading = signal(false);
  ultimoDestinoBuscado = signal("");

  // Variables para options de vehiculos y ejes exedentes
  valuesOfVehicle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  namesOfVehicle = ["Motocicleta" , "Automóvil", "Autobús dos ejes", "Autobús tres ejes", "Autobús cuatro ejes", "Camión dos ejes", "Camión tres ejes", "Camión cuatro ejes", "Camión cinco ejes", "Camión seis ejes", "Camión siete ejes", "Camión ocho ejes", "Camión nueve ejes"];
  selectedVehicle = signal<number>(-1);
  valuesOfOver = [0, 1, 2, 3, 4, 5];
  namesOfOver = ["Sin ejes excedentes", "Un eje excedente", "Dos ejes excedentes", "Tres ejes excedentes", "Cuatro ejes excedentes", "Cinco ejes excedentes"];
  selectedOver = signal<number>(0);

  // Variables para obtencion de costos
  errorsFormCost = signal<string[]>([]);
  calculationLoading = signal(false);
  detailLoading = signal(false);
  costServiceResponde = signal<DataCostInegi[]>([]);
  totalTollCost = 0;
  totalOverCost = 0;
  totalLongKms = 0.0;
  totalMinTime = 0.0;
  totalWarnings = '';
  detailsCostRouteResponse = signal<DataDetailCostInegi[]>([]);
  detailsCostRoute = signal<DetailCostData[]>([]);
  elementsInListOfCost = signal<DetailCostData[]>([]);
  showDetails = signal(false);

  //Variables para consumo de servicios
  inegiService = inject(InegiService);
  userService = inject(UserService);
  router = inject(Router)

  // Variables para Leaflet para los mapas
  private map!: L.Map;
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void{
    this.map = L.map('main-chart').setView([19.432629, -99.133203], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
  }

  // Funciones para el manejo del origen
  validateOrigen(){
    // Primero validamos el tipo de boton Buscar/Cambiar
    if (this.botonOrigenTitulo() == 'Buscar'){
      // Validamos que se escribio un origen
      if (!this.origen()) {
        this.errorOrigen.set('Ingrese el origen a buscar');
        return;
      }else{
        // Validar que el origen tenga al menos 3 caracteres
        if (this.origen() && this.origen().length < 3) {
          this.errorOrigen.set('El origen debe tener al menos 3 caracteres');
          return;
        }else{
          this.errorOrigen.set('');
        }
      }

      // Si la ultima busqueda es igual a la busqueda actual, entonces el boton no funcionara
      if (this.ultimoOrigenBuscado() != this.origen()){
        // Cuando ya se valido realizamos la busqueda
        this.costServiceResponde.set([]);
        this.origenResponse.set([]);
        this.origenLoading.set(true);
        this.searchPoint(true);
        this.ultimoOrigenBuscado.set(this.origen())
      }
    }else{
      this.origen.set('');
      this.origenSeleccionado.set(null);
      this.botonOrigenTitulo.set('Buscar');
      this.ultimoOrigenBuscado.set("")
      this.cleanMap();
    }
  }

  searchPoint(isOrigin: boolean): void{
    const sessionToken = this.getSessionToken();
    let pointToSearch = isOrigin ? this.origen : this.destino;

    this.inegiService.getDestination(pointToSearch(), sessionToken).subscribe({
      next: (response) => {
        if(response.length > 0){
          // Limpiamos el mapa antes de agregar nuevos puntos
          this.cleanMap();
          if (isOrigin){
            this.origenLoading.set(false);
            this.origenResponse.set(response)
          }else{
            this.destinoResponse.set(response)
            this.destinoLoading.set(false);
          }
          // Mostramos los puntos en el mapa
          for (let index = 0; index < response.length; index++) {
            const destination = response[index];
            this.setPointInMap(destination, isOrigin, false, (index + 1).toString())
          }
        }else{
          if (isOrigin){
            this.errorOrigen.set('No se encontraron lugares para esta busqueda');
            this.origenLoading.set(false);
          }else{
            this.errorDestino.set('No se encontraron lugares para esta busqueda');
            this.destinoLoading.set(false);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
         // Mostrar el mensaje de error del servidor
        if (isOrigin){
          this.errorOrigen.set(error.error.error.message);
          this.origenLoading.set(false);
        }else{
          this.errorDestino.set(error.error.error.message);
          this.destinoLoading.set(false);
        }
      }
    })
  }

  selectOrigen(origen: DestinationInegi) {
    this.origenSeleccionado.set(origen);
    this.origen.set(origen.nombre);
    this.botonOrigenTitulo.set('Cambiar');
    this.origenResponse.set([]);

    // Limpiamos el mapa y agregamos solo el punto seleccionado
    this.cleanMap();
    this.setPointInMap(origen, true, true, origen.nombre + ' / ' + origen.ent_abr);
  }

  // Funciones para el manejo de los destinos
  validateDestino(){
    // Validamos que se escribio un origen
    if (!this.destino()) {
      this.errorDestino.set('Ingrese el destino a buscar');
      return;
    }else{
      // Validar que el origen tenga al menos 3 caracteres
      if (this.destino() && this.destino().length < 3) {
        this.errorDestino.set('El destino debe tener al menos 3 caracteres');
        return;
      }else{
        this.errorDestino.set('');
      }
    }

    // Si la ultima busqueda es igual a la busqueda actual, entonces el boton no funcionara
    if (this.ultimoDestinoBuscado() != this.destino()){
      // Cuando ya se valido realizamos la busqueda
      if(!this.errorDestino()){
        this.destinoLoading.set(true);
        this.searchPoint(false);
        this.costServiceResponde.set([]);
        this.ultimoDestinoBuscado.set(this.destino());
      }
    }
  }

  selectDestine(destino: DestinationInegi) {
    // Se valida si el destino ya existe en el arreglo
    let indexOfDestino = this.destinosSeleccionados().findIndex((select) => select.id_dest == destino.id_dest);
    if (indexOfDestino != -1){
      console.log('El destino con id: ' + destino.id_dest + ' ya existe en la posicion: ' + indexOfDestino)
      return;
    }

    this.destinosSeleccionados.update(destinos => [...destinos, destino])
    this.destino.set('');
    this.destinoResponse.set([]);
    this.ultimoDestinoBuscado.set('');

    // Limpiamos el mapa y agregamos solo el punto seleccionado
    this.cleanMap();
    this.setPointInMap(destino, false, true, destino.nombre + ' / ' + destino.ent_abr);
  }

  deleteDestine(id_dest: string){
    this.cleanMap();
    let newArray:DestinationInegi[] = [];
    if(this.destinosSeleccionados().length > 1){
      for (let index = 0; index < this.destinosSeleccionados().length; index++) {
        let destino = this.destinosSeleccionados()[index]
        if(destino.id_dest != id_dest){
          newArray.push(destino);
        }
      }
    }
    this.destinosSeleccionados.set(newArray);
    // Cuando se elimina un destino vamos a limpiar los resultados
    this.costServiceResponde.set([]);
  }

  // Funciones para el manejo de los mapas
  private cleanMap(){
    this.map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        this.map.removeLayer(layer);
      }
    });
    this.map.setView([19.432629, -99.133203], 7);
  }

  private setPointInMap(dataInegi: DestinationInegi, isOrigin: boolean, setView: boolean, label?: string) {
    let parsedGeojson: GeoJsonObject;
    let geojsonData = dataInegi.geojson

    try {
      parsedGeojson = typeof geojsonData === 'string' ? JSON.parse(geojsonData) : geojsonData;
    } catch (error) {
      console.error('GeoJSON inválido:', error, geojsonData);
      return;
    }

    if ('crs' in parsedGeojson) {
      const geojsonWithoutCrs = { ...parsedGeojson } as any;
      delete geojsonWithoutCrs.crs;
      parsedGeojson = geojsonWithoutCrs;
    }

    const layer = L.geoJSON(parsedGeojson as any, {
      onEachFeature: (feature, layer) => {
        if (label) {
          layer.bindTooltip(label, { permanent: true, direction: 'top' });
        }
        layer.on('click', () => {
          if (isOrigin){
            this.selectOrigen(dataInegi);
          }else{
            this.selectDestine(dataInegi);
          }
        })
      }
    }).addTo(this.map);

    if (setView){
      const point = (parsedGeojson as any).type === 'Point'
        ? (parsedGeojson as any).coordinates
        : (parsedGeojson as any).geometry?.type === 'Point'
          ? (parsedGeojson as any).geometry.coordinates
          : null;

      if (point && Array.isArray(point) && point.length >= 2) {
        this.map.setView([point[1], point[0]], 12);
      }

      if (layer.getBounds) {
        this.map.fitBounds(layer.getBounds(), { maxZoom: 16 });
      }
    }
  }

  private setPointTollInMap(dataInegi: DataDetailCostInegi, label: string){
    let parsedGeojson: GeoJsonObject;
    let geojsonData = dataInegi.geojson

    try {
      parsedGeojson = typeof geojsonData === 'string' ? JSON.parse(geojsonData) : geojsonData;
    } catch (error) {
      console.error('GeoJSON inválido:', error, geojsonData);
      return;
    }

    if ('crs' in parsedGeojson) {
      const geojsonWithoutCrs = { ...parsedGeojson } as any;
      delete geojsonWithoutCrs.crs;
      parsedGeojson = geojsonWithoutCrs;
    }

    const layer = L.geoJSON(parsedGeojson as any, {
      onEachFeature: (feature, layer) => {
        if (label) {
          layer.bindTooltip(label, { permanent: true, direction: 'top' });
        }
      }
    }).addTo(this.map);
  }

  private setRoutetInMap(dataInegi: DataCostInegi) {
    let parsedGeojson: GeoJsonObject;
    let geojsonData = dataInegi.geojson

    try {
      parsedGeojson = typeof geojsonData === 'string' ? JSON.parse(geojsonData) : geojsonData;
    } catch (error) {
      console.error('GeoJSON inválido:', error, geojsonData);
      return;
    }

    if ('crs' in parsedGeojson) {
      const geojsonWithoutCrs = { ...parsedGeojson } as any;
      delete geojsonWithoutCrs.crs;
      parsedGeojson = geojsonWithoutCrs;
    }

    const layer = L.geoJSON(parsedGeojson as any).addTo(this.map);

    if (layer.getBounds) {
      this.map.fitBounds(layer.getBounds(), { maxZoom: 16 });
    }
  }

  // Obeter token de la sesión actual del usuario
  getSessionToken():string {
    // Validamos que el token esta vigente para poder hacer la consulta
    if(this.userService.isTokenValid()){
      return this.userService.sessionUser()?.token || ""
    }else{
      // Si el token ya expiro, cerramos la sesion y mandamos a pagina principal
      this.userService.clearSession();
      this.router.navigate(['/']);
      return ""
    }
  }

  // Funciones para los selects
  selectVehicle(value: string) {
    let valueNum = Number(value);
    this.selectedVehicle.set(valueNum);
    // Cuando se cambia tipo de vehiculo, tambien limpiamos los resultados
    this.costServiceResponde.set([]);
  }

  selectOver(value: string) {
    let valueNum = Number(value)
    this.selectedOver.set(valueNum);
    // Cuando se cambia el numero de ejes exedentes, tambien limpiamos los resultados
    this.costServiceResponde.set([]);
  }

  // Funcion para obtener los costos de las casetas
  validateFormToCalculation() {
    //Limpiamos los errores del formulario
    this.errorsFormCost.set([]);
    const newErrorsForm:string[] = [];
    // Se valida que se seleccionara origen
    if (this.origenSeleccionado() == null){
      newErrorsForm.push("No se selecciono origen");
    }
    // Se valida que se seleccionara un destino
    if (this.destinosSeleccionados().length == 0){
      newErrorsForm.push("No se selecciono destino");
    }
    // Se valida que se seleccionara tipo de vehiculo
    if (this.selectedVehicle() == -1){
      newErrorsForm.push("No se selecciono tipo de vehículo");
    }
    // Se valida que se seleccionara eje excedente, solo cuando es camion de 2 ejes o mas
    if (this.selectedOver() == -1){
      newErrorsForm.push("No se seleccionaron los ejes excedentes");
    }

    if (newErrorsForm.length > 0){
      this.errorsFormCost.set(newErrorsForm);
      return;
    }

    //Si no existen errores ahora si se va a realizar las peticiones
    if (!this.calculationLoading()){
      this.calculationLoading.set(true);
      // Seteamos todas las variables a cero
      this.costServiceResponde.set([]);
      this.totalTollCost = 0;
      this.totalOverCost = 0;
      this.totalLongKms = 0.0;
      this.totalMinTime = 0.0;
      this.totalWarnings = '';
      this.elementsInListOfCost.set([]);
      this.detailsCostRouteResponse.set([]);
      this.detailsCostRoute.set([]);
      this.showDetails.set(false);
      // Se llama el servicio tantos destinos existan
      this.calculateRouteCost(0);
    }
  }

  calculateRouteCost(index: number): void{
    const sessionToken = this.getSessionToken();
    let originIdDes = '';
    if (index == 0){
      originIdDes = this.origenSeleccionado()?.id_dest || '';
    }else{
      originIdDes = this.destinosSeleccionados()[index - 1].id_dest;
    }

    const destinationIdDes = this.destinosSeleccionados()[index].id_dest;
    const vehicleStr = this.selectedVehicle().toString();
    const overStr = this.selectedOver().toString();

    this.inegiService.calculateRoute(originIdDes,destinationIdDes, vehicleStr, overStr, sessionToken).subscribe({
      next: (response) => {
        // LLenamos el arreglo de rutas obtenidas en el servicio
        this.costServiceResponde.update((current) => [...current, response]);
        if (index == 0){
          // Se limpia el mapa antes de agregar nuevos puntos
          this.cleanMap();
        }
        if (index == this.destinosSeleccionados().length - 1){
          this.calculationLoading.set(false);
          this.setResultCostInList();
        }else{
          this.calculateRouteCost(index + 1);
        }
      },
      error: (error: HttpErrorResponse) => {
        // Mostrar el mensaje de error del servidor
        this.errorsFormCost.set([error.error.error.message]);
        this.calculationLoading.set(false);
      }
    })
  }

  setResultCostInList(){
    //Ya se tienen todas los calculos de las rutas en el arreglo costServiceResponde, se itera para obtener las sumas de los resultados
    for (let index = 0; index < this.costServiceResponde().length; index++) {
      const element = this.costServiceResponde()[index];
      this.totalTollCost += element.costo_caseta;
      this.totalOverCost += element.eje_excedente || 0;
      this.totalLongKms += element.long_km;
      this.totalMinTime += element.tiempo_min;
      if (element.advertencia != ''){
        if (this.totalWarnings == ''){
          this.totalWarnings = element.advertencia;
        }else{
          this.totalWarnings += '\n' + element.advertencia;
        }
      }
      this.setRoutetInMap(element);
    }
    // Formamos la variable para mostrar el costo de la caseta mas los excedentes
    let titleTolls = 'Costo total de las casetas';
    let valueTolls = this.totalTollCost == 0 ? 'No hay costo de peaje en esta ruta' : '$' + this.totalTollCost +'.00';
    if (this.totalOverCost != 0){
      titleTolls += ' + ejes excedentes';
      let totalTollOver = this.totalTollCost + this.totalOverCost
      valueTolls = '$' + totalTollOver +'.00';
    }

    // Cuando ya se setearon las variables, construimos el listado de los elemenos a mostrar
    let tollCost: DetailCostData = {
      id: 1,
      bgColor: '#f26a525b',
      iconColor: '#8C2626',
      icon: 'fa-solid fa-hand-holding-dollar',
      titleStrong: '',
      title: titleTolls,
      value: valueTolls,
      subValue: '',
      btnDetail: this.totalTollCost == 0 ? false : true
    };
    let longKms: DetailCostData = {
      id: 2,
      bgColor: '#f26a525b',
      iconColor: '#8C2626',
      icon: 'fa-solid fa-route',
      titleStrong: '',
      title: 'Total de kilometros',
      value: this.totalLongKms +' Kms',
      subValue: '',
      btnDetail: false
    };
    let totalTime: DetailCostData = {
      id: 3,
      bgColor: '#f26a525b',
      iconColor: '#8C2626',
      icon: 'fa-solid fa-hourglass-half',
      titleStrong: '',
      title: 'Total de tiempo estimado',
      value: this.convertMinutesToDescription(this.totalMinTime),
      subValue: '',
      btnDetail: false
    };
    let warnings: DetailCostData = {
      id: 4,
      bgColor: '#f26a525b',
      iconColor: '#8C2626',
      icon: 'fa-solid fa-triangle-exclamation',
      titleStrong: '',
      title: 'Advertencias en la ruta',
      value: this.totalWarnings,
      subValue: '',
      btnDetail: false
    };

    let newElementsOfList:DetailCostData[] = [tollCost]
    newElementsOfList.push(longKms);
    newElementsOfList.push(totalTime);
    if (this.totalWarnings != ''){
      newElementsOfList.push(warnings)
    }
    this.elementsInListOfCost.set(newElementsOfList);
  }

  newCalculation(){
    this.selectedOver.set(0);
    this.selectedVehicle.set(-1);
    this.elementsInListOfCost.set([])
    this.showDetails.set(false);
  }

  showDetailOfRoutes(isOpen: boolean){
    this.showDetails.set(isOpen);
    // Cuando se pulse el boton de opcion, vamos a consumir el servicio para obtener los detalles de las casetas
    if (this.detailsCostRoute().length == 0){
      // Si no se tienen detalles consumimos el servicio
      if (!this.calculationLoading()){
        this.calculationLoading.set(true);
        this.getDetailsOfRoute(0);
      }
    }
  }

  getDetailsOfRoute(index: number): void{
    const sessionToken = this.getSessionToken();
    let originIdDes = '';
    if (index == 0){
      originIdDes = this.origenSeleccionado()?.id_dest || '';
    }else{
      originIdDes = this.destinosSeleccionados()[index - 1].id_dest;
    }

    const destinationIdDes = this.destinosSeleccionados()[index].id_dest;
    const vehicleStr = this.selectedVehicle().toString();
    const overStr = this.selectedOver().toString();

    this.inegiService.detailRoute(originIdDes,destinationIdDes, vehicleStr, overStr, sessionToken).subscribe({
      next: (response) => {
        // LLenamos el arreglo de rutas obtenidas en el servicio
        if (index == 0){
          this.detailsCostRouteResponse.set(response);
        }else{
          let newDetails = this.detailsCostRouteResponse()
          for (let index = 0; index < response.length; index++) {
            const element = response[index];
            newDetails.push(element);
          }
          this.detailsCostRouteResponse.set(newDetails);
        }
        if (index == this.destinosSeleccionados().length - 1){
          this.calculationLoading.set(false);
          this.setResultDetailsInList();
        }else{
          this.getDetailsOfRoute(index + 1);
        }
      },
      error: (error: HttpErrorResponse) => {
        // Mostrar el mensaje de error del servidor
        this.errorsFormCost.set([error.error.error.message]);
        this.calculationLoading.set(false);
      }
    })
  }

  setResultDetailsInList(){
    //Ya se tienen todas los detalles de las rutas en el arreglo detailsCostRouteResponse, se itera para colocar las casetas en un listado
    let newListPoints:DetailCostData[] = []
    for (let index = 0; index < this.detailsCostRouteResponse().length; index++) {
      const element = this.detailsCostRouteResponse()[index];
      if (element.costo_caseta > 0){
        const icon = element.eje_excedente == 0 ? 'fa-solid fa-hand-holding-dollar' : 'fa-solid fa-truck-moving';
        let tollCost: DetailCostData = {
          id: newListPoints.length,
          bgColor: '#f26a525b',
          iconColor: '#8C2626',
          icon: icon,
          titleStrong: (newListPoints.length + 1) + '.-',
          title: element.direccion,
          value: '$' + element.costo_caseta + '.00',
          subValue: element.eje_excedente == 0 ? '' : '+$' + element.eje_excedente + '.00 por ejes exedentes',
          btnDetail: false
        };
        newListPoints.push(tollCost);
        this.setPointTollInMap(element, (newListPoints.length) + '')
      }
    }
    this.detailsCostRoute.set(newListPoints);
  }

  //Utilidades
  convertMinutesToDescription(min: number): string {
    // 1. Convertir minutos decimales a segundos totales
    const totalSec = Math.round(min * 60);

    // 2. Calcular horas
    const hour = Math.floor(totalSec / 3600);

    // 3. Calcular minutos restantes
    const restMinutes = Math.floor((totalSec % 3600) / 60);

    // 4. Calcular segundos restantes
    const seconds = totalSec % 60;

    // 5. Formatear con ceros a la izquierda si es necesario y retornar string
    const formatear = (val: number) => val < 10 ? `0${val}` : val;

    return `${hour} h ${formatear(restMinutes)} min ${formatear(seconds)} seg`;
  }
}
