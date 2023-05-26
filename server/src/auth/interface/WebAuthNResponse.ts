export enum WebAuthNType {
  Create = 'webauthn.create',
  Get = 'webauthn.get',
}

export interface WebAuthNResponse {
  type: WebAuthNType;
  challenge: string;
  origin: string;
}
