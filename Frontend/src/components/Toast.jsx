import { useEffect, useState } from 'react';

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

let toastId = 0;
let addToastFn = null;

export const toast = {
  success: (msg) => addToastFn?.({ id: ++toastId, type: 'success', msg }),
  error:   (msg) => addToastFn?.({ id: ++toastId, type: 'error',   msg }),
};

const ToastItem = ({ type, msg, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onRemove, 350);
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-sm ${bg} ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <span className="flex-shrink-0">{ICONS[type]}</span>
      <p className="text-sm font-medium leading-snug">{msg}</p>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (t) => setToasts((prev) => [...prev, t]);
    return () => { addToastFn = null; };
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} type={t.type} msg={t.msg} onRemove={() => remove(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
