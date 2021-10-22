import { AxiosInstance, AxiosResponse } from 'axios';

export interface RestOption {
  axios: AxiosInstance;
  fetchAll?: RestFetchAllConfig;
  create?: RestPostConfig;
  fetch?: RestGetConfig;
  update?: RestPostConfig;
  delete?: RestGetConfig;
}

export interface RestGetConfig {
  method: string,
  params: object,
}

export interface RestPostConfig {
  method: string,
  params: object,
}

export interface RestFetchAllConfig extends RestGetConfig {
  method: string;
  params: object;
}

export declare class Rest {
  #resourceURL: string;
  #axios: AxiosInstance;
  #currentQuery: object;

  constructor(uri: string, options?: RestOption);
  fetchAll<T = AxiosResponse>(param?: object): Promise<T>;
  fetchAll<T = AxiosResponse>(param: (currentQuery: object) => object): Promise<T>;
  create<T = AxiosResponse>(data?: object): Promise<T>;
  fetch<T = AxiosResponse>(id: string | number, param?: object): Promise<T>;
  update<T = AxiosResponse>(id: string | number, data?: object): Promise<T>;
  delete<T = AxiosResponse>(id: string | number, params?: object): Promise<T>;
}
