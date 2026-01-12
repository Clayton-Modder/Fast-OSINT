
import React, { useState, useRef } from 'react';
import { Case, Evidence } from '../types';
import { Database, FileUp, ShieldCheck, Download, Trash2, Loader2, Info } from 'lucide-react';

interface EvidenceCenterProps {
  cases: Case[];
  setCases: React.Dispatch<React.SetStateAction<Case[]>>;
  selectedCaseId: string | null;
}

const EvidenceCenter: React.FC<EvidenceCenterProps> = ({ cases, setCases, selectedCaseId }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const generateHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentCase) return;

    setUploading(true);
    try {
      const hash = await generateHash(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newEvidence: Evidence = {
          id: `EVID-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          hash: hash,
          timestamp: Date.now(),
          data: reader.result as string
        };

        setCases(prev => prev.map(c => 
          c.id === currentCase.id 
            ? { ...c, evidences: [...c.evidences, newEvidence] } 
            : c
        ));
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeEvidence = (evidenceId: string) => {
    setCases(prev => prev.map(c => 
      c.id === currentCase.id 
        ? { ...c, evidences: c.evidences.filter(e => e.id !== evidenceId) } 
        : c
    ));
  };

  if (!currentCase) return <div className="p-12 text-center text-slate-500">Nenhum caso disponível.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info className="text-blue-400" /> Detalhes do Caso
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Protocolo</p>
              <p className="text-sm font-mono text-blue-400">{currentCase.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Vítima</p>
              <p className="text-sm font-medium">{currentCase.victimName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Risco</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                currentCase.riskLevel === 'Crítico' ? 'border-red-500 text-red-400 bg-red-500/10' :
                currentCase.riskLevel === 'Alto' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                'border-slate-500 text-slate-400 bg-slate-500/10'
              }`}>
                {currentCase.riskLevel}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Descrição</p>
              <p className="text-sm text-slate-400 mt-1 line-clamp-4">{currentCase.description}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <FileUp size={20} />}
          Anexar Nova Evidência
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        
        <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex gap-3">
          <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
          <p className="text-[10px] text-emerald-300 leading-relaxed">
            Todas as evidências recebem automaticamente um hash SHA-256 no momento do upload para garantir a cadeia de custódia e integridade jurídica.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Database className="text-amber-400" /> Repositório de Evidências ({currentCase.evidences.length})
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {currentCase.evidences.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {currentCase.evidences.map((ev) => (
                <div key={ev.id} className="p-6 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center shrink-0">
                    {ev.type.startsWith('image/') ? (
                      <img src={ev.data} alt="thumb" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Database className="text-slate-500" size={20} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-200 truncate">{ev.name}</h4>
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 rounded border border-slate-800 uppercase">
                        {(ev.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      <p className="text-[10px] font-mono text-slate-500 truncate">SHA-256: {ev.hash}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => removeEvidence(ev.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center text-slate-500">
              <Database size={48} className="mx-auto mb-4 opacity-10" />
              <p>Nenhuma evidência anexada a este caso.</p>
              <p className="text-sm mt-2">Arraste arquivos ou use o botão para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceCenter;
