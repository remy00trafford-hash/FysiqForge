import React, { useEffect, useState, useCallback } from "react";
import { Bell, X, RotateCcw, CheckCircle2 } from "lucide-react";

interface NotificationRecord {
  id: string;
  email: string;
  workoutId: string | null;
  type: "due" | "missed" | "recovery" | "weekly_summary";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  resolved: boolean;
}

interface NotificationCenterProps {
  userEmail: string;
  onMarkWorkoutDone: (workoutId: string) => void;
  onRescheduleWorkout: (workoutId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userEmail,
  onMarkWorkoutDone,
  onRescheduleWorkout
}) => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/reminders/notifications?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      console.warn("Impossible de charger les notifications:", e);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const activeNotifications = notifications.filter((n) => !n.resolved);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (notificationId: string) => {
    try {
      await fetch("/api/reminders/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, notificationId })
      });
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
    } catch (e) {
      // silencieux
    }
  };

  const iconForType = (type: NotificationRecord["type"]) => {
    if (type === "due") return "🔥";
    if (type === "missed") return "⏰";
    if (type === "recovery") return "💪";
    return "📊";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 p-2 rounded-xl transition-all cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF5500] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-y-auto bg-[#16161E] border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-sm font-bold text-white">Notifications</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">Aucune notification pour l'instant.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`p-4 ${!n.read ? "bg-[#FF5500]/5" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg shrink-0">{iconForType(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                      <p className="text-[11px] text-gray-400 leading-snug">{n.message}</p>

                      {!n.resolved && n.workoutId && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkWorkoutDone(n.workoutId as string);
                            }}
                            className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Fait
                          </button>
                          {n.type === "missed" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRescheduleWorkout(n.workoutId as string);
                              }}
                              className="flex items-center gap-1 bg-white/10 text-gray-200 border border-white/15 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/15 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> Reprogrammer
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
