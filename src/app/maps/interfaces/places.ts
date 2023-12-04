
export interface PlacesResponse {
  type:        string;
  query:       number[];
  features:    Feature[];
  attribution: string;
}

export interface Feature {
  id:            string;
  type:          string;
  place_type:    string[];
  relevance:     number;
  properties:    Properties;
  text_es:       string;
  place_name_es: string;
  text:          string;
  place_name:    string;
  center:        number[];
  geometry:      Geometry;
  address?:      string;
  context?:      Context[];
  language_es?:  Language;
  language?:     Language;
  bbox?:         number[];
}

export interface Context {
  id:           string;
  mapbox_id?:   string;
  text_es:      string;
  language_es?: Language;
  text:         string;
  language?:    Language;
  wikidata?:    Wikidata;
  short_code?:  Language;
}

export enum Language {
  Es = "es",
  EsMa = "ES-MA",
}

export enum Wikidata {
  Q29 = "Q29",
  Q8851 = "Q8851",
  Q95028 = "Q95028",
}

export interface Geometry {
  type:        string;
  coordinates: number[];
}

export interface Properties {
  accuracy?:   string;
  mapbox_id?:  string;
  wikidata?:   Wikidata;
  short_code?: Language;
}
