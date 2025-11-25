import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/";
import { Badge } from "@/components/ui/";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/";
/* import { useAuth } from "@/contexts/AuthContext"; */
import EssayCorrector from "@pages/Essay/components/EssayCorrector";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { useGetEssay } from "@services/essay/essay.service";
import { ESSAY_STATUS } from "@services/essay/contants";
import { type Student } from "@services/essay/types";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  /* const { user } = useAuth(); */
  const navigate = useNavigate()
  const { data: essays, isLoading: loading } = useGetEssay();
  const students: Student[] = [];
  const studentsLoading = false;
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null);

  const pendingEssays =
    (essays &&
      essays.filter(
        (essay) => essay.status === ESSAY_STATUS.pending || essay.status === ESSAY_STATUS.inReview
      )) ||
    [];
  const correctedEssays =
    (essays && essays.filter((essay) => essay.status === ESSAY_STATUS.corrected)) || [];
  /* const totalScore = correctedEssays.reduce(
    (sum, essay) => sum + (essay.grade || 0),
    0
  ); */
  const averageScore = 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case ESSAY_STATUS.pending:
        return "bg-yellow-500";
      case ESSAY_STATUS.inReview:
        return "bg-blue-500";
      case ESSAY_STATUS.corrected   :
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case ESSAY_STATUS.pending:
        return Clock;
      case ESSAY_STATUS.inReview:
        return BookOpen;
      case ESSAY_STATUS.corrected:
        return CheckCircle;
      default:
        return FileText;
    }
  };

  if (loading || studentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (selectedEssay) {
    const essay = essays && essays.find((e) => e._id === selectedEssay);
    if (essay) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-6">
            <Button
              onClick={() => setSelectedEssay(null)}
              className="mb-4"
              variant="outline"
            >
              ← Voltar ao painel
            </Button>
            <EssayCorrector />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-9xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard {/* {user?.name} */}{/*TODO*/}
          </h1>
          <p className="text-muted-foreground">
            Visão completa do sistema - Todas as funcionalidades e estatísticas
          </p>
        </div>

        {/* Cards de estatísticas expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-educational-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Alunos
                  </p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pendentes
                  </p>
                  <p className="text-2xl font-bold">{pendingEssays.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Corrigidas
                  </p>
                  <p className="text-2xl font-bold">{correctedEssays.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-educational-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Redações
                  </p>
                  <p className="text-2xl font-bold">{essays && essays.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-educational-purple" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Média Geral
                  </p>
                  <p className="text-2xl font-bold">{averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes ({pendingEssays.length})
            </TabsTrigger>
            <TabsTrigger value="corrected">
              Corrigidas ({correctedEssays.length})
            </TabsTrigger>
            <TabsTrigger value="students">
              Alunos ({students.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    Redações Recentes Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingEssays.slice(0, 3).map((essay) => (
                    <div
                      key={essay._id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">{essay.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Por: {essay.student?.name || "Aluno"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate("/essay", {state: {id: essay._id}})}
                      >
                        Corrigir
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-educational-blue" />
                    Alunos Mais Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/*TODO*/}
                 {/*  {students
                    .sort((a, b) => b.totalEssays - a.totalEssays)
                    .slice(0, 3)
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.totalEssays} redações
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Média: {student.averageScore}
                          </p>
                        </div>
                      </div>
                    ))} */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="pending" className="space-y-6">
            <div className="grid gap-6">
              {pendingEssays.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Todas as redações foram corrigidas!
                    </h3>
                    <p className="text-muted-foreground">
                      Não há redações pendentes para correção no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingEssays.map((essay) => {
                  const StatusIcon = getStatusIcon(essay.status);
                  return (
                    <Card
                      key={essay._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">
                              {essay.title}
                            </CardTitle>
                            <CardDescription>
                               Por: {essay.student?.name || "Aluno"}
                              {essay.submitted_at && ` • ${new Date(
                                essay.submitted_at || ""
                              ).toLocaleDateString("pt-BR")}`}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`${getStatusColor(
                              essay.status
                            )} text-white`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {essay.status === ESSAY_STATUS.pending
                              ? "Pendente"
                              : "Em Análise"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {essay.content}
                          </p>
                          <Button
                            onClick={() => setSelectedEssay(essay._id)}
                            className="w-full"
                          >
                            Corrigir Redação
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="corrected" className="space-y-6">
            <div className="grid gap-6">
              {correctedEssays.map((essay) => (
                <Card
                  key={essay._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{essay.title}</CardTitle>
                        <CardDescription>
                           Por: {essay.student?.name || "Aluno"} •{" "}
                          {new Date(
                            essay.submitted_at || ""
                          ).toLocaleDateString("pt-BR")}
                        </CardDescription>  
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Corrigida
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {essay.content}
                      </p>
                          {/*TODO*/}
                      {/* {essay.grade && (
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="font-semibold">
                            Nota:{" "}
                            <span className="text-educational-blue">
                              {essay.grade}/10
                            </span>
                          </div>
                        </div>
                      )} */}

                      <Button
                        onClick={() => setSelectedEssay(essay._id)}
                        variant="outline"
                        className="w-full"
                      >
                        Visualizar Correção
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid gap-6">
              {students.map((student: any) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">
                          Redações: {student.totalEssays}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Média: {student.averageScore}/1000
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Última:{" "}
                          {new Date(student.lastSubmission).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pendentes</span>
                      <Badge className="bg-yellow-500 text-white">
                        {pendingEssays.length} (
                        {essays && essays.length > 0
                          ? Math.round(
                              (pendingEssays.length / essays.length) * 100
                            )
                          : 0}
                        %)
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Corrigidas</span>
                      <Badge className="bg-green-500 text-white">
                        {correctedEssays.length} (
                        {essays && essays.length > 0
                          ? Math.round(
                              (correctedEssays.length / essays.length) * 100
                            )
                          : 0}
                        %)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Média Geral</span>
                      <span className="font-bold">{averageScore}/1000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maior Nota</span>
                      <span className="font-bold text-green-600">
                        {/*TODO*/}
                        {/* {correctedEssays.length > 0
                          ? Math.max(
                              ...correctedEssays.map((e) =>
                                Math.round((e.grade || 0) * 100)
                              )
                            )
                          : 0} */}
                        /1000
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Menor Nota</span>
                      <span className="font-bold text-red-600">
                         {/*TODO*/}
                       {/*  {correctedEssays.length > 0
                          ? Math.min(
                              ...correctedEssays.map((e) =>
                                Math.round((e.grade || 0) * 100)
                              )
                            )
                          : 0} */}
                        /1000
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
