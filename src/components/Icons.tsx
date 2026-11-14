// Small line icons, drawn to match VS Code's codicons.
type P = { className?: string };
const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const FilesIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v12" /><path d="M9 7h6l4 4v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /><path d="M15 7v4h4" /></svg>
);
export const BookIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /><path d="M8 7h7" /></svg>
);
export const MapIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></svg>
);
export const PlayIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
);
export const StopIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg>
);
export const RefreshIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></svg>
);
export const ExternalIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const CircleIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><circle cx="12" cy="12" r="7" /></svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" /></svg>
);
export const FileIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v5h5" /></svg>
);
export const ArrowIcon = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
