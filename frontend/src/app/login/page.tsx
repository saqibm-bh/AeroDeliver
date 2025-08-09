"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Left Side - Hero Section */}
      <div style={{
        flex: 1,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
          }}>
          </div>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            AeroDeliver
          </span>
        </div>

        {/* Support Button */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#666'
        }}>
          <span style={{ fontSize: '16px' }}>❓</span>
          <span>Support</span>
        </div>

        {/* Main Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          {/* Logo */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white',
            fontSize: '32px'
          }}>
            ✈️
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '1rem'
          }}>
            AeroDeliver
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            The future of delivery is here. Fast, reliable, and environmentally friendly.
          </p>

          {/* Features */}
          <div style={{
            textAlign: 'left',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              color: '#666'
            }}>
              <span style={{ fontSize: '20px' }}>⏱️</span>
              <span>Delivery in 15-30 minutes</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              color: '#666'
            }}>
              <span>Safe & secure packaging</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#666'
            }}>
              <span>24/7 real-time tracking</span>
            </div>
          </div>

          {/* Drone Image */}
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RHJvbmUgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
            Welcome back
          </h2>
          
          <p style={{
            color: '#666',
            marginBottom: '2rem'
          }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Email address
              </label>
              <div style={{
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  ✉️
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    color: '#000000',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    color: '#000000',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px'
                  }}
                />
                Remember me
              </label>
              <Link href="/forgot-password" style={{
                fontSize: '14px',
                color: '#0070f3',
                textDecoration: 'none'
              }}>
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#333'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1a1a1a'}
            >
              Sign in
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: '#e0e0e0'
              }}></div>
              <span style={{
                fontSize: '14px',
                color: '#999'
              }}>
                OR CONTINUE WITH
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: '#e0e0e0'
              }}></div>
            </div>

            {/* Social Login Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <button style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span>🌐</span>
                Google
              </button>
              <button style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span>🍎</span>
                Apple
              </button>
            </div>

            {/* Sign Up Link */}
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              marginBottom: '2rem'
            }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{
                color: '#0070f3',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Sign up for free
              </Link>
            </p>

            {/* Footer Links */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '12px',
              color: '#999',
              marginBottom: '1rem'
            }}>
              <Link href="/privacy" style={{ color: '#999', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ color: '#999', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link href="/security" style={{ color: '#999', textDecoration: 'none' }}>
                Security
              </Link>
              <Link href="/status" style={{ color: '#999', textDecoration: 'none' }}>
                Status
              </Link>
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#999'
            }}>
              © 2025 AeroDeliver. All rights reserved.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
