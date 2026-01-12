
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Database, 
  Settings,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'new-case', label: 'Novo Caso', icon: <PlusCircle size={20} /> },
  { id: 'image-analysis', label: 'Análise Forense', icon: <ImageIcon size={20} /> },
  { id: 'osint', label: 'OSINT Legal', icon: <Search size={20} /> },
  { id: 'evidence-center', label: 'Central de Evidências', icon: <Database size={20} /> },
  { id: 'reports', label: 'Relatórios', icon: <FileText size={20} /> },
];

export const STATUS_COLORS = {
  OPEN: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  IN_PROGRESS: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  CLOSED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50',
};
