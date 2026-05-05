export interface DetailRouteCostResponse {
  ok:      boolean;
  message: string;
  inegi:   DetailCostInegi;
}

export interface DetailCostInegi {
  data:     DataDetailCostInegi[];
  meta:     Meta;
  response: Response;
}

export interface DataDetailCostInegi {
  geojson:       string;
  eje_excedente: number;
  costo_caseta:  number;
  tiempo_min:    number;
  long_m:        number;
  punto_caseta:  null | string;
  direccion:     string;
  giro:          number;
}

export interface Meta {
  fuente: string;
}

export interface Response {
  success: boolean;
  message: string;
}
