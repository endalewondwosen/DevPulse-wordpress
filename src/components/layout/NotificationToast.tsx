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
          className={`fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-500 text-black border-emerald-400'
              : 'bg-red-500 text-white border-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <Activity className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          <span className="font-bold text-sm">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
