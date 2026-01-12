
import React from 'react';
import { Case, CaseStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, Clock, CheckCircle2, Fingerprint, ExternalLink } from 'lucide-react';
import { STATUS_COLORS } from '../constants';

interface DashboardProps {
  cases: Case[];
  onSelectCase: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, onSelectCase }) => {
  const stats = [
    { label: 'Casos Totais', value: cases.length, icon: <Fingerprint className="text-blue-400" />, bg: 'bg-blue-400/10' },
    { label: 'Em Aberto', value: cases.filter(c => c.status === CaseStatus.OPEN).length, icon: <Clock className="text-amber-400" />, bg: 'bg-amber-400/10' },
    { label: 'Críticos', value: cases.filter(c => c.status === CaseStatus.CRITICAL).length, icon: <ShieldAlert className="text-red-400" />, bg: 'bg-red-400/10' },
    { label: 'Concluídos', value: cases.filter(c => c.status === CaseStatus.CLOSED).length, icon: <CheckCircle2 className="text-emerald-400" />, bg: 'bg-emerald-400/10' },
  ];

  const chartData = [
    { name: 'Aberto', value: cases.filter(c => c.status === CaseStatus.OPEN).length, color: '#60a5fa' },
    { name: 'Em Curso', value: cases.filter(c => c.status === CaseStatus.IN_PROGRESS).length, color: '#fbbf24' },
    { name: 'Crítico', value: cases.filter(c => c.status === CaseStatus.CRITICAL).length, color: '#f87171' },
    { name: 'Fechado', value: cases.filter(c => c.status === CaseStatus.CLOSED).length, color: '#34d399' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Distribuição de Casos por Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors group">
              <h4 className="font-medium group-hover:text-blue-400">Verificar Link</h4>
              <p className="text-xs text-slate-400 mt-1">Analise domínios suspeitos em tempo real.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors group">
              <h4 className="font-medium group-hover:text-emerald-400">Extrair Metadados</h4>
              <p className="text-xs text-slate-400 mt-1">Arraste uma imagem para ver dados EXIF.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-red-500 cursor-pointer transition-colors group">
              <h4 className="font-medium group-hover:text-red-400">Apoio a Vítima</h4>
              <p className="text-xs text-slate-400 mt-1">Gere guia de segurança imediato.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Casos Recentes</h3>
          <button className="text-sm text-blue-400 hover:underline">Ver Todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID / Título</th>
                <th className="px-6 py-4 font-medium">Vítima</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{c.id}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{c.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{c.victimName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      c.riskLevel === 'Crítico' ? 'border-red-500 text-red-400 bg-red-500/10' :
                      c.riskLevel === 'Alto' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                      'border-slate-500 text-slate-400 bg-slate-500/10'
                    }`}>
                      {c.incidentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onSelectCase(c.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
