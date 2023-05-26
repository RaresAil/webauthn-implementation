import { v5 } from 'uuid';

export const makeUUID = (value: string) => {
  return v5(value, process.env.UUID_NAMESPACE);
};
