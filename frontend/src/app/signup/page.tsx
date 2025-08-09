"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);

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
            ✈️
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

        {/* Sign In Button */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Link href="/login" style={{
            color: '#1a1a1a',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign In
          </Link>
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
            Welcome to AeroDeliver
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Join the future of delivery. Get your orders delivered in minutes, not hours.
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
              <span>Lightning-fast 15-minute deliveries</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              color: '#666'
            }}>
              <span>Safe delivery to your doorstep</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#666'
            }}>
              <span>Fully insured and tracked</span>
            </div>
          </div>

          {/* Customer Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#666'
          }}>
            <span>Join 50,000+ satisfied customers</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.25rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '2rem'
          }}>
            4.8/5 average rating
          </p>

          {/* Hero Image */}
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: '100vh',
          overflowY: 'auto'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.25rem'
          }}>
            Create your account
          </h2>
          
          <p style={{
            color: '#666',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            Join thousands enjoying fast drone deliveries
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Name Fields */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '0.25rem'
                }}>
                  First name
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
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

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '0.25rem'
                }}>
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* Email Field */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                Email address
              </label>
              <div style={{
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  ✉️
                </span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 8px 8px 32px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* Phone Number */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                Phone number
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* Delivery Address */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                Delivery address
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* City and ZIP Code */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '0.25rem'
                }}>
                  City
                </label>
                <input
                  type="text"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '0.25rem'
                }}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="10001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                Confirm password
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
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

            {/* Checkboxes */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '12px',
                color: '#666',
                cursor: 'pointer',
                marginBottom: '0.25rem'
              }}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{
                    width: '14px',
                    height: '14px'
                  }}
                />
                I agree to the{' '}
                <Link href="/terms" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '12px',
                color: '#666',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={sendUpdates}
                  onChange={(e) => setSendUpdates(e.target.checked)}
                  style={{
                    width: '14px',
                    height: '14px'
                  }}
                />
                Send me delivery updates and offers
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#6b7280'}
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
