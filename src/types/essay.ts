export interface HighlightEssayText {
  id: string;
  startIndex: number;
  endIndex: number;
  competencia: number;
  text: string;
  audioUrl?: string;
  createdAt?: string;
  comment?: string;
}

export interface HighlightEssayImg {
  id: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  text: string;
  competencia: number;
  audioUrl?: string;
  createdAt?: string;
}

export type Comment = (HighlightEssayText | HighlightEssayImg) & {
  severity?: "info" | "warning" | "error";
};
