export interface  EssayComment {
  _id?: string;
  essay_id: string;
  teacher_id?: string;
  x_position?: number;
  y_position?: number;
  width?: number;
  height?: number;
  competencia: number;
  audio_url?: string[] | string;
  text?: string;
  created_at?: string;
}

export interface Student {
  name: string;
  email: string;
}

export interface Essay {
   _id: string;
  student: Student;
  comments: EssayComment[];
  title: string;
  content?: string;
  image_url?: string;
  status: string;
  submitted_at?: string;
  corrected_at?: string;
  corrected_by?: string;
  score1?: number;
  score2?: number;
  score3?: number;
  score4?: number;
  score5?: number;
}

export type EssaysResponse = Essay[] | [];
