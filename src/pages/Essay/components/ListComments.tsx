import { AudioRecorder } from "@components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Textarea,
  Button,
  Label,
  Badge,
  Separator,
} from "@components/ui";
import { MessageSquare, Mic, Trash, X } from "lucide-react";
import { useState, type Dispatch, type FC, type SetStateAction } from "react";
import type { EssayComment } from "@services/essay/types";
import { useAddCommentToEssay } from "@services/essay/essay.service";

interface ListCommentProps {
  readOnly?: boolean;
  comments: EssayComment[];
  setComments: Dispatch<SetStateAction<EssayComment[]>>;
  setSelectedCommentId: Dispatch<SetStateAction<string | undefined>>;
  selectedCommentId?: string;
}

export const ListComments: FC<ListCommentProps> = ({
  readOnly = false,
  comments,
  setComments,
  setSelectedCommentId,
  selectedCommentId
}) => {
  useState<Partial<Comment> | null>(null);
  const { mutate: addCommentToEssay, isPending: isLoading } = useAddCommentToEssay();

  const [newComment, setNewComment] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const saveComment = async () => {
    if (!selectedCommentId || !newComment.trim()) return;
    const currentComment = comments.find(
      (comment) => comment._id === selectedCommentId
    );

    const sendBody = {
      ...currentComment, text: newComment, _id: undefined
    }

    const response = await addCommentToEssay(sendBody);
    console.log("save comment response", response)
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === selectedCommentId
          ? { ...comment, text: newComment }
          : comment
      )
    );
    setNewComment("");
    setSelectedCommentId(undefined);

    /*  toast({
      title: "Comentário adicionado",
      description: "Comentário salvo na anotação",
    }); */
  };
  const handleAudioReady = (_audioBlob: Blob, audioUrl: string) => {
    if (!selectedCommentId) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === selectedCommentId ? { ...comment, audioUrl } : comment
      )
    );

    /*  toast({
      title: "Áudio gravado",
      description: "Áudio adicionado à anotação",
    }); */
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((a) => a._id !== commentId));
    if (selectedCommentId === commentId) {
      setSelectedCommentId(undefined);
    }
  };

  const selectedCommentData = comments.find((a) => a._id === selectedCommentId);

  return (
    <div className="space-y-6">
      {/* Painel de Anotações */}
      {/* Formulário de Comentário */}
      {selectedCommentId && (
        <Card>
          <CardHeader className="flex-row">
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Editar Anotação
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCommentId(undefined)}
              >
                <X className="w-4 h-4 text-black me-auto" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="outline">
                Competência {selectedCommentData?.competencia}
              </Badge>
            </div>

            <div>
              <Label htmlFor="comment">Comentário</Label>
              <Textarea
                id="comment"
                value={newComment || selectedCommentData?.text || ""}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setNewComment(e.target.value)}
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
                  <Button loading={isLoading} onClick={saveComment} className="flex-1">
                    Salvar Comentário
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteComment(selectedCommentId)}
                  >
                    <Trash className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Anotações */}
      {comments.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-4">
          {readOnly
            ? "Nenhuma anotação nesta imagem"
            : "Nenhuma anotação ainda. Clique e arraste na imagem para criar uma."}
        </p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedCommentId === comment._id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => {
              setSelectedCommentId(comment._id)
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Competência {comment.competencia}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(comment?.created_at || new Date()).toLocaleString(
                  "pt-BR"
                )}
              </span>
            </div>
            {comment.text && <p className="text-sm mb-2">{comment.text}</p>}

            {comment.audio_url && comment.audio_url[0] && (
              <audio controls className="w-full h-8">
                <source src={comment.audio_url as string} type="audio/wav" />
              </audio>
            )}
          </div>
        ))
      )}
    </div>
  );
};
