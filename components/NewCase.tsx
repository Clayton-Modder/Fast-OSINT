
import React, { useState } from 'react';
import { Case, CaseStatus, IncidentType } from '../types';
import { User, Phone, Globe, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { classifyIncident } from '../services/gemini';

interface NewCaseProps {
  onAddCase: (caseData: Case) => void;
}

const NewCase: React.FC<NewCaseProps> = ({ onAddCase }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    victimName: '',
    victimContact: '',
    platform: '',
    description: '',
    title: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // AI classifies the incident automatically based on description
      const aiAnalysis = await classifyIncident(formData.description);
      
      const newCase: Case = {
        id: `CAS-${Date.now().toString().slice(-6)}`,
        title: formData.title || aiAnalysis.type,
        victimName: formData.victimName,
        victimContact: formData.victimContact,
        platform: formData.platform,
        description: formData.description,
        incidentType: aiAnalysis.type as IncidentType,
        riskLevel: aiAnalysis.riskLevel,
        createdAt: Date.now(),
        status: CaseStatus.OPEN,
        evidences: [],
        analysis: aiAnalysis.summary
      };
      
      onAddCase(newCase);
    } catch (err) {
      console.error(err);
      // Fallback if AI fails
      const newCase: Case = {
        id: `CAS-${Date.now().toString().slice(-6)}`,
        title: formData.title || 'Novo Caso',
        victimName: formData.victimName,
        victimContact: formData.victimContact,
        platform: formData.platform,
        description: formData.description,
        incidentType: IncidentType.OTHER,
        riskLevel: 'Médio',
        createdAt: Date.now(),
        status: CaseStatus.OPEN,
        evidences: []
      };
      onAddCase(newCase);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
        <h2 className="text-2xl font-bold mb-2">Abertura de Protocolo</h2>
        <p className="text-slate-400">Insira os dados da vítima e o relato do incidente para triagem automatizada.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Nome da Vítima
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Nome ou Apelido"
              value={formData.victimName}
              onChange={(e) => setFormData({...formData, victimName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Phone size={14} /> Contato
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="E-mail ou Telefone"
              value={formData.victimContact}
              onChange={(e) => setFormData({...formData, victimContact: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} /> Plataforma
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Ex: WhatsApp, Instagram, E-mail"
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={14} /> Título do Caso
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Ex: Tentativa de Golpe Boleto"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={14} /> Descrição do Incidente
          </label>
          <textarea
            required
            rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Descreva detalhadamente o ocorrido, mensagens recebidas, links clicados e comportamentos suspeitos..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-4">
          <AlertCircle className="text-blue-400 shrink-0" size={20} />
          <p className="text-xs text-blue-300 leading-relaxed">
            Ao clicar em "Gerar Protocolo", nosso sistema de IA analisará o relato para sugerir o nível de risco e a tipificação do crime digital.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analisando Incidente...
              </>
            ) : (
              'Gerar Protocolo e Iniciar Análise'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCase;
