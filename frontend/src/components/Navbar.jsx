import lauLogo from '../assets/LAU_LOGO.jpg';
import Button from './ui/Button';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <div className="flex h-[84px] w-[126px] items-center justify-center">
            <img src={lauLogo} alt="LAU" className="h-full w-full object-contain" />
          </div>
          <div className="flex min-h-[84px] items-center">
            <h1 className="font-display text-[1.85rem] font-semibold leading-none text-[#006D58]">
              Parking System
            </h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
            Campus Overview
          </span>
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
            Parking Operations
          </span>
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
            Live Availability
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-right sm:block">
            <p className="text-sm font-semibold text-neutral-900">{user.fullName}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              {user.role === 'ADMIN' ? 'Admin Access' : 'User Access'}
            </p>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
