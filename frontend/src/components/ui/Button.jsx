export default function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const variants = {
    primary:
      'bg-brand-600 text-white shadow-soft hover:bg-brand-700',
    secondary:
      'border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100',
    ghost:
      'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
  };

  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
