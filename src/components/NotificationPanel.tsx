import { Bell, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { listNotifications, markNotificationRead } from '@/lib/api';
import type { Notification } from '@/lib/db-types';
import { useLang } from '@/lib/lang';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { t } = useLang();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // ignore — the UI still reflects the attempt
    }
  }

  function handleMarkAllRead() {
    const unread = notifications.filter((n) => !n.read);
    unread.forEach((n) => handleMarkRead(n.id));
  }

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-forest-950/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-forest-100 p-4">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-forest-600" />
            <span className="text-lg font-extrabold text-forest-800">{t.commonNotifications}</span>
            {unreadCount > 0 && <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-900">{unreadCount}</span>}
          </div>
          <button className="rounded-lg p-2 text-forest-600 hover:bg-forest-50 transition-colors" onClick={onClose} aria-label={t.commonCloseMenu}>
            <X size={22} />
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="w-full border-b border-forest-100 bg-forest-50 py-2 text-sm font-bold text-forest-600 hover:bg-forest-100 transition-colors"
          >
            Mark all as read
          </button>
        )}

        <div className="overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-forest-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <AlertCircle size={28} className="text-error-400" />
              <p className="text-sm font-semibold text-error-600">{error}</p>
              <button onClick={fetchNotifications} className="mt-2 rounded-lg bg-forest-100 px-4 py-2 text-sm font-bold text-forest-700 hover:bg-forest-200 transition-colors">
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Bell size={32} className="text-forest-200" />
              <p className="text-sm font-semibold text-forest-400">No notifications yet</p>
              <p className="text-xs text-forest-300">Scan results and review updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg border p-3 transition-colors ${n.read ? 'border-forest-100 bg-white' : 'border-forest-200 bg-forest-50'}`}
                >
                  <div className="flex items-start gap-2.5">
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold ${n.read ? 'text-forest-700' : 'text-forest-900'}`}>{n.title}</p>
                      {n.body && <p className="mt-0.5 text-xs leading-5 text-forest-500">{n.body}</p>}
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-forest-300">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="shrink-0 rounded-lg p-1.5 text-forest-400 hover:bg-forest-100 hover:text-forest-600 transition-colors"
                        aria-label="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
