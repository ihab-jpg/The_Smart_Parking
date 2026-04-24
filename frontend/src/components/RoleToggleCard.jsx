import Button from './ui/Button';

export default function RoleToggleCard({ onQuickLogin }) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-sm text-neutral-600">
        Quick preview for presentation mode. Choose the interface you want to demonstrate.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button onClick={() => onQuickLogin('USER')} className="w-full">
          Continue as User
        </Button>
        <Button
          onClick={() => onQuickLogin('ADMIN')}
          variant="secondary"
          className="w-full"
        >
          Continue as Admin
        </Button>
      </div>
    </div>
  );
}
