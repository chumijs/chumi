import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ChumiRequestData, ChumiResponseData } from '../../../chumi';

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

export type ApiFunction<
  T extends abstract new (...args: any) => any,
  S extends keyof InstanceType<T>
> = (...args: ChumiRequestData<T, S>) => Promise<ApiResponse<ChumiResponseData<T, S>>>;

export type ApiResponseData<
  T extends abstract new (...args: any) => any,
  S extends keyof InstanceType<T>
> = (ReturnType<ApiFunction<T, S>> extends Promise<infer U> ? U : never)['data'];

export default request;
