import React, { useEffect, useState, useCallback } from "react";
import { Bell, X, RotateCcw, CheckCircle2 } from "lucide-react";

interface NotificationRecord {
  id: string; email: string; workoutId: string | null;
  type: "due" | "missed" | "recovery" | "weekly_summary";
  title: string; message: string; createdAt: string; read: boolean; resolved: boolean;
}
interface NotificationCenterProps {
  userEmail: string;
  onMarkWorkoutDone: (workoutId: string) => void;
  onRescheduleWorkout: (workoutId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ userEmail, onMarkWorkoutDone, onRescheduleWorkout }) => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const requestBrowserPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch { /* browser may block prompts */ }
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/reminders/notifications?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      const next = data.notifications || [];
      setNotifications(next);

      const lastSeenKey = `fysiqforge_last_browser_notification_${userEmail}`;
      const lastSeen = localStorage.getItem(lastSeenKey);
      const newest = next.find((n: NotificationRecord) => !n.read && !n.resolved);
      if (newest && newest.id !== lastSeen && "Notification" in window && Notification.permission === "granted") {
        new Notification(newest.title, { body: newest.message, icon: "/favicon.ico", tag: newest.id });
        localStorage.setItem(lastSeenKey, newest.id);
      }
    } catch (e) {
      console.warn("Impossible de charger les notifications:", e);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;
    requestBrowserPermission();
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 30000);
    return () => window.clearInterval(interval);
  }, [userEmail, requestBrowserPermission, fetchNotifications]);

  const handleMarkRead = async (notificationId: string) => {
    try {
      await fetch("/api/reminders/mark-read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail, notificationId }) });
      setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const iconForType = (type: NotificationRecord["type"]) => ({ due: "🔥", missed: "⏰", recovery: "💪", weekly_summary: "📊" }[type]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen((v) => !v)} className="relative bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 p-2 rounded-xl" title="Notifications">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FF5500] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>
      {isOpen && <div className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-y-auto bg-[#16161E] border border-white/10 rounded-2xl shadow-2xl z-[100]">
        <div className="flex items-center justify-between p-4 border-b border-white/10"><span className="text-sm font-bold text-white">Notifications</span><button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button></div>
        {notifications.length === 0 ? <div className="p-6 text-center text-xs text-gray-500">Aucune notification pour l'instant.</div> : <div className="divide-y divide-white/5">{notifications.slice(0, 20).map((n) => <div key={n.id} onClick={() => !n.read && handleMarkRead(n.id)} className={`p-4 ${!n.read ? "bg-[#FF5500]/5" : ""}`}><div className="flex items-start gap-2.5"><span className="text-lg">{iconForType(n.type)}</span><div className="flex-1"><p className="text-xs font-bold text-white">{n.title}</p><p className="text-[11px] text-gray-400">{n.message}</p>{!n.resolved && n.workoutId && <div className="flex gap-2 mt-2"><button onClick={(e) => { e.stopPropagation(); onMarkWorkoutDone(n.workoutId!); }} className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"><CheckCircle2 className="w-3 h-3"/>Fait</button>{n.type === "missed" && <button onClick={(e) => { e.stopPropagation(); onRescheduleWorkout(n.workoutId!); }} className="flex items-center gap-1 bg-white/10 text-gray-200 border border-white/15 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"><RotateCcw className="w-3 h-3"/>Reprogrammer</button>}</div>}</div></div></div>)}</div>}
      </div>}
    </div>
  );
};
