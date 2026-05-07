import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import beirutFountain from '../assets/beirutFountain.jpg';
import fountain from '../assets/fountain.jpeg';
import lauLogo from '../assets/LAU_LOGO.jpg';
import RoleToggleCard from '../components/RoleToggleCard';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const initialForm = {
  email: '',
  password: '',
  role: 'USER',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Make sure the backend is running and your credentials are correct.');
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickLogin(role) {
    setError('');
    setLoading(true);
    try {
      await signIn({
        email: role === 'ADMIN' ? 'admin@lau.edu.lb' : 'student@lau.edu.lb',
        password: 'demo',
        role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Quick login uses demo users. Add them to the backend first, or use mock login.');
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

        <div className="grid min-h-[calc(100vh-10rem)] gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-6">
            <div
              className="campus-image relative overflow-hidden rounded-[32px] border border-neutral-200 p-8 shadow-lift"
              style={{ backgroundImage: `url(${beirutFountain})` }}
            >
              <div className="absolute inset-0 bg-white/58" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/90 via-[#fffaf2]/76 to-white/52" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f7efe2]/42 to-transparent" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="font-display text-5xl font-semibold leading-tight text-[#6f4b2d]">
                  Simple. Smooth. Accessible.
                </h2>
              </div>

              <div className="relative z-10 mt-8 grid max-w-[28rem] gap-4">
                <div className="rounded-[24px] border border-white/75 bg-white/62 p-5 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-[#6a4021]">5</p>
                  <p className="mt-2 text-sm text-[#6a4021]">Underground levels from L1 to L5</p>
                </div>
                <div className="rounded-[24px] border border-white/75 bg-white/62 p-5 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-[#6a4021]">1000</p>
                  <p className="mt-2 text-sm text-[#6a4021]">Parking spots</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="campus-image relative min-h-[320px] w-full max-w-3xl overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-panel"
                style={{ backgroundImage: `url(${fountain})` }}
              >
                <div className="absolute inset-0 bg-white/12" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#fff8ef]/40 via-white/10 to-[#d7e7db]/18" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f4ec]/44 via-transparent to-white/18" />
                <div className="relative h-full rounded-[28px] p-6">
                  <div className="mx-auto max-w-2xl rounded-full border border-white/80 bg-[#fffaf4]/84 px-6 py-3 text-center backdrop-blur-md shadow-soft">
                    <p className="text-sm font-semibold italic text-[#24593d] sm:text-base">
                      Redefining the university experience with smarter innovation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-card h-full rounded-[32px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
              Portal access
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900">
              Sign in
            </h2>
            <p className="mt-3 text-neutral-600">
              Please use your LAU e-mail username (only the part before @) and password.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Username
                </span>
                <input
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder=""
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder=""
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">
                  Preferred role view
                </span>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, role: event.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-brand-400"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <Button type="submit" className="w-full py-3" disabled={loading}>
                {loading ? 'Entering dashboard...' : 'Login'}
              </Button>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </form>

            <p className="mt-5 text-center text-sm font-medium text-neutral-600">
              New to the parking portal?{' '}
              <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
                Create an account
              </Link>
            </p>

            <div className="mt-6">
              <RoleToggleCard onQuickLogin={handleQuickLogin} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
