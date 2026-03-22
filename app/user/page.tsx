'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface RequestData {
  _id: string;
  carModel: string;
  isElectric: boolean;
  location: string;
  peopleCount: number;
  photoUrl: string;
  description: string;
  status: string;
  assignedMechanicName: string;
  createdAt: string;
}

export default function UserPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Auth form
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });

  // Request form
  const [requestForm, setRequestForm] = useState({
    carModel: '', isElectric: false, location: '', peopleCount: 1, description: '', photoUrl: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('steady-gear-user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      fetchRequests(parsed.id);
    }
  }, []);

  const fetchRequests = async (userId: string) => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests.filter((r: RequestData & { userId: string }) => r.userId === userId));
      }
    } catch { /* ignore */ }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('steady-gear-user', JSON.stringify(data.user));
        fetchRequests(data.user.id);
        setSuccess(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setRequestForm(prev => ({ ...prev, photoUrl: data.url }));
      }
    } catch { /* ignore */ }
    setUploading(false);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userPhone: user.phone,
          userEmail: user.email,
          ...requestForm,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Request submitted! A mechanic will be assigned to you shortly.');
        setShowRequestForm(false);
        setRequestForm({ carModel: '', isElectric: false, location: '', peopleCount: 1, description: '', photoUrl: '' });
        fetchRequests(user.id);
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('steady-gear-user');
    setRequests([]);
  };

  // Not logged in — show auth form
  if (!user) {
    return (
      <div className="gradient-bg" style={{ minHeight: '100vh' }}>
        <nav className="navbar">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700',
            }}>⚙</div>
            <span style={{
              fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Steady Gear</span>
          </Link>
        </nav>

        <div style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center', padding: '120px 24px 60px' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
            <h1 style={{
              fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-heading)',
              textAlign: 'center', marginBottom: '8px',
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{
              textAlign: 'center', color: 'var(--color-text-secondary)',
              marginBottom: '32px', fontSize: '15px',
            }}>
              {isLogin ? 'Sign in to request mechanic assistance' : 'Join Steady Gear to get roadside help'}
            </p>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                background: 'rgba(255, 61, 113, 0.1)', border: '1px solid rgba(255, 61, 113, 0.3)',
                color: 'var(--color-danger)', fontSize: '14px',
              }}>{error}</div>
            )}

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLogin && (
                <>
                  <div>
                    <label className="input-label">Full Name</label>
                    <input className="input-field" placeholder="John Doe" value={authForm.name}
                      onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="input-label">Phone Number</label>
                    <input className="input-field" placeholder="+1 234 567 8900" type="tel"
                      value={authForm.phone}
                      onChange={e => setAuthForm(p => ({ ...p, phone: e.target.value }))} required />
                  </div>
                </>
              )}
              <div>
                <label className="input-label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="input-label">Password</label>
                <input className="input-field" type="password" placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--color-primary)',
                  cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in — show dashboard
  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>⚙</div>
          <span style={{
            fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Steady Gear</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            👋 {user.name}
          </span>
          <button className="btn-secondary" onClick={handleLogout}
            style={{ padding: '8px 16px', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </nav>

      <main style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {success && (
          <div className="toast toast-success">{success}</div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
              Your Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '4px' }}>
              Manage your breakdown assistance requests
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowRequestForm(true)}>
            + New Request
          </button>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="overlay" onClick={() => setShowRequestForm(false)}>
            <div className="glass-strong animate-fade-in" style={{ width: '100%', maxWidth: '560px', padding: '36px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
                Request a Mechanic
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Fill in your vehicle and location details
              </p>

              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                  background: 'rgba(255, 61, 113, 0.1)', border: '1px solid rgba(255, 61, 113, 0.3)',
                  color: 'var(--color-danger)', fontSize: '14px',
                }}>{error}</div>
              )}

              <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="input-label">Car Model *</label>
                  <input className="input-field" placeholder="e.g. Toyota Camry 2022"
                    value={requestForm.carModel}
                    onChange={e => setRequestForm(p => ({ ...p, carModel: e.target.value }))} required />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={`toggle-switch ${requestForm.isElectric ? 'active' : ''}`}
                    onClick={() => setRequestForm(p => ({ ...p, isElectric: !p.isElectric }))} />
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Electric Vehicle {requestForm.isElectric ? '⚡' : ''}
                  </span>
                </div>

                <div>
                  <label className="input-label">Location *</label>
                  <input className="input-field" placeholder="e.g. Highway 101, Mile marker 42"
                    value={requestForm.location}
                    onChange={e => setRequestForm(p => ({ ...p, location: e.target.value }))} required />
                </div>

                <div>
                  <label className="input-label">Number of People</label>
                  <input className="input-field" type="number" min="1" max="20"
                    value={requestForm.peopleCount}
                    onChange={e => setRequestForm(p => ({ ...p, peopleCount: parseInt(e.target.value) || 1 }))} />
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea className="input-field" placeholder="Describe the issue: flat tire, engine won't start, smoke from hood, etc."
                    value={requestForm.description}
                    onChange={e => setRequestForm(p => ({ ...p, description: e.target.value }))}
                    style={{ minHeight: '100px', resize: 'vertical' }} />
                </div>

                <div>
                  <label className="input-label">Upload Photo</label>
                  <div className="upload-area" onClick={() => document.getElementById('file-upload')?.click()}>
                    {requestForm.photoUrl ? (
                      <div>
                        <img src={requestForm.photoUrl} alt="Upload" style={{ maxHeight: '120px', borderRadius: '8px', marginBottom: '8px' }} />
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Click to change</p>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: '24px', marginBottom: '8px' }}>📸</p>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                          {uploading ? 'Uploading...' : 'Click to upload a photo of the issue'}
                        </p>
                      </>
                    )}
                  </div>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload}
                    style={{ display: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowRequestForm(false)}
                    style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}
                    style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Request List */}
        {requests.length === 0 ? (
          <div className="glass" style={{ padding: '60px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</p>
            <h3 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
              No Requests Yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Click &quot;New Request&quot; to get mechanic assistance
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {requests.map((req, i) => (
              <div key={req._id} className="glass card-hover animate-fade-in"
                style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'var(--font-heading)' }}>
                        {req.carModel}
                      </h3>
                      {req.isElectric && <span style={{ fontSize: '14px' }}>⚡</span>}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      📍 {req.location}
                    </p>
                    {req.description && (
                      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        {req.description}
                      </p>
                    )}
                    {req.assignedMechanicName && (
                      <p style={{ fontSize: '14px', color: 'var(--color-primary)', marginTop: '8px' }}>
                        🔧 Assigned: {req.assignedMechanicName}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`badge badge-${req.status}`}>
                      {req.status === 'pending' && '⏳'}
                      {req.status === 'accepted' && '✅'}
                      {req.status === 'assigned' && '🔧'}
                      {req.status === 'completed' && '✔️'}
                      {' '}{req.status}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {req.photoUrl && (
                  <img src={req.photoUrl} alt="Vehicle" style={{
                    marginTop: '16px', maxHeight: '200px', borderRadius: '10px', objectFit: 'cover',
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
