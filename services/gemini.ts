
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeForensicImage = async (base64Data: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: `Realize uma análise forense digital nesta imagem. Identifique:
          1. Possíveis sinais de manipulação (edição, clonagem, artefatos de compressão inconsistentes).
          2. Extraia metadados visíveis (texto, placas, locais, horários).
          3. Identifique objetos, cenários e contexto do incidente.
          4. Verifique a veracidade (se parece ser um deepfake ou gerada por IA).
          Responda em português de forma técnica e estruturada.` }
      ]
    }
  });
  return response.text;
};

export const visualOSINT = async (base64Data: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: `Atue como um analista de OSINT. Usando a busca do Google, identifique a origem desta imagem na web. 
          Encontre sites onde ela aparece, contexto original, possíveis perfis associados e se ela foi usada em campanhas de desinformação conhecidas.
          Liste explicitamente os links encontrados.` }
      ]
    },
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const classifyIncident = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classifique o seguinte incidente digital: "${description}". 
    Identifique o tipo (Golpe, Ameaça, Invasão, etc), o nível de risco (Baixo, Médio, Alto, Crítico) e sugira as primeiras ações de resposta. 
    Responda em JSON formatado.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          origin: { type: Type.STRING },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["type", "riskLevel", "actions", "summary"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const performLegalOSINT = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Realize uma pesquisa OSINT (Open Source Intelligence) para o seguinte termo: "${query}". 
    Foque em perfis públicos, menções recentes, reputação de domínios e possíveis vazamentos. 
    Use ferramentas de busca para embasar a resposta.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateCaseReport = async (caseData: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um relatório técnico detalhado de investigação digital baseado nos seguintes dados:
    Vítima: ${caseData.victimName}
    Incidente: ${caseData.incidentType}
    Descrição: ${caseData.description}
    Evidências: ${caseData.evidences.length} arquivos anexados.
    
    O relatório deve conter:
    1. Resumo Executivo
    2. Análise Técnica Detalhada
    3. Linha do Tempo estimada
    4. Conclusões e Recomendações Jurídicas/Policiais.
    Responda em Markdown.`
  });
  return response.text;
};
