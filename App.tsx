
import React, { useState, useEffect } from 'react';
import { NAVIGATION_ITEMS } from './constants';
import { AppTab, Case, CaseStatus, IncidentType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewCase from './components/NewCase';
import ImageAnalysis from './components/ImageAnalysis';
import OSINTTool from './components/OSINTTool';
import EvidenceCenter from './components/EvidenceCenter';
import ReportGenerator from './components/ReportGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Initialize with dummy data
  useEffect(() => {
    const mockCases: Case[] = [
      {
        id: 'CAS-2024-001',
        title: 'Tentativa de Phishing Bancário',
        victimName: 'Carlos Silva',
        victimContact: 'carlos@email.com',
        platform: 'WhatsApp / SMS',
        description: 'Recebeu link falso solicitando atualização de dados bancários com ameaça de bloqueio de conta.',
        incidentType: IncidentType.FRAUD,
        riskLevel: 'Médio',
        createdAt: Date.now() - 86400000,
        status: CaseStatus.IN_PROGRESS,
        evidences: []
      },
      {
        id: 'CAS-2024-002',
        title: 'Extorsão via Rede Social',
        victimName: 'Anônimo',
        victimContact: 'anon@prov.com',
        platform: 'Instagram',
        description: 'Perfil falso ameaçando divulgar imagens privadas caso não receba pagamento em cripto.',
        incidentType: IncidentType.EXTORTION,
        riskLevel: 'Crítico',
        createdAt: Date.now() - 172800000,
        status: CaseStatus.CRITICAL,
        evidences: []
      }
    ];
    setCases(mockCases);
  }, []);

  const handleAddCase = (newCase: Case) => {
    setCases(prev => [newCase, ...prev]);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard cases={cases} onSelectCase={(id) => { setSelectedCaseId(id); setActiveTab('evidence-center'); }} />;
      case 'new-case':
        return <NewCase onAddCase={handleAddCase} />;
      case 'image-analysis':
        return <ImageAnalysis cases={cases} />;
      case 'osint':
        return <OSINTTool />;
      case 'evidence-center':
        return <EvidenceCenter cases={cases} setCases={setCases} selectedCaseId={selectedCaseId} />;
      case 'reports':
        return <ReportGenerator cases={cases} />;
      default:
        return <Dashboard cases={cases} onSelectCase={setSelectedCaseId} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {NAVIGATION_ITEMS.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Agente: <span className="text-slate-200">ID-7492</span></span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">AD</div>
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
