
import React, { useState } from 'react';
import { Search, Globe, Shield, Loader2, ExternalLink, Hash } from 'lucide-react';
import { performLegalOSINT } from '../services/gemini';

const OSINTTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{text: string, sources: any[]} | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    try {
      const data = await performLegalOSINT(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6">Investigação em Fontes Abertas (OSINT)</h2>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Digite um e-mail, nome de usuário, telefone ou domínio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all"
          >
            {searching ? <Loader2 className="animate-spin" /> : <Globe size={20} />}
            {searching ? 'Pesquisando...' : 'Pesquisar'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Shield className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Privacidade</p>
              <p className="text-sm font-semibold">Busca Não Rastreada</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Hash className="text-amber-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Integridade</p>
              <p className="text-sm font-semibold">Logs Verificáveis</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Globe className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Alcance</p>
              <p className="text-sm font-semibold">Indexação Global</p>
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-4">Relatório de Inteligência</h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
              {results.text}
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-4">Fontes Identificadas</h3>
            <div className="space-y-4">
              {results.sources.length > 0 ? (
                results.sources.map((source: any, i: number) => (
                  <a 
                    key={i} 
                    href={source.web?.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-slate-200 truncate pr-4 group-hover:text-blue-400">
                        {source.web?.title || 'Fonte Externa'}
                      </h4>
                      <ExternalLink size={14} className="text-slate-500 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{source.web?.uri}</p>
                  </a>
                ))
              ) : (
                <div className="text-center py-12 text-slate-600">
                  <Globe size={40} className="mx-auto mb-2 opacity-20" />
                  <p>Nenhuma fonte externa listada especificamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OSINTTool;
