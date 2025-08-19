import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle,Button, Textarea, Input, Label,  Badge, Separator } from "@/components/ui";
import {AudioRecorder} from "@components";
import { Upload, X, MessageSquare, Mic, Download } from "lucide-react";
//import { useToast } from '@/hooks/use-toast';

interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  comment: string;
  competencia: number;
  audioUrl?: string;
  createdAt: string;
}

interface ImageAnnotatorProps {
  essayId?: string;
  readOnly?: boolean;
  initialImage?: string;
  initialAnnotations?: Annotation[];
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
    useState<Annotation[]>(initialAnnotations);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] =
    useState<Partial<Annotation> | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(
    null
  );
  const [newComment, setNewComment] = useState("");
  const [selectedCompetencia, setSelectedCompetencia] = useState(1);
  const [isRecording, setIsRecording] = useState(false);

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
      x: pos.x,
      y: pos.y,
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
      width: pos.x - prev!.x!,
      height: pos.y - prev!.y!,
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return;

    setIsDrawing(false);
    if (
      Math.abs(currentAnnotation.width!) > 10 &&
      Math.abs(currentAnnotation.height!) > 10
    ) {
      const annotation: Annotation = {
        id: Date.now().toString(),
        x: currentAnnotation.x!,
        y: currentAnnotation.y!,
        width: currentAnnotation.width!,
        height: currentAnnotation.height!,
        comment: "",
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
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
      );

      // Draw competencia badge
      ctx.fillStyle =
        annotation.id === selectedAnnotation ? "#ef4444" : "#3b82f6";
      ctx.fillRect(annotation.x, annotation.y - 20, 20, 20);
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        annotation.competencia.toString(),
        annotation.x + 10,
        annotation.y - 8
      );
    });

    // Draw current annotation while drawing
    if (currentAnnotation && isDrawing) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        currentAnnotation.x!,
        currentAnnotation.y!,
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

  const saveComment = () => {
    if (!selectedAnnotation || !newComment.trim()) return;

    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.id === selectedAnnotation
          ? { ...annotation, comment: newComment }
          : annotation
      )
    );
    setNewComment("");
    setSelectedAnnotation(null);

    /*  toast({
      title: "Comentário adicionado",
      description: "Comentário salvo na anotação",
    }); */
  };

  const handleAudioReady = (audioBlob: Blob, audioUrl: string) => {
    if (!selectedAnnotation) return;

    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.id === selectedAnnotation
          ? { ...annotation, audioUrl }
          : annotation
      )
    );

    /*  toast({
      title: "Áudio gravado",
      description: "Áudio adicionado à anotação",
    }); */
  };

  const deleteAnnotation = (annotationId: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
    if (selectedAnnotation === annotationId) {
      setSelectedAnnotation(null);
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

  const selectedAnnotationData = annotations.find(
    (a) => a.id === selectedAnnotation
  );

  return (
    <div className="space-y-6">
      {/* Upload de Imagem */}
      {!imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importar Imagem da Redação
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Visualizador de Imagem com Anotações */}
      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Imagem da Redação
                  </CardTitle>
                  <div className="flex items-center gap-2">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportAnnotations}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
                        💡 <strong>Como usar:</strong> Clique e arraste para
                        criar uma anotação na imagem. Selecione a competência
                        antes de criar a anotação.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Anotações */}
          <div className="space-y-6">
            {/* Formulário de Comentário */}
            {selectedAnnotation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Editar Anotação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="outline">
                      Competência {selectedAnnotationData?.competencia}
                    </Badge>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comentário</Label>
                    <Textarea
                      id="comment"
                      value={
                        newComment || selectedAnnotationData?.comment || ""
                      }
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewComment(e.target.value)}
                      placeholder="Digite seu comentário sobre este trecho..."
                      rows={3}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <>
                      <Separator />

                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <Mic className="w-4 h-4" />
                          Gravação de Áudio
                        </Label>
                        <AudioRecorder
                          onAudioReady={handleAudioReady}
                          isRecording={isRecording}
                          onToggleRecording={() => setIsRecording(!isRecording)}
                          compact
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={saveComment} className="flex-1">
                          Salvar Comentário
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAnnotation(selectedAnnotation)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lista de Anotações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Anotações ({annotations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {annotations.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    {readOnly
                      ? "Nenhuma anotação nesta imagem"
                      : "Nenhuma anotação ainda. Clique e arraste na imagem para criar uma."}
                  </p>
                ) : (
                  annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnnotation === annotation.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedAnnotation(annotation.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          Competência {annotation.competencia}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(annotation.createdAt).toLocaleString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      {annotation.comment && (
                        <p className="text-sm mb-2">{annotation.comment}</p>
                      )}

                      {annotation.audioUrl && (
                        <audio controls className="w-full h-8">
                          <source src={annotation.audioUrl} type="audio/wav" />
                        </audio>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
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
