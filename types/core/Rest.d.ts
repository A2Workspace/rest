import { AxiosInstance, AxiosResponse } from 'axios';

export interface RestOptions {
  axios: AxiosInstance;
  fetchAll?: RestFetchAllConfig;
  create?: RestPostConfig;
  fetch?: RestGetConfig;
  update?: RestPostConfig;
  delete?: RestGetConfig;
}

interface RestGetConfig {
  method: string;
  params: Record<string, any>;
}

interface RestPostConfig {
  method: string;
  data: Record<string, any>;
}

interface RestFetchAllConfig extends RestGetConfig {
  method: string;
  params: Record<string, any>;
}

declare class Rest {
  #resourceURN: string;
  #axios: AxiosInstance;
  #options: RestOptions;

  constructor(urn: string, options?: RestOptions);
  fetchAll(params?: object): Promise<AxiosResponse>;
  fetchAll(params: (currentQuery: Record<string, any>) => Record<string, any>): Promise<AxiosResponse>;
  create(data?: object): Promise<AxiosResponse>;
  fetch(id: string | number, params?: Record<string, any>): Promise<AxiosResponse>;
  update(id: string | number, data?: Record<string, any>): Promise<AxiosResponse>;
  delete(id: string | number, params?: Record<string, any>): Promise<AxiosResponse>;
}

interface RestInstarce extends Rest {

}
