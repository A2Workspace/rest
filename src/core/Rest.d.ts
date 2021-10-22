import { AxiosInstance, AxiosResponse } from 'axios';

export interface RestOption {
  axios?: AxiosInstance;
  fetchAll?: object;
  create?: object;
  fetch?: object;
  update?: object;
  delete?: object;
}

export declare class Rest {
  #resourceURL: string;
  #axios: AxiosInstance;
  #currentQuery: object;

  constructor(uri: string, options?: object);
  fetchAll<T = AxiosResponse>(param?: object): Promise<T>;
  fetchAll<T = AxiosResponse>(param: (currentQuery: object) => object): Promise<T>;
  create<T = AxiosResponse>(data?: object): Promise<T>;
  fetch<T = AxiosResponse>(id: string | number, param?: object): Promise<T>;
  update<T = AxiosResponse>(id: string | number, data?: object): Promise<T>;
  delete<T = AxiosResponse>(id: string | number, params?: object): Promise<T>;
}
