import React, { useState, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Label,
} from "@/components/ui";
import { Upload, Download } from "lucide-react";
import { type HighlightEssayImg } from "@/types/essay";
//import { useToast } from '@/hooks/use-toast';

interface ImageAnnotatorProps {
  essayId?: string;
  readOnly?: boolean;
  initialImage?: string;
  initialAnnotations?: HighlightEssayImg[];
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  essayId,
  readOnly = false,
  initialImage,
  initialAnnotations = [],
}) => {
  // const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>(initialImage || "");
  const [annotations, setAnnotations] =
    useState<HighlightEssayImg[]>(initialAnnotations);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] =
    useState<Partial<HighlightEssayImg> | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(
    null
  );
  const [selectedCompetencia, setSelectedCompetencia] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const competencias = [
    { id: 1, title: "Domínio da modalidade escrita formal" },
    { id: 2, title: "Compreensão da proposta" },
    { id: 3, title: "Informações, fatos e opiniões" },
    { id: 4, title: "Mecanismos linguísticos" },
    { id: 5, title: "Proposta de intervenção" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        /*  toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 10MB",
          variant: "destructive",
        }); */
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        setAnnotations([]); // Clear annotations when new image is uploaded
        /* toast({
          title: "Imagem carregada",
          description: "Imagem da redação carregada com sucesso",
        }); */
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasPosition = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const pos = getCanvasPosition(e);
    setIsDrawing(true);
    setCurrentAnnotation({
      x_position: pos.x,
      y_position: pos.y,
      width: 0,
      height: 0,
      competencia: selectedCompetencia,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return;

    const pos = getCanvasPosition(e);
    setCurrentAnnotation((prev) => ({
      ...prev,
      width: pos.x - prev!.x_position!,
      height: pos.y - prev!.y_position!,
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return;

    setIsDrawing(false);
    if (
      Math.abs(currentAnnotation.width!) > 10 &&
      Math.abs(currentAnnotation.height!) > 10
    ) {
      const annotation: HighlightEssayImg = {
        id: Date.now().toString(),
        x_position: currentAnnotation.x_position!,
        y_position: currentAnnotation.y_position!,
        width: currentAnnotation.width!,
        height: currentAnnotation.height!,
        text: "",
        competencia: currentAnnotation.competencia!,
        createdAt: new Date().toISOString(),
      };
      setAnnotations((prev) => [...prev, annotation]);
      setSelectedAnnotation(annotation.id);
    }
    setCurrentAnnotation(null);
  };

  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw annotations
    annotations.forEach((annotation) => {
      ctx.strokeStyle =
        annotation.id === selectedAnnotation ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(
        annotation.x_position,
        annotation.y_position,
        annotation.width,
        annotation.height
      );

      // Draw competencia badge
      ctx.fillStyle =
        annotation.id === selectedAnnotation ? "#ef4444" : "#3b82f6";
      ctx.fillRect(annotation.x_position, annotation.y_position - 20, 20, 20);
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        annotation.competencia.toString(),
        annotation.x_position + 10,
        annotation.y_position - 8
      );
    });

    // Draw current annotation while drawing
    if (currentAnnotation && isDrawing) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        currentAnnotation.x_position!,
        currentAnnotation.y_position!,
        currentAnnotation.width!,
        currentAnnotation.height!
      );
    }
  }, [annotations, selectedAnnotation, currentAnnotation, isDrawing]);

  React.useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      drawAnnotations();
    }
  };

  const exportAnnotations = () => {
    const data = {
      essayId,
      imageUrl,
      annotations: annotations.map((annotation) => ({
        ...annotation,
        competenciaTitle: competencias.find(
          (c) => c.id === annotation.competencia
        )?.title,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anotacoes-redacao-${essayId || "nova"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload de Imagem */}
      {!imageUrl && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Clique para selecionar a imagem da redação
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={readOnly}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={readOnly}
          >
            Selecionar Imagem
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Formatos suportados: JPG, PNG, WebP (máx. 10MB)
          </p>
        </div>
      )}

      {/* Visualizador de Imagem com Anotações */}
      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
            <h5>Imagem da Redação</h5>

              {!readOnly && (
                <>
                  <Label htmlFor="competencia-select" className="text-sm">
                    Competência:
                  </Label>
                  <select
                    id="competencia-select"
                    value={selectedCompetencia}
                    onChange={(e) =>
                      setSelectedCompetencia(Number(e.target.value))
                    }
                    className="text-sm border rounded px-2 py-1"
                  >
                    {competencias.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.id}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={readOnly}
              >
                Trocar Imagem
              </Button>
              <Button variant="outline" size="sm" onClick={exportAnnotations}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Redação"
              className="hidden"
              onLoad={handleImageLoad}
            />
            <canvas
              ref={canvasRef}
              className="max-w-full border rounded cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />

            {!readOnly && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Como usar:</strong> Clique e arraste para criar uma
                  anotação na imagem. Selecione a competência antes de criar a
                  anotação.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={readOnly}
      />
    </div>
  );
};
