"use client";

import Link from "next/link";
import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoText}>AeroDeliver</div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join us today! Please enter your details below.</p>
        <form className={styles.form} autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className={styles.input}
            type="text"
            placeholder="Full Name"
            required
            autoComplete="name"
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Email Address"
            required
            autoComplete="username"
          />
          <input
            className={styles.input}
            type="tel"
            placeholder="Phone Number"
            required
            autoComplete="tel"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Create Password"
            required
            autoComplete="new-password"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
          />
          <div style={{ 
            width: '100%', 
            textAlign: 'center', 
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            color: '#4A4A4A'
          }}>
            By signing up, you agree to our{' '}
            <Link href="/terms" style={{ 
              color: '#E63946', 
              fontWeight: 600, 
              textDecoration: 'none'
            }}>
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ 
              color: '#E63946', 
              fontWeight: 600, 
              textDecoration: 'none'
            }}>
              Privacy Policy
            </Link>
          </div>
          <button className={styles.purpleButton} type="submit">
            Create Account
          </button>
        </form>
        <Link className={styles.linkBlue} href="/login">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
