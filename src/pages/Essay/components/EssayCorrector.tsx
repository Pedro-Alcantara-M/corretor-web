/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Textarea,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { EssayHighlighter, AudioRecorder, ImageAnnotator } from "@components";
//import PerformanceCharts from './PerformanceCharts';
import {
  FileText,
  MessageSquare,
  Mic,
  Send,
  Star,
  BookOpen,
  PenTool,
  Users,
  Lightbulb,
  Target,
  BarChart3,
  Save,
  Download,
} from "lucide-react";
import { mockEssays } from "@data/mockData";
import { ListComments } from "./ListComments";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetByIdEssay } from "@services/essay/essay.service";
import type { EssayComment } from "@services/essay/types";
import { ArrowLeftCircleIcon } from "lucide-react";

interface CompetenciaScore {
  competencia: number;
  title: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
}

interface EssayCorrectorProps {
  readOnly?: boolean;
}

const mockedComments = [
  {
    id: "1",
    x_position: 100,
    y_position: 150,
    width: 200,
    height: 50,
    text: "Boa introdução, mas pode ser mais específica",
    competencia: 1,
    createdAt: "2024-01-28T14:00:00Z",
  },
  {
    id: "2",
    x_position: 150,
    y_position: 300,
    width: 250,
    height: 80,
    text: "Desenvolva melhor este argumento com exemplos",
    competencia: 3,
    audioUrl: "audio-mock-url",
    createdAt: "2024-01-28T14:05:00Z",
  },
];

