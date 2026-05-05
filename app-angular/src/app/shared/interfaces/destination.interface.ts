export interface DestinationResponse {
  ok:      boolean;
  message: string;
  inegi:   Inegi;
}

export interface Inegi {
  data:     DestinationInegi[];
  meta:     MetaInegi;
  response: ResponseInegi;
}

export interface DestinationInegi {
  geojson: string;
  ent_abr: string;
  id_dest: string;
  nombre:  string;
}

export interface MetaInegi {
  fuente: string;
}

export interface ResponseInegi {
  success: boolean;
  message: string;
}
