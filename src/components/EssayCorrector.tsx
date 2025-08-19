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

interface Comment {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  competencia: number;
  audioUrl?: string;
  severity: "info" | "warning" | "error";
}

interface CompetenciaScore {
  competencia: number;
  title: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
}

interface EssayCorrectorProps {
  className?: string;
  initialEssay?: any;
  readOnly?: boolean;
}

export const EssayCorrector = ({
  /* initialEssay */ readOnly = false,
}: EssayCorrectorProps) => {
  const initialEssay: any = mockEssays[1];
  const [selectedText, setSelectedText] = useState("");
  const [selectedStartIndex, setSelectedStartIndex] = useState(0);
  const [selectedEndIndex, setSelectedEndIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>(
    initialEssay?.comments || []
  );
  const [newComment, setNewComment] = useState("");
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

  const essayText =
    initialEssay?.content ||
    `A importância da educação no combate às desigualdades sociais

A educação sempre foi reconhecida como um pilar fundamental para o desenvolvimento de uma sociedade mais justa e igualitária. No Brasil, país marcado por profundas desigualdades sociais, o acesso à educação de qualidade representa não apenas um direito constitucional, mas também uma ferramenta essencial para a redução das disparidades econômicas e sociais que ainda persistem.

Primeiramente, é importante destacar que a educação funciona como um mecanismo de mobilidade social. Através do conhecimento, indivíduos de classes menos favorecidas podem ascender socioeconomicamente, quebrando ciclos de pobreza que se perpetuam por gerações. Dados do Instituto Brasileiro de Geografia e Estatística (IBGE) demonstram que pessoas com ensino superior completo possuem renda média cinco vezes maior que aquelas com apenas o ensino fundamental.

Além disso, a educação promove a formação de cidadãos mais conscientes e críticos. Quando as pessoas têm acesso a uma educação de qualidade, desenvolvem capacidades analíticas que lhes permitem compreender melhor a realidade social, política e econômica do país. Isso resulta em uma participação mais ativa na vida democrática e na busca por soluções para os problemas sociais.

Entretanto, para que a educação cumpra efetivamente seu papel transformador, é necessário que o Estado implemente políticas públicas eficazes. Isso inclui não apenas a ampliação do acesso às escolas, mas também a melhoria da qualidade do ensino, a valorização dos profissionais da educação e a criação de programas de assistência estudantil que garantam a permanência dos alunos nas instituições de ensino.

Portanto, investir na educação é investir no futuro do país. O governo deve, urgentemente, aumentar os recursos destinados à educação, modernizar a infraestrutura escolar e capacitar os professores. Somente assim será possível construir uma sociedade mais justa, onde as oportunidades sejam distribuídas de forma mais equitativa e onde todos tenham a chance de desenvolver seu potencial pleno.`;

  const competenciaIcons = {
    1: <PenTool className="w-4 h-4 bg-black " />,
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
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        startIndex: selectedStartIndex,
        endIndex: selectedEndIndex,
        competencia: selectedCompetencia,
        severity: "info",
      };

      const highlight = {
        id: Date.now().toString(),
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

  const onAudioReady = (audioBlob: Blob, audioUrl: string) => {
    console.log("Audio ready:", audioUrl);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="corretor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Corretor
            </TabsTrigger>
            <TabsTrigger value="imagem" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Imagem
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Áudio
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
                  </CardHeader>
                  <CardContent>
                    <EssayHighlighter
                      text={essayText}
                      highlights={highlights}
                      onTextSelect={handleTextSelection}
                      onHighlightClick={handleHighlightClick}
                    />
                  </CardContent>
                </Card>
                {/* Painel de Comentários */}
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
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        Nenhum comentário adicionado ainda.
                        <br />
                        Selecione um trecho da redação para começar.
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 bg-accent/50 rounded-lg border"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant={
                                `competencia${comment.competencia}` as any
                              }
                              size="xs"
                              className="w-5 h-5 p-0 rounded-full"
                            >
                              {comment.competencia}
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Competência {comment.competencia}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                          {comment.audioUrl && (
                            <audio controls className="w-full mt-2 h-8">
                              <source
                                src={comment.audioUrl}
                                type="audio/mpeg"
                              />
                            </audio>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="imagem" className="mt-6">
            <ImageAnnotator
              essayId={initialEssay?.id}
              readOnly={readOnly}
              initialImage="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
              initialAnnotations={[
                {
                  id: "1",
                  x: 100,
                  y: 150,
                  width: 200,
                  height: 50,
                  comment: "Boa introdução, mas pode ser mais específica",
                  competencia: 1,
                  createdAt: "2024-01-28T14:00:00Z",
                },
                {
                  id: "2",
                  x: 150,
                  y: 300,
                  width: 250,
                  height: 80,
                  comment: "Desenvolva melhor este argumento com exemplos",
                  competencia: 3,
                  audioUrl: "audio-mock-url",
                  createdAt: "2024-01-28T14:05:00Z",
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Gravação de Comentários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioRecorder
                    onAudioReady={onAudioReady}
                    isRecording={isRecording}
                    onToggleRecording={toggleRecording}
                  />

                  {selectedText && (
                    <div className="mt-4 p-4 bg-primary-light rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary mb-2">
                        Texto selecionado para comentário:
                      </p>
                      <p className="text-sm bg-white p-2 rounded border italic">
                        "{selectedText}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Instruções de Gravação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Como usar:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Selecione um trecho da redação na aba "Corretor"</li>
                      <li>Clique em "Gravar Áudio" para iniciar a gravação</li>
                      <li>Fale suas sugestões de melhoria</li>
                      <li>Clique em "Parar Gravação" para finalizar</li>
                      <li>Ouça a gravação e faça download se necessário</li>
                    </ol>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Dicas para gravação:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Fale de forma clara e pausada</li>
                      <li>Mencione a competência relacionada</li>
                      <li>Seja específico nas sugestões</li>
                      <li>Use um ambiente silencioso</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
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
