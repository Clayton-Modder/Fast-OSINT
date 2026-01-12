
import React, { useState } from 'react';
import { Case } from '../types';
import { FileText, Printer, Download, Share2, Loader2, AlertCircle } from 'lucide-react';
import { generateCaseReport } from '../services/gemini';

interface ReportGeneratorProps {
  cases: Case[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ cases }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentCase = cases.find(c => c.id === selectedCaseId);

  const handleGenerate = async () => {
    if (!currentCase) return;
    setLoading(true);
    try {
      const result = await generateCaseReport(currentCase);
      setReport(result || 'Falha ao gerar o corpo do relatório.');
    } catch (err) {
      console.error(err);
      setReport('Erro ao conectar com o motor de geração de relatórios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Gerar Novo Laudo</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase block mb-1">Selecionar Caso</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none"
                value={selectedCaseId}
                onChange={(e) => { setSelectedCaseId(e.target.value); setReport(null); }}
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.id} - {c.victimName}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedCaseId}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
              Compilar Relatório Técnico
            </button>
          </div>
        </div>

        {report && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Ações Disponíveis</h3>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors">
              <Printer size={18} /> Imprimir PDF
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors">
              <Download size={18} /> Baixar .DOCX
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors">
              <Share2 size={18} /> Enviar p/ Jurídico
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
          <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">PID</div>
              <div>
                <h2 className="font-bold text-lg uppercase">Laudo de Investigação Digital</h2>
                <p className="text-xs text-slate-500">Documento Oficial de Cadeia de Custódia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">Data de Emissão</p>
              <p className="text-sm">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="p-12 flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 size={48} className="animate-spin text-blue-600" />
                <p className="text-slate-500 animate-pulse font-medium">Consolidando evidências e gerando narrativa técnica...</p>
              </div>
            ) : report ? (
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
                  {report}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 space-y-4">
                <AlertCircle size={48} className="opacity-10" />
                <div className="text-center">
                  <p className="font-semibold text-lg">Nenhum relatório gerado</p>
                  <p className="text-sm">Selecione um caso ao lado para processar o laudo técnico.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-200 bg-slate-50 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            Painel de Investigação Digital - Desenvolvido para Segurança e Ética Cibernética
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
