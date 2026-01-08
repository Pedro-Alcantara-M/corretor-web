import React, { useState, useRef, useEffect } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Mic, MicOff, Play, Pause, Trash2 } from "lucide-react";

interface AudioRecorderProps {
  onAudioReady?: (audioBlob: Blob, audioUrl: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  compact?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  isRecording,
  onToggleRecording,
  compact = false,
}) => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady?.(audioBlob, url);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();

      // Start timer
      setCurrentTime(0);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const clearRecording = () => {
    setAudioUrl("");
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardContent className={compact ? "p-2 space-y-2" : "p-4 space-y-4"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size={compact ? "xs" : "sm"}
              onClick={onToggleRecording}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Parar Gravação
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Gravar Áudio
                </>
              )}
            </Button>
            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                {formatTime(currentTime)}
              </div>
            )}
          </div>
          {audioUrl && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size={compact ? "xs" : "sm"}
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size={compact ? "xs" : "sm"}
                onClick={clearRecording}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="space-y-2">
            <audio
              ref={audioRef}
              src={audioUrl}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(Math.floor(audioRef.current.duration));
                }
              }}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setCurrentTime(Math.floor(audioRef.current.currentTime));
                }
              }}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{
                  width:
                    duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {!navigator.mediaDevices && (
          <div className="text-sm text-warning bg-warning/10 p-2 rounded border border-warning/20">
            ⚠️ Gravação de áudio não suportada neste navegador
          </div>
        )}
      </CardContent>
    </Card>
  );
};
