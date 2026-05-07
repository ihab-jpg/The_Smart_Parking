import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import beirutFountain from '../assets/beirutFountain.jpg';
import lauLogo from '../assets/LAU_LOGO.jpg';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
  licensePlate: '',
  nearEntrance: false,
  accessibleParking: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-6 rounded-[28px] border border-neutral-200 bg-white px-6 py-5 shadow-soft lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-[96px] w-[170px] items-center justify-center">
              <img src={lauLogo} alt="LAU" className="h-full w-full object-contain" />
            </div>
            <div className="flex min-h-[96px] items-center">
              <h1 className="font-display text-[3.15rem] font-semibold leading-none text-[#006D58]">
                Parking System
              </h1>
            </div>
          </div>
          <div className="flex max-w-xl items-center justify-center text-center">
            <p className="font-display text-lg font-semibold italic leading-snug text-[#006D58] lg:text-[1.5rem]">
              "Innovating, Empowering, Ever-Giving"
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section
            className="campus-image relative min-h-[520px] overflow-hidden rounded-[32px] border border-neutral-200 p-8 shadow-lift"
            style={{ backgroundImage: `url(${beirutFountain})` }}
          >
            <div className="absolute inset-0 bg-white/58" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/90 via-[#fffaf2]/76 to-white/52" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f7efe2]/42 to-transparent" />
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#006D58]">
                New account
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-[#6f4b2d]">
                Join the campus parking portal.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#7e5a3c]">
                Create one account for reservations, profile preferences, and future accessibility
                verification features.
              </p>
            </div>
          </section>

          <section className="surface-card rounded-[32px] p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
                  Account setup
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900">
                  Register
                </h2>
              </div>
              <Link
                to="/"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Back to login
              </Link>
            </div>

            <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Username
                </span>
                <input
                  value={form.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  LAU email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Full name
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Phone number
                </span>
                <input
                  value={form.phoneNumber}
                  onChange={(event) => updateField('phoneNumber', event.target.value)}
                  placeholder="+96170123456"
                  pattern="^\+?[0-9]{10,15}$"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
                <span className="mt-2 block text-xs text-neutral-500">
                  Optional, 10-15 digits.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  License plate
                </span>
                <input
                  value={form.licensePlate}
                  onChange={(event) =>
                    updateField('licensePlate', event.target.value.toUpperCase())
                  }
                  placeholder="ABC123"
                  pattern="[A-Z0-9]{2,8}"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
                <span className="mt-2 block text-xs text-neutral-500">
                  2-8 uppercase letters or numbers, no spaces.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
                <span className="mt-2 block text-xs text-neutral-500">
                  At least 8 characters with uppercase, lowercase, number, and special character.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Confirm password
                </span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>

              <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.nearEntrance}
                    onChange={(event) => updateField('nearEntrance', event.target.checked)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  Prefer spots near entrances
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.accessibleParking}
                    onChange={(event) => updateField('accessibleParking', event.target.checked)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  Interested in accessible parking
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="py-3 md:col-span-2" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
