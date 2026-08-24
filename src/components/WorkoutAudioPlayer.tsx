import React from "react";
import { ExternalLink, Music2, Play } from "lucide-react";
import { MusicPlaylist } from "../types";

interface WorkoutAudioPlayerProps { playlist?: MusicPlaylist; }

export const WorkoutAudioPlayer: React.FC<WorkoutAudioPlayerProps> = ({ playlist }) => {
  const tierId = typeof window !== "undefined" ? localStorage.getItem("fysiqforge_plan_tier") : null;
  const hasMusicEntitlement = tierId === "performance" || tierId === "elite";
  if (!hasMusicEntitlement) return null;

  const tracks = playlist?.tracks || [];
  if (tracks.length === 0) return null;
  const track = tracks[0];
  const videoId = track.youtubeVideoId || playlist?.youtubeVideoId;
  if (!videoId) return null;

  return (
    <div className="bg-gradient-to-r from-[#1A1A24] to-[#121218] border border-[#FF5500]/40 rounded-2xl p-4 sm:p-5 text-white shadow-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 flex items-center justify-center">
            {playlist?.coverUrl ? <img src={playlist.coverUrl} alt={playlist.title || "Playlist"} className="w-full h-full object-cover" /> : <Music2 className="w-5 h-5 text-[#FF5500]" />}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-[#FF5500] uppercase tracking-wider">Musique de séance</p>
            <p className="font-extrabold text-sm truncate">{track.title || playlist?.title || "Workout Mix"}</p>
            <p className="text-xs text-gray-400">{playlist?.genre || "Workout"} · {track.bpm || 130} BPM</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="bg-[#FF5500] hover:bg-[#FF6611] text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"><Play className="w-3.5 h-3.5 fill-current" />Écouter la playlist</a>
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white" title="Ouvrir sur YouTube"><ExternalLink className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  );
};
