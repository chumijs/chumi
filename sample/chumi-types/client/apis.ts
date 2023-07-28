import { ChumiResponseData } from '../../../chumi';
import Chain from '../server/Controllers/Chain';
import request, { ApiReturnType } from './request';

export const testA = async () => {
  return await request.get<ChumiResponseData<typeof Chain, 'a'>>(`/a`);
};
export type testAData = ApiReturnType<typeof testA>;

export const testB = async () => {
  return await request.get<ChumiResponseData<typeof Chain, 'b'>>(`/b`);
};
export type testBData = ApiReturnType<typeof testB>;

export const testC = async () => {
  return await request.get<ChumiResponseData<typeof Chain, 'c'>>(`/b`);
};
export type testCData = ApiReturnType<typeof testC>;
