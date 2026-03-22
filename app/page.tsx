'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="gradient-hero" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A33 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
          }}>
            ⚙
          </div>
          <span style={{
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #FF6B00, #FF8A33)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Steady Gear
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/user" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>Get Help</button>
          </Link>
          <Link href="/manager" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>Management</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', padding: '120px 32px 60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className={`${mounted ? 'animate-fade-in stagger-1' : ''}`}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
              background: 'rgba(255, 107, 0, 0.15)',
              color: '#FF8A33',
              border: '1px solid rgba(255, 107, 0, 0.2)',
              marginBottom: '24px',
            }}>
              🔧 Emergency Roadside Assistance
            </span>
          </div>

          <h1 className={`${mounted ? 'animate-fade-in stagger-2' : ''}`} style={{
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1.1',
            marginBottom: '24px',
          }}>
            Vehicle Breakdown?{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #FFAA00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              We&apos;ve Got You
            </span>{' '}
            Covered.
          </h1>

          <p className={`${mounted ? 'animate-fade-in stagger-3' : ''}`} style={{
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.7',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            Request a professional mechanic instantly. Our certified technicians are ready to help you get back on the road — anytime, anywhere.
          </p>

          <div className={`${mounted ? 'animate-fade-in stagger-4' : ''}`} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/user" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                🚗 Request a Mechanic
              </button>
            </Link>
            <Link href="/mechanic" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                🔧 Join as Mechanic
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '100px',
        }}>
          {[
            {
              icon: '🚨',
              title: 'Instant Request',
              desc: 'Submit your breakdown details and get connected to a mechanic within minutes.',
            },
            {
              icon: '👨‍🔧',
              title: 'Certified Mechanics',
              desc: 'Our network of skilled mechanics specialize in all vehicle types, including electric.',
            },
            {
              icon: '📍',
              title: 'Location Tracking',
              desc: 'Share your exact location so help reaches you fast, wherever you are.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`glass card-hover ${mounted ? 'animate-fade-in' : ''}`}
              style={{
                padding: '32px',
                animationDelay: `${0.5 + i * 0.15}s`,
                opacity: mounted ? undefined : 0,
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(255, 107, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '20px',
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: 'var(--font-heading)',
                marginBottom: '10px',
              }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            marginBottom: '48px',
          }}>
            Choose Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Portal
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                icon: '🚗',
                title: 'User Portal',
                desc: 'Need help? Register, describe your vehicle issue, and request immediate assistance.',
                link: '/user',
                gradient: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 170, 0, 0.08))',
              },
              {
                icon: '📋',
                title: 'Management Portal',
                desc: 'Accept requests, assign mechanics, manage operations, and customize the platform.',
                link: '/manager',
                gradient: 'linear-gradient(135deg, rgba(0, 149, 255, 0.15), rgba(0, 214, 143, 0.08))',
              },
              {
                icon: '🔧',
                title: 'Mechanic Portal',
                desc: 'Join our team, set up your profile, and receive breakdown assignments.',
                link: '/mechanic',
                gradient: 'linear-gradient(135deg, rgba(0, 214, 143, 0.15), rgba(255, 107, 0, 0.08))',
              },
            ].map((card, i) => (
              <Link key={i} href={card.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  className="glass card-hover"
                  style={{
                    padding: '36px',
                    background: card.gradient,
                    cursor: 'pointer',
                    height: '100%',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>{card.icon}</div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '12px',
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '15px', marginBottom: '20px' }}>
                    {card.desc}
                  </p>
                  <span style={{
                    color: 'var(--color-primary)',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Enter Portal →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '60px 0 30px',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
        }}>
          <p>© 2026 Steady Gear. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
