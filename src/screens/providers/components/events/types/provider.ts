export interface Provider {
  id: number;
  name: string;
  chouetteInfo?: {
    enableExperimentalImport?: boolean;
  };
}

export type ProviderMap = Record<string, Provider>;
