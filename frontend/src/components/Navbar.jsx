<<<<<<< HEAD
import lauLogo from '../assets/LAU_LOGO.jpg';
=======
import lauLogo from '../assets/lau-logo.svg';
>>>>>>> dd17e67 (Update frontend parking system UI)
import Button from './ui/Button';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
        <div className="flex items-center gap-5">
          <div className="flex h-[84px] w-[126px] items-center justify-center">
            <img src={lauLogo} alt="LAU" className="h-full w-full object-contain" />
          </div>
          <div className="flex min-h-[84px] items-center">
            <h1 className="font-display text-[1.85rem] font-semibold leading-none text-[#006D58]">
=======
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-soft">
            <img src={lauLogo} alt="LAU" className="h-12 w-auto" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              Lebanese American University
            </p>
            <h1 className="font-display text-2xl font-semibold text-neutral-900">
>>>>>>> dd17e67 (Update frontend parking system UI)
              Parking System
            </h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
<<<<<<< HEAD
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
            Campus Overview
          </span>
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
            Parking Operations
          </span>
          <span className="rounded-full bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-500">
=======
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            Campus Overview
          </span>
          <span className="rounded-full px-4 py-2 text-sm text-neutral-500">
            Parking Operations
          </span>
          <span className="rounded-full px-4 py-2 text-sm text-neutral-500">
>>>>>>> dd17e67 (Update frontend parking system UI)
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
