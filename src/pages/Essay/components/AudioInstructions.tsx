import { Card, CardContent, CardHeader, CardTitle } from "@components/ui";
import { Separator } from "@radix-ui/react-separator";
import { MessageSquare } from "lucide-react";

export const AudioInstructions = () => {
  return (
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
  );
};
