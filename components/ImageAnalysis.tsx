
import React, { useState, useRef } from 'react';
import { Case } from '../types';
import { Upload, ImageIcon, Loader2, Search, FileCode, CheckCircle2, Globe, ExternalLink, ShieldAlert } from 'lucide-react';
import { analyzeForensicImage, visualOSINT } from '../services/gemini';

interface ImageAnalysisProps {
  cases: Case[];
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ cases }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [osintResults, setOsintResults] = useState<{text: string, sources: any[]} | null>(null);
  const [mode, setMode] = useState<'forensic' | 'osint'>('forensic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setReport(null);
        setOsintResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];
      
      if (mode === 'forensic') {
        const result = await analyzeForensicImage(base64Data, mimeType);
        setReport(result || 'Falha ao processar análise.');
      } else {
        const result = await visualOSINT(base64Data, mimeType);
        setOsintResults(result);
      }
    } catch (err) {
      console.error(err);
      setReport('Erro na comunicação com o servidor forense.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        {analyzing && (
           <div className="absolute inset-0 bg-blue-500/5 pointer-events-none">
             <div className="w-full h-1 bg-blue-500/20 absolute top-0 animate-pulse"></div>
             <div className="h-full w-1 bg-blue-500/20 absolute left-0 animate-pulse"></div>
           </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-blue-400" /> Investigação de Imagem
              </h3>
              <div className="flex bg-slate-800 p-1 rounded-lg">
                <button 
                  onClick={() => setMode('forensic')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mode === 'forensic' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  Forense
                </button>
                <button 
                  onClick={() => setMode('osint')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mode === 'osint' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  Rastreamento Web
                </button>
              </div>
            </div>

            <p className="text-slate-400 text-sm">
              {mode === 'forensic' 
                ? 'Analise a integridade estrutural, metadados e possíveis manipulações digitais.' 
                : 'Localize a origem desta imagem na web e rastreie sua disseminação digital.'}
            </p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group ${
                selectedImage ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img src={selectedImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-xl" />
                    <div className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none"></div>
                  </div>
                  <p className="text-sm text-blue-400 font-medium group-hover:underline">Clique para trocar a imagem</p>
                </div>
              ) : (
                <div className="space-y-4 py-8">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto ring-4 ring-slate-900">
                    <Upload className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Arraste a prova ou clique aqui</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Cadeia de Custódia Ativa</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={runAnalysis}
              disabled={!selectedImage || analyzing}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'forensic' 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' 
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
              } disabled:bg-slate-800 text-white`}
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {mode === 'forensic' ? 'Escaneando Bitstream...' : 'Rastreando Footprint...'}
                </>
              ) : (
                <>
                  {mode === 'forensic' ? <Search size={20} /> : <Globe size={20} />}
                  {mode === 'forensic' ? 'Iniciar Análise Forense' : 'Pesquisa Visual Global'}
                </>
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-[400px]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {mode === 'forensic' ? <FileCode className="text-amber-400" /> : <Globe className="text-emerald-400" />}
              Resultados da {mode === 'forensic' ? 'Análise Técnica' : 'Varredura OSINT'}
            </h3>
            
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm overflow-y-auto max-h-[500px] scrollbar-hide">
              {analyzing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] uppercase tracking-tighter">Processando pacotes...</span>
                  </div>
                  <div className="h-4 bg-slate-800/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
                  <div className="h-32 bg-slate-800/50 rounded w-full animate-pulse"></div>
                </div>
              ) : mode === 'forensic' ? (
                report ? (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    <div className="flex items-center gap-2 text-emerald-400 mb-4 border-b border-emerald-900/30 pb-2">
                      <CheckCircle2 size={16} />
                      <span className="text-xs uppercase font-bold tracking-widest">Relatório Técnico Gerado</span>
                    </div>
                    {report}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50">
                    <ShieldAlert size={48} />
                    <p className="text-center text-xs">Aguardando entrada de evidência para análise bit-a-bit.</p>
                  </div>
                )
              ) : (
                osintResults ? (
                  <div className="space-y-6">
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300">
                       <div className="flex items-center gap-2 text-emerald-400 mb-4 border-b border-emerald-900/30 pb-2">
                        <Globe size={16} />
                        <span className="text-xs uppercase font-bold tracking-widest">Inteligência Visual</span>
                      </div>
                      {osintResults.text}
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-slate-800">
                      <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Links Relacionados</h4>
                      {osintResults.sources.map((source: any, i: number) => (
                        <a 
                          key={i} 
                          href={source.web?.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 transition-all group"
                        >
                          <span className="text-xs text-slate-400 truncate pr-4 group-hover:text-white">{source.web?.title || 'Fonte Web'}</span>
                          <ExternalLink size={12} className="text-slate-600 group-hover:text-emerald-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50">
                    <Globe size={48} />
                    <p className="text-center text-xs">Pronto para rastreamento global de imagem.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Search className="text-blue-400" size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Forense</p>
            <p className="text-sm font-semibold">Metadata EXIF/IPTC</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Globe className="text-emerald-400" size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">OSINT</p>
            <p className="text-sm font-semibold">Visual Search Tracking</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="text-amber-400" size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Status</p>
            <p className="text-sm font-semibold">Integridade Validada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
