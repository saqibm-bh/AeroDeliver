"use client";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title} style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem'}}>
          AeroDeliver
        </h1>
        <h2 className={styles.title} style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>
          Sign in to your account
        </h2>
        <p className={styles.subtitle}>Welcome back! Please enter your details below.</p>
        <form className={styles.form} autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            required
            autoComplete="username"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <div style={{ width: '100%', textAlign: 'right', marginBottom: '0.5rem' }}>
            <Link href="/forgot-password" style={{ 
              color: '#F4A1A8', 
              fontWeight: 500, 
              textDecoration: 'none', 
              fontSize: '0.95rem', 
              transition: 'color 0.2s' 
            }}>
              Forgot password?
            </Link>
          </div>
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
        <Link className={styles.link} href="/signup">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
