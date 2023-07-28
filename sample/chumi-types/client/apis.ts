import { ControllersType } from '../server/Controllers';
import request, { ApiFunction, ApiResponseData } from './request';

type ChainType = ControllersType['Chain'];

export const testA: ApiFunction<ChainType, 'a'> = async (name, id) => {
  return await request.get(`/a?name=${name}&id=${id}`);
};
export type testAData = ApiResponseData<ChainType, 'a'>;

export const testB: ApiFunction<ChainType, 'b'> = async () => {
  return await request.get(`/b`);
};
export type testBData = ApiResponseData<ChainType, 'b'>;

export const testC: ApiFunction<ChainType, 'c'> = async () => {
  return await request.get(`/b`);
};
export type testCData = ApiResponseData<ChainType, 'c'>;
