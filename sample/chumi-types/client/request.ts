import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// 定义通用的 Response 类型
export interface ApiResponse<T> {
  ret: 0 | -1;
  msg: string;
  data: T;
}

interface CustomInstance extends AxiosInstance {
  get<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  post<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

const request: CustomInstance = axios.create();

request.interceptors.response.use((response) => {
  const result = response.data;
  return result;
});

export type AxiosReturnType<S extends Promise<ApiResponse<any>>> = (S extends Promise<infer T>
  ? T
  : never)['data'];

export type ApiReturnType<S extends (...args: any) => any> = AxiosReturnType<ReturnType<S>>;

export default request;
