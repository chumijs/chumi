import { SymbolParameter, ALL, parameterMap, BaseDataType } from './constants';

const handleParameterDecorator = (
  type: parameterMap['type'],
  property: string | typeof ALL,
  dataType?: BaseDataType
): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === 'string') {
      if (!target[SymbolParameter]) {
        target[SymbolParameter] = {};
      }
      if (!target[SymbolParameter][propertyKey]) {
        target[SymbolParameter][propertyKey] = [];
      }
      target[SymbolParameter][propertyKey].push({
        property,
        parameterIndex,
        type,
        dataType
      });
    }
  };
};

export const Param = (property?: string | typeof ALL): ParameterDecorator => {
  return handleParameterDecorator('param', property);
};

Param.string = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('param', property, String);
};

Param.number = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('param', property, Number);
};

export const Query = (property?: string | typeof ALL): ParameterDecorator => {
  return handleParameterDecorator('query', property);
};

Query.string = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('query', property, String);
};

Query.number = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('query', property, Number);
};

export const Body = (property?: string | typeof ALL): ParameterDecorator => {
  return handleParameterDecorator('body', property);
};

Body.string = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('body', property, String);
};

Body.number = function (property?: string): ParameterDecorator {
  return handleParameterDecorator('body', property, Number);
};

export const Header = (property?: string | typeof ALL): ParameterDecorator => {
  return handleParameterDecorator('header', property);
};
