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

interface SettingsData {
  theme: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
}

export default function ManagerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [requests, setRequests] = useState<RequestData[]>([]);
  const [mechanics, setMechanics] = useState<MechanicData[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'orange', accentColor: '#FF6B00', heroTitle: 'Steady Gear',
    heroSubtitle: 'Roadside assistance at your fingertips', announcement: '',
  });
  const [activeTab, setActiveTab] = useState<'requests' | 'settings'>('requests');
  const [assignModal, setAssignModal] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [reqRes, mechRes, settRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/mechanics'),
        fetch('/api/settings'),
      ]);
      const [reqData, mechData, settData] = await Promise.all([
        reqRes.json(), mechRes.json(), settRes.json(),
      ]);
      if (reqData.success) setRequests(reqData.requests);
      if (mechData.success) setMechanics(mechData.mechanics);
      if (settData.success) setSettings(settData.settings);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('steady-gear-manager');
    if (saved === 'true') {
      setIsLoggedIn(true);
      fetchData();
    }
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/manager-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('steady-gear-manager', 'true');
        fetchData();
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      setSuccess('Request accepted!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch { /* ignore */ }
  };

  const handleAssign = async (requestId: string, mechanic: MechanicData) => {
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'assigned',
          assignedMechanicId: mechanic._id,
          assignedMechanicName: mechanic.name,
        }),
      });
      setAssignModal(null);
      setSuccess(`Mechanic ${mechanic.name} assigned!`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch { /* ignore */ }
  };

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      setSuccess('Request marked as completed!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch { /* ignore */ }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSuccess('Settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { /* ignore */ }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('steady-gear-manager');
  };

  // Login form
  if (!isLoggedIn) {
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
              background: 'rgba(0, 149, 255, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 20px',
            }}>📋</div>
            <h1 style={{
              fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              textAlign: 'center', marginBottom: '8px',
            }}>Management Login</h1>
            <p style={{
              textAlign: 'center', color: 'var(--color-text-secondary)',
              marginBottom: '32px', fontSize: '14px',
            }}>Access the service management dashboard</p>

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
                <input className="input-field" type="email" placeholder="Manager email"
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

  // Dashboard
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeCount = requests.filter(r => ['accepted', 'assigned'].includes(r.status)).length;
  const freeMechanics = mechanics.filter(m => m.status === 'FREE').length;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('requests')}
              style={{ padding: '8px 20px', fontSize: '13px' }}>
              📋 Requests
            </button>
            <button className={activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('settings')}
              style={{ padding: '8px 20px', fontSize: '13px' }}>
              ⚙ Settings
            </button>
          </div>
          <button className="btn-secondary" onClick={handleLogout}
            style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
        </div>
      </nav>

      <main style={{ paddingTop: '90px', padding: '90px 24px 40px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', maxWidth: '1400px', margin: '0 auto 24px' }}>
          {[
            { label: 'Pending', value: pendingCount, color: 'var(--color-warning)', icon: '⏳' },
            { label: 'Active', value: activeCount, color: 'var(--color-info)', icon: '🔄' },
            { label: 'Mechanics', value: mechanics.length, color: 'var(--color-primary)', icon: '🔧' },
            { label: 'Available', value: freeMechanics, color: 'var(--color-success)', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${stat.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: stat.color }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'settings' ? (
          /* Settings Panel */
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="glass" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '24px' }}>
                ⚙ Platform Settings
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="input-label">Theme</label>
                  <select className="input-field" value={settings.theme}
                    onChange={e => setSettings(p => ({ ...p, theme: e.target.value }))}>
                    <option value="orange">🟠 Orange</option>
                    <option value="blue">🔵 Blue</option>
                    <option value="green">🟢 Green</option>
                    <option value="purple">🟣 Purple</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Accent Color</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="color" value={settings.accentColor}
                      onChange={e => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                      style={{ width: '50px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                    <input className="input-field" value={settings.accentColor}
                      onChange={e => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                      style={{ flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Hero Title</label>
                  <input className="input-field" value={settings.heroTitle}
                    onChange={e => setSettings(p => ({ ...p, heroTitle: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Hero Subtitle</label>
                  <input className="input-field" value={settings.heroSubtitle}
                    onChange={e => setSettings(p => ({ ...p, heroSubtitle: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Announcement Banner</label>
                  <textarea className="input-field" placeholder="Leave empty to hide announcement"
                    value={settings.announcement}
                    onChange={e => setSettings(p => ({ ...p, announcement: e.target.value }))}
                    style={{ minHeight: '80px' }} />
                </div>
                <button className="btn-primary" onClick={handleSaveSettings}
                  style={{ alignSelf: 'flex-end' }}>
                  💾 Save Settings
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Requests + Mechanics Grid */
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="dashboard-grid">
              {/* Left: Requests */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
                  Service Requests
                </h2>
                {requests.length === 0 ? (
                  <div className="glass" style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ fontSize: '36px', marginBottom: '12px' }}>📋</p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>No requests yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {requests.map((req) => (
                      <div key={req._id} className="glass card-hover" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{req.carModel}</h3>
                              {req.isElectric && <span style={{ fontSize: '13px' }}>⚡</span>}
                              <span className={`badge badge-${req.status}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                                {req.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                              👤 {req.userName} &nbsp; 📱 <a href={`tel:${req.userPhone}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{req.userPhone}</a>
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                              📍 {req.location} &nbsp; 👥 {req.peopleCount} people
                            </p>
                            {req.description && (
                              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                💬 {req.description}
                              </p>
                            )}
                            {req.assignedMechanicName && (
                              <p style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '6px' }}>
                                🔧 {req.assignedMechanicName}
                              </p>
                            )}
                            {req.userEmail && (
                              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                ✉️ {req.userEmail}
                              </p>
                            )}
                          </div>
                          {req.photoUrl && (
                            <img src={req.photoUrl} alt="Vehicle"
                              style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                          {req.status === 'pending' && (
                            <button className="btn-success" onClick={() => handleAccept(req._id)}
                              style={{ padding: '8px 16px', fontSize: '12px' }}>
                              ✅ Accept
                            </button>
                          )}
                          {(req.status === 'accepted' || req.status === 'pending') && (
                            <button className="btn-primary" onClick={() => setAssignModal(req._id)}
                              style={{ padding: '8px 16px', fontSize: '12px' }}>
                              🔧 Assign Mechanic
                            </button>
                          )}
                          {req.status === 'assigned' && (
                            <button className="btn-success" onClick={() => handleComplete(req._id)}
                              style={{ padding: '8px 16px', fontSize: '12px' }}>
                              ✔️ Mark Complete
                            </button>
                          )}
                          <a href={`tel:${req.userPhone}`} style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                              📞 Call User
                            </button>
                          </a>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '10px' }}>
                          {new Date(req.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Mechanic Profiles */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
                  Mechanics
                </h2>
                {mechanics.length === 0 ? (
                  <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '36px', marginBottom: '8px' }}>🔧</p>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>No mechanics registered yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mechanics.map((mech) => (
                      <div key={mech._id} className="glass card-hover" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{
                              width: '42px', height: '42px', borderRadius: '12px',
                              background: mech.status === 'FREE' ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 61, 113, 0.15)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '20px',
                            }}>
                              👨‍🔧
                            </div>
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{mech.name}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{mech.specialization || mech.email}</p>
                            </div>
                          </div>
                          <span className={`badge ${mech.status === 'FREE' ? 'badge-free' : 'badge-busy'}`}>
                            {mech.status === 'FREE' ? '🟢' : '🔴'} {mech.status}
                          </span>
                        </div>
                        {mech.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {mech.skills.map((skill, i) => (
                              <span key={i} style={{
                                padding: '3px 10px', borderRadius: '8px', fontSize: '11px',
                                background: 'rgba(255, 107, 0, 0.1)', color: 'var(--color-primary-light)',
                                border: '1px solid rgba(255, 107, 0, 0.15)',
                              }}>{skill}</span>
                            ))}
                          </div>
                        )}
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                          📱 {mech.phone} {mech.experience && `• ${mech.experience} exp`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Assign Mechanic Modal */}
      {assignModal && (
        <div className="overlay" onClick={() => setAssignModal(null)}>
          <div className="glass-strong animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
              Assign Mechanic
            </h2>
            {mechanics.filter(m => m.status === 'FREE').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <p style={{ fontSize: '36px', marginBottom: '8px' }}>😕</p>
                <p style={{ color: 'var(--color-text-secondary)' }}>No free mechanics available</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mechanics.filter(m => m.status === 'FREE').map((mech) => (
                  <div key={mech._id} className="glass card-hover"
                    style={{ padding: '14px', cursor: 'pointer' }}
                    onClick={() => handleAssign(assignModal, mech)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{mech.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {mech.specialization || 'General'} • {mech.experience || 'N/A'}
                        </p>
                      </div>
                      <span className="badge badge-free">🟢 FREE</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-secondary" onClick={() => setAssignModal(null)}
              style={{ width: '100%', marginTop: '16px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
