import { SymbolApiTags } from './constants';

export default function ApiTags(tags: string | string[]) {
  return (Controller: Function): any => {
    Controller[SymbolApiTags] = typeof tags === 'string' ? [tags] : tags;
    return Controller;
  };
}
