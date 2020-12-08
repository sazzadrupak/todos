import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys';

export function bodyValidator<T>(keys: { new(...args: any[]): T }) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
  }
}