import { motion, AnimatePresence } from 'motion/react';
import { Activity, Lock } from 'lucide-react';

interface NotificationToastProps {
  notification: { message: string; type: 'success' | 'error' } | null;
}

export function NotificationToast({ notification }: NotificationToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={`fixed bottom-24 left-1/2 z-[200] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl sm:px-6 md:bottom-8 ${
            notification.type === 'success'
              ? 'border-emerald-400 bg-emerald-500 text-black'
              : 'border-red-400 bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <Activity className="h-4 w-4 shrink-0" />
          ) : (
            <Lock className="h-4 w-4 shrink-0" />
          )}
          <span className="break-words text-sm font-bold">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
