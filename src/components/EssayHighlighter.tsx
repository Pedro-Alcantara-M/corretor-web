import React, { useState, useRef } from 'react';
import { Badge } from '@components/ui/Badge';

interface Highlight {
  id: string;
  startIndex: number;
  endIndex: number;
  competencia: number;
  text: string;
  comment: string;
}

interface EssayHighlighterProps {
  text: string;
  highlights: Highlight[];
  onTextSelect: (selectedText: string, startIndex: number, endIndex: number) => void;
  onHighlightClick: (highlight: Highlight) => void;
}

export const EssayHighlighter: React.FC<EssayHighlighterProps> = ({
  text,
  highlights,
  onTextSelect,
  onHighlightClick
}) => {
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const competenciaColors = {
    1: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    2: 'bg-green-100 border-green-300 hover:bg-green-200', 
    3: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    4: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
    5: 'bg-red-100 border-red-300 hover:bg-red-200'
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) return;

   // const range = selection.getRangeAt(0);
   // const containerText = containerRef.current.textContent || '';
    
    // Calcular índices relativos ao texto completo
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = containerRef.current.innerHTML;
    const fullText = tempDiv.textContent || '';
    
    const selectedText = selection.toString();
    const startIndex = fullText.indexOf(selectedText);
    const endIndex = startIndex + selectedText.length;

    if (startIndex !== -1) {
      setSelectedRange({ start: startIndex, end: endIndex });
      onTextSelect(selectedText, startIndex, endIndex);
    }
  };

  const renderTextWithHighlights = () => {
    if (highlights.length === 0) {
      return text;
    }

    // Ordenar highlights por posição
    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);
    
    let lastIndex = 0;
    const elements = [];

    sortedHighlights.forEach((highlight, index) => {
      // Adicionar texto antes do highlight
      if (highlight.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.startIndex)}
          </span>
        );
      }

      // Adicionar highlight
      elements.push(
        <span
          key={highlight.id}
          className={`cursor-pointer border-b-2 transition-colors duration-200 ${
            competenciaColors[highlight.competencia as keyof typeof competenciaColors]
          }`}
          onClick={() => onHighlightClick(highlight)}
          title={`Competência ${highlight.competencia}: ${highlight.comment}`}
        >
          {text.slice(highlight.startIndex, highlight.endIndex)}
        </span>
      );

      lastIndex = highlight.endIndex;
    });

    // Adicionar texto final
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-final">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Legenda das competências */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium text-muted-foreground mr-2">Legenda:</span>
        {Object.entries(competenciaColors).map(([comp, colorClass]) => (
          <Badge
            key={comp}
            variant="outline"
            className={`text-xs ${colorClass.replace('hover:bg-', 'bg-').replace('bg-', 'bg-')}`}
          >
            Comp. {comp}
          </Badge>
        ))}
      </div>

      {/* Texto da redação com highlights */}
      <div
        ref={containerRef}
        className="p-6 bg-white rounded-lg border min-h-96 leading-relaxed text-sm whitespace-pre-wrap cursor-text select-text"
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'text' }}
      >
        {renderTextWithHighlights()}
      </div>

       {/* Informação sobre seleção */}
      {selectedRange && (
        <div className="p-3 bg-primary-light rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium">
            ✓ Texto selecionado (posição {selectedRange.start}-{selectedRange.end})
          </p>
          <p className="text-xs text-primary/70 mt-1">
            Adicione um comentário no painel lateral para marcar este trecho.
          </p>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(competenciaColors).map(([comp, colorClass]) => {
          const count = highlights.filter(h => h.competencia === Number(comp)).length;
          return (
            <div
              key={comp}
              className={`p-2 rounded border text-center ${colorClass}`}
            >
              <div className="text-lg font-bold">{count}</div>
              <div className="text-xs">Comp. {comp}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
