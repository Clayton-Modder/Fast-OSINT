
export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CRITICAL = 'CRITICAL'
}

export enum IncidentType {
  FRAUD = 'Golpe / Fraude',
  THREAT = 'Ameaça',
  INVASION = 'Invasão',
  DEFAMATION = 'Difamação / Calúnia',
  EXTORTION = 'Extorsão',
  OTHER = 'Outro'
}

export interface Evidence {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  timestamp: number;
  data: string; // base64
}

export interface Case {
  id: string;
  title: string;
  victimName: string;
  victimContact: string;
  platform: string;
  description: string;
  incidentType: IncidentType;
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  createdAt: number;
  status: CaseStatus;
  evidences: Evidence[];
  analysis?: string;
}

export type AppTab = 'dashboard' | 'new-case' | 'image-analysis' | 'osint' | 'evidence-center' | 'reports';
