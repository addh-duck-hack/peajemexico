export interface RouteCostResponse {
  ok:      boolean;
  message: string;
  inegi:   CostInegi;
}

export interface CostInegi {
  data:     DataCostInegi;
  meta:     MetaInegi;
  response: ResponseInegi;
}

export interface DataCostInegi {
  geojson:      string;
  costo_caseta: number;
  tiempo_min:   number;
  advertencia:  string;
  long_km:      number;
  peaje:        string;
  eje_excedente: number | undefined;
}

export interface MetaInegi {
  fuente: string;
}

export interface ResponseInegi {
  success: boolean;
  message: string;
}