export const EssayCorrector = ({ readOnly = false }: EssayCorrectorProps) => {
  const initialEssay: any = mockEssays[0];
  const navigate = useNavigate();
  const location = useLocation();
  const essayId = location.state.id;
  const { data: currentEssay } = useGetByIdEssay(essayId);
  const [selectedText, setSelectedText] = useState("");
  const [selectedStartIndex, setSelectedStartIndex] = useState(0);
  const [selectedEndIndex, setSelectedEndIndex] = useState(0);
  const [comments, setComments] = useState<EssayComment[]>(
    currentEssay?.comments || mockedComments as EssayComment
  );
  const [newComment, setNewComment] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedCompetencia, setSelectedCompetencia] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [scores, setScores] = useState<CompetenciaScore[]>([
    {
      competencia: 1,
      title: "Domínio da modalidade escrita formal",
      score: initialEssay?.scores?.competencia1 || 0,
      maxScore: 200,
      description:
        "Demonstrar domínio da modalidade escrita formal da língua portuguesa",
      color: "competencia1",
    },
    {
      competencia: 2,
      title: "Compreensão da proposta e aplicação de conceitos",
      score: initialEssay?.scores?.competencia2 || 0,
      maxScore: 200,
      description:
        "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento",
      color: "competencia2",
    },
    {
      competencia: 3,
      title: "Informações, fatos e opiniões",
      score: initialEssay?.scores?.competencia3 || 0,
      maxScore: 200,
      description:
        "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos",
      color: "competencia3",
    },
    {
      competencia: 4,
      title: "Mecanismos linguísticos",
      score: initialEssay?.scores?.competencia4 || 0,
      maxScore: 200,
      description:
        "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação",
      color: "competencia4",
    },
    {
      competencia: 5,
      title: "Proposta de intervenção",
      score: initialEssay?.scores?.competencia5 || 0,
      maxScore: 200,
      description:
        "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos",
      color: "competencia5",
    },
  ]);

  const competenciaIcons = {
    1: <PenTool className="w-4 h-4 bg-black" />,
    2: <BookOpen className="w-4 h-4" />,
    3: <Lightbulb className="w-4 h-4" />,
    4: <Users className="w-4 h-4" />,
    5: <Target className="w-4 h-4" />,
  };

  const handleTextSelection = (
    selectedText: string,
    startIndex: number,
    endIndex: number
  ) => {
    setSelectedText(selectedText);
    setSelectedStartIndex(startIndex);
    setSelectedEndIndex(endIndex);
  };

  const addComment = () => {
    if (newComment.trim() && selectedText) {
      const comment: EssayComment = {
        text: newComment,
        x_position: selectedStartIndex,
        y_position: selectedEndIndex,
        competencia: selectedCompetencia,
        audio_url: audioUrl || undefined,
        essay_id: essayId,
        teacher_id: "",
      };

      const highlight = {
        startIndex: selectedStartIndex,
        endIndex: selectedEndIndex,
        competencia: selectedCompetencia,
        text: selectedText,
        comment: newComment,
      };

      setComments([...comments, comment]);
      setHighlights([...highlights, highlight]);
      setNewComment("");
      setSelectedText("");
    }
  };

  const handleHighlightClick = (highlight: any) => {
    // Focar no comentário relacionado ao highlight
    console.log("Highlight clicked:", highlight);
  };

  const onAudioReady = (_audioBlob: Blob, audioUrl: string) => {
    setAudioUrl(audioUrl);

    /*  toast({
      title: "Áudio gravado",
      description: "Áudio adicionado à anotação",
    }); */
    console.log("Audio ready:", audioUrl);
  };

  /*  const toggleRecording = () => {
    setIsRecording(!isRecording);
  }; */

  const updateScore = (competencia: number, newScore: number) => {
    setScores(
      scores.map((score) =>
        score.competencia === competencia
          ? { ...score, score: Math.max(0, Math.min(newScore, score.maxScore)) }
          : score
      )
    );
  };

  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);

  /*   const performanceData = scores.map(score => ({
    competencia: score.competencia.toString(),
    score: score.score,
    maxScore: score.maxScore,
    percentage: (score.score / score.maxScore) * 100,
    fullMark: score.maxScore
  })); */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 bg-[linear-gradient(135deg,#3082ed_0%,#16a149_100%)] text-white shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Button variant="link" onClick={() => navigate(-1)}>
                <ArrowLeftCircleIcon
                  size={30}
                  className="text-white text-3xl"
                />
              </Button>
              <FileText className="w-8 h-8" />
              Plataforma de Correção ENEM
              <Badge
                variant="secondary"
                className="ml-auto bg-white/20 text-white border-white/30"
              >
                Redação #001
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="corretor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="corretor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Corretor
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="corretor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Painel de Redação */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Redação do Estudante
                    </CardTitle>
                    <div className="pt-4">
                      <p>
                        <strong>Nome:</strong> {currentEssay?.student.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {currentEssay?.student.email}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentEssay?.image_url ? (
                      <ImageAnnotator
                        setSelectedCompetencia={setSelectedCompetencia}
                        selectedCompetencia={selectedCompetencia}
                        essayId={currentEssay?._id}
                        readOnly={readOnly}
                        initialImage={currentEssay.image_url}
                        initialAnnotations={mockedComments}
                      />
                    ) : (
                      <EssayHighlighter
                        text={currentEssay?.content ?? ""}
                        selectedText={selectedText}
                        highlights={highlights}
                        onTextSelect={handleTextSelection}
                        onHighlightClick={handleHighlightClick}
                      />
                    )}
                  </CardContent>
                </Card>
                {/* Painel de Adicionar Comentários */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Adicionar Comentário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Competência</Label>
                        <select
                          value={selectedCompetencia}
                          onChange={(e) =>
                            setSelectedCompetencia(Number(e.target.value))
                          }
                          className="w-full mt-1 p-2 border rounded-md bg-background"
                        >
                          {scores.map((score) => (
                            <option
                              key={score.competencia}
                              value={score.competencia}
                            >
                              {score.competencia}. {score.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Comentário</Label>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Digite sua sugestão de melhoria..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Mic className="w-4 h-4" />
                        Gravação de Áudio
                      </Label>
                      <AudioRecorder
                        onAudioReady={onAudioReady}
                        isRecording={isRecording}
                        onToggleRecording={() => setIsRecording(!isRecording)}
                        compact
                      />
                    </div>
                    <Button
                      onClick={addComment}
                      disabled={!newComment.trim() || !selectedText || readOnly}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {readOnly ? "Modo Visualização" : "Adicionar Comentário"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Painel Lateral - Avaliação */}
              <div className="space-y-6">
                {/* Pontuação por Competência */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Avaliação por Competência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scores.map((score) => (
                      <div key={score.competencia} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"competencia2" as any}
                            size="xs"
                            className="w-6 h-6 p-0 rounded-full"
                          >
                            {
                              competenciaIcons[
                                score.competencia as keyof typeof competenciaIcons
                              ]
                            }
                          </Button>
                          <span className="text-sm font-medium">
                            Comp. {score.competencia}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max={score.maxScore}
                            value={score.score}
                            onChange={(e) =>
                              updateScore(
                                score.competencia,
                                Number(e.target.value)
                              )
                            }
                            className="w-20 h-8 text-center"
                            disabled={readOnly}
                          />
                          <span className="text-sm text-muted-foreground">
                            / {score.maxScore}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {score.description}
                        </p>
                        <Separator />
                      </div>
                    ))}

                    <div className="bg-primary-light p-3 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm font-medium text-primary">
                          Nota Final
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {totalScore} / 1000
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Lista de Comentários */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comentários ({comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Comentários */}
                    <ListComments
                      readOnly={readOnly}
                      comments={comments}
                      setComments={setComments}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/*  <TabsContent value="analytics" className="mt-6">
            <PerformanceCharts 
              competenciaScores={performanceData}
              totalScore={totalScore}
              maxTotalScore={1000}
            />
          </TabsContent> */}
        </Tabs>

        {/* Botões de Ação */}
        <Card className="border-0 bg-gradient-to-r from-secondary/10 to-primary/10 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <Badge
                    variant="secondary"
                    className="bg-success text-success-foreground"
                  >
                    Correção em andamento
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {comments.length} comentários • {highlights.length} marcações
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button variant="success" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Finalizar Correção
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EssayCorrector;
