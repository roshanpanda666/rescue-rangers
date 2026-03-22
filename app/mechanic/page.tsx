'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface MechanicData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  specialization: string;
  status: 'FREE' | 'BUSY';
}

interface RequestData {
  _id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  carModel: string;
  isElectric: boolean;
  location: string;
  peopleCount: number;
  photoUrl: string;
  description: string;
  status: string;
  assignedMechanicId: string;
  assignedMechanicName: string;
  createdAt: string;
}

export default function MechanicPage() {
  const [step, setStep] = useState<'login' | 'profile' | 'dashboard'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: '', skills: '',
    experience: '', specialization: '',
  });

  const [mechanic, setMechanic] = useState<MechanicData | null>(null);
  const [assignments, setAssignments] = useState<RequestData[]>([]);

  const fetchAssignments = useCallback(async (mechanicId: string) => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.success) {
        setAssignments(data.requests.filter((r: RequestData) => r.assignedMechanicId === mechanicId));
      }
    } catch { /* ignore */ }
  }, []);

  const fetchMechanicData = useCallback(async (mechanicId: string) => {
    try {
      const res = await fetch(`/api/mechanics/${mechanicId}`);
      const data = await res.json();
      if (data.success) {
        setMechanic(data.mechanic);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('steady-gear-mechanic');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMechanic(parsed);
      setStep('dashboard');
      fetchAssignments(parsed._id);
      fetchMechanicData(parsed._id);
    }
  }, [fetchAssignments, fetchMechanicData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/mechanic-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        setStep('profile');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mechanics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMechanic(data.mechanic);
        localStorage.setItem('steady-gear-mechanic', JSON.stringify(data.mechanic));
        setStep('dashboard');
        fetchAssignments(data.mechanic._id);
        setSuccess(data.message || 'Profile created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleComplete = async (requestId: string) => {
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      setSuccess('Job completed! You are now FREE for new assignments.');
      if (mechanic) {
        fetchAssignments(mechanic._id);
        fetchMechanicData(mechanic._id);
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch { /* ignore */ }
  };

  const handleLogout = () => {
    setMechanic(null);
    setStep('login');
    localStorage.removeItem('steady-gear-mechanic');
    setAssignments([]);
  };

  // LOGIN
  if (step === 'login') {
    return (
      <div className="gradient-bg" style={{ minHeight: '100vh' }}>
        <nav className="navbar">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>⚙</div>
            <span style={{
              fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Steady Gear</span>
          </Link>
        </nav>

        <div style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center', padding: '120px 24px' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'rgba(0, 214, 143, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 20px',
            }}>🔧</div>
            <h1 style={{
              fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              textAlign: 'center', marginBottom: '8px',
            }}>Mechanic Portal</h1>
            <p style={{
              textAlign: 'center', color: 'var(--color-text-secondary)',
              marginBottom: '32px', fontSize: '14px',
            }}>Enter your credentials to access the mechanic dashboard</p>

            {error && (
              <div style={{
                padding: '12px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(255, 61, 113, 0.1)', border: '1px solid rgba(255, 61, 113, 0.3)',
                color: 'var(--color-danger)', fontSize: '14px',
              }}>{error}</div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Email</label>
                <input className="input-field" type="email" placeholder="mechanic email"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="input-label">Password</label>
                <input className="input-field" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // PROFILE SETUP
  if (step === 'profile') {
    return (
      <div className="gradient-bg" style={{ minHeight: '100vh' }}>
        <nav className="navbar">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>⚙</div>
            <span style={{
              fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Steady Gear</span>
          </Link>
        </nav>

        <div style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center', padding: '120px 24px' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '40px' }}>
            <h1 style={{
              fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              textAlign: 'center', marginBottom: '4px',
            }}>Set Up Your Profile</h1>
            <p style={{
              textAlign: 'center', color: 'var(--color-text-secondary)',
              marginBottom: '28px', fontSize: '14px',
            }}>Tell us about yourself so we can match you with the right jobs</p>

            {error && (
              <div style={{
                padding: '12px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(255, 61, 113, 0.1)', border: '1px solid rgba(255, 61, 113, 0.3)',
                color: 'var(--color-danger)', fontSize: '14px',
              }}>{error}</div>
            )}

            <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Full Name *</label>
                <input className="input-field" placeholder="John Smith"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="input-label">Email *</label>
                <input className="input-field" type="email" placeholder="john@example.com"
                  value={profileForm.email}
                  onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="input-label">Phone *</label>
                <input className="input-field" type="tel" placeholder="+1 234 567 8900"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div>
                <label className="input-label">Skills (comma-separated)</label>
                <input className="input-field" placeholder="Engine repair, Tire change, Electrical, EV"
                  value={profileForm.skills}
                  onChange={e => setProfileForm(p => ({ ...p, skills: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Experience</label>
                <input className="input-field" placeholder="e.g. 5 years"
                  value={profileForm.experience}
                  onChange={e => setProfileForm(p => ({ ...p, experience: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Specialization</label>
                <input className="input-field" placeholder="e.g. Diesel engines, Electric vehicles"
                  value={profileForm.specialization}
                  onChange={e => setProfileForm(p => ({ ...p, specialization: e.target.value }))} />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}>
                {loading ? 'Creating profile...' : '🔧 Create Profile & Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  const activeJobs = assignments.filter(a => a.status === 'assigned');
  const completedJobs = assignments.filter(a => a.status === 'completed');

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      {success && <div className="toast toast-success">{success}</div>}

      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>⚙</div>
          <span style={{
            fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Steady Gear</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={`badge ${mechanic?.status === 'FREE' ? 'badge-free' : 'badge-busy'}`}>
            {mechanic?.status === 'FREE' ? '🟢' : '🔴'} {mechanic?.status}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            👨‍🔧 {mechanic?.name}
          </span>
          <button className="btn-secondary" onClick={handleLogout}
            style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
        </div>
      </nav>

      <main style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {/* Profile Card */}
        {mechanic && (
          <div className="glass-orange" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: mechanic.status === 'FREE' ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 61, 113, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                }}>👨‍🔧</div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                    {mechanic.name}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    {mechanic.specialization || 'General Mechanic'} • {mechanic.experience || 'N/A'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="glass" style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-primary)' }}>{activeJobs.length}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Active</p>
                </div>
                <div className="glass" style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-success)' }}>{completedJobs.length}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Done</p>
                </div>
              </div>
            </div>
            {mechanic.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                {mechanic.skills.map((skill, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '8px', fontSize: '12px',
                    background: 'rgba(255, 107, 0, 0.1)', color: 'var(--color-primary-light)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                  }}>{skill}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Assignments */}
        <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
          🔧 Active Assignments
        </h2>

        {activeJobs.length === 0 ? (
          <div className="glass" style={{ padding: '48px', textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>😊</p>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
              No Active Jobs
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              You&apos;re currently free. Wait for a new assignment from the manager.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {activeJobs.map((job) => (
              <div key={job._id} className="glass card-hover" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{job.carModel}</h3>
                      {job.isElectric && <span>⚡</span>}
                      <span className="badge badge-assigned">ASSIGNED</span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      👤 {job.userName}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      📱 <a href={`tel:${job.userPhone}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{job.userPhone}</a>
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      📍 {job.location}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      👥 {job.peopleCount} people
                    </p>
                    {job.description && (
                      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        💬 {job.description}
                      </p>
                    )}
                    {job.userEmail && (
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        ✉️ {job.userEmail}
                      </p>
                    )}
                  </div>
                  {job.photoUrl && (
                    <img src={job.photoUrl} alt="Vehicle"
                      style={{ width: '120px', height: '90px', borderRadius: '10px', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button className="btn-success" onClick={() => handleComplete(job._id)}
                    style={{ padding: '10px 24px', fontSize: '14px' }}>
                    ✔️ Mark as Complete
                  </button>
                  <a href={`tel:${job.userPhone}`} style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                      📞 Call Customer
                    </button>
                  </a>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '10px' }}>
                  Requested: {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Completed Jobs */}
        {completedJobs.length > 0 && (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
              ✅ Completed Jobs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedJobs.map((job) => (
                <div key={job._id} className="glass" style={{ padding: '16px', opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{job.carModel} — {job.userName}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>📍 {job.location}</p>
                    </div>
                    <span className="badge badge-completed">✔️ DONE</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
