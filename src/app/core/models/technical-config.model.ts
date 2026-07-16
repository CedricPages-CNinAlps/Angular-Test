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
  email: string;
}

export interface TechnicalConfig {
  jsonBin: JsonBinConfig;
  emailJs: EmailJsConfig;
  admin: AdminSecurityConfig;
}

export const EMPTY_TECHNICAL_CONFIG: TechnicalConfig = {
  jsonBin: {
    binId: '6a5633baf5f4af5e298d65e2',
    accessKey: '$2a$10$qGpfhHOrRcz7bWuUV/1RAOHZ9PBbHgO4U9UOB/6BtHBv.BhGxrrtu',
  },
  emailJs: { serviceId: '', templateId: '', publicKey: '' },
  admin: { passwordHash: '', urlToken: '', email: 'contact@cedric-pages.fr' },
};
