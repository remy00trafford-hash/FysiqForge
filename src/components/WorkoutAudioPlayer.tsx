import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX, ExternalLink, Zap, Tv } from "lucide-react";
import { MusicPlaylist } from "../types";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface WorkoutAudioPlayerProps {
  playlist: MusicPlaylist;
}

export const WorkoutAudioPlayer: React.FC<WorkoutAudioPlayerProps> = ({ playlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const playerRef = useRef<any>(null);
  const containerIdRef = useRef<string>(`yt-player-${Math.random().toString(36).substring(2, 9)}`);

  const tracks = playlist?.tracks || [];
  const track = tracks[currentTrackIdx] || tracks[0] || {
    title: playlist?.title || "Gym Workout Mix",
    bpm: 130,
    duration: "45:00",
    youtubeVideoId: playlist?.youtubeVideoId || "YnF1nE9FOcs"
  };

  const currentVideoId = track.youtubeVideoId || playlist?.youtubeVideoId || "YnF1nE9FOcs";

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);

  // Initialize YouTube player when YT is ready
  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player) return;
    if (playerRef.current) return;

    try {
      playerRef.current = new window.YT.Player(containerIdRef.current, {
        height: "100%",
        width: "100%",
        videoId: currentVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            if (isMuted) {
              event.target.mute();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
              if (event.data === 0 && tracks.length > 1) {
                // Next track when ended
                setCurrentTrackIdx((prev) => (prev + 1) % tracks.length);
              }
            }
          },
          onError: () => {
            // Une vidéo qui ne peut pas être lue (embed désactivé, retirée, région bloquée...)
            // ne doit jamais couper la musique silencieusement : on passe automatiquement
            // à la piste suivante pour garder une écoute continue.
            if (tracks.length > 1) {
              setCurrentTrackIdx((prev) => (prev + 1) % tracks.length);
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
    } catch (e) {
      console.error("YouTube Player Initialization Error:", e);
    }
  }, [currentVideoId, isMuted, tracks.length]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [initPlayer]);

  // Handle track video ID changes — ignore le tout premier montage (déjà géré par initPlayer
  // avec la bonne vidéo dès la création), pour éviter un double-chargement qui peut couper le son.
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById(currentVideoId);
      // On relance toujours la lecture après un changement de piste — l'intention de
      // l'utilisateur en changeant de musique est de continuer à écouter, pas de mettre en pause.
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [currentVideoId]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== "function") {
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    if (!tracks.length) return;
    setCurrentTrackIdx((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (playerRef.current) {
        if (nextMuted && typeof playerRef.current.mute === "function") {
          playerRef.current.mute();
        } else if (!nextMuted && typeof playerRef.current.unMute === "function") {
          playerRef.current.unMute();
        }
      }
      return nextMuted;
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#1A1A24] to-[#121218] border border-[#FF5500]/40 rounded-2xl p-4 sm:p-5 text-white space-y-3 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5500]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Embedded YouTube IFrame Player Container (Mini/Hidden or Expanded) */}
      <div className={`overflow-hidden transition-all duration-300 rounded-xl ${showVideoModal ? "h-64 sm:h-80 mb-3 border border-white/20" : "h-1 w-1 opacity-0 pointer-events-none absolute"}`}>
        <div id={containerIdRef.current} className="w-full h-full" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        {/* Cover & Track Info */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15 shadow-md bg-black">
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? "scale-110" : "scale-100 opacity-90"
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-[#FF5500] animate-bounce h-full rounded-full" />
                  <span
                    className="w-1 bg-[#FF5500] animate-bounce h-3 rounded-full"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1 bg-[#FF5500] animate-bounce h-5 rounded-full"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#FF5500] uppercase tracking-wider">
              <Zap className="w-3 h-3 text-[#FF5500] fill-current" />
              <span>YouTube Gym Workout Mix (30-60 min)</span>
            </div>
            <h4 className="font-extrabold text-sm text-white truncate max-w-[200px] sm:max-w-[260px]">
              {track.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
              <span>{playlist.genre || playlist.title}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px]">
                ⚡ {track.bpm} BPM
              </span>
            </div>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Video Player Display Toggle */}
          <button
            onClick={() => setShowVideoModal((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              showVideoModal
                ? "bg-[#FF5500] text-white border-[#FF5500]"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
            }`}
            title="Afficher/Masquer le lecteur vidéo YouTube"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">{showVideoModal ? "Masquer vidéo" : "Voir vidéo"}</span>
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gray-300" />}
          </button>

          {/* Play/Pause Main Control */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FF3E00] hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-[#FF5500]/40 transition-all cursor-pointer shrink-0"
            title={isPlaying ? "Mettre en pause" : "Lancer le mix YouTube"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current text-white" />
            ) : (
              <Play className="w-5 h-5 fill-current text-white ml-0.5" />
            )}
          </button>

          {/* Skip Next Track / Mix */}
          <button
            onClick={nextTrack}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Mix suivant"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Direct YouTube Link */}
          <a
            href={`https://www.youtube.com/watch?v=${currentVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:text-white flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-2.5 py-2 rounded-xl hover:bg-red-500/20 transition-all shrink-0 font-bold"
            title="Ouvrir sur YouTube"
          >
            <span>YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-red-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
