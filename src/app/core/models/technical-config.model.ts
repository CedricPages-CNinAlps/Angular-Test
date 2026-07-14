export interface JsonBinConfig {
  binId: string;
  accessKey: string;
}

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface AdminSecurityConfig {
  passwordHash: string;
  urlToken: string;
}

export interface TechnicalConfig {
  jsonBin: JsonBinConfig;
  emailJs: EmailJsConfig;
  admin: AdminSecurityConfig;
}

export const EMPTY_TECHNICAL_CONFIG: TechnicalConfig = {
  jsonBin: { binId: '', accessKey: '' },
  emailJs: { serviceId: '', templateId: '', publicKey: '' },
  admin: { passwordHash: '', urlToken: '' },
};
