import { STATUS_STYLES, getStatusLabel } from '../../utils/parking';

export default function Badge({ status, children }) {
  const style = STATUS_STYLES[status]?.badge || STATUS_STYLES.available.badge;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${style}`}>
      {children || getStatusLabel(status)}
    </span>
  );
}
