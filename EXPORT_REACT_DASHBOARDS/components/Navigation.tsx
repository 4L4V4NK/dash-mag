'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, HelpCircle, Bell, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();
  const { role } = useUser();

  const navigationLinks = [
    {
      href: '/dashboard/dashboard-oficial',
      label: 'Dashboard',
      roles: ['executive', 'technical']
    },
    {
      href: '/dashboard/operational',
      label: 'Operacional',
      roles: ['executive', 'technical']
    },
    {
      href: '/dashboard/predictive',
      label: 'Preditivo',
      roles: ['executive', 'technical']
    }
  ];

  return (
    <nav className={styles.topNav}>
      <div className={styles.navLeft}>
        <Link href="/dashboard/dashboard-oficial" className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <span>Corelytics</span>
        </Link>
        <div className={styles.navLinks}>
          {navigationLinks
            .filter(link => link.roles.includes(role))
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? styles.active : ''}
              >
                {link.label}
              </Link>
            ))}
        </div>
      </div>
      <div className={styles.navRight}>
        <button className={styles.iconButton}><Search size={20} /></button>
        <button className={styles.iconButton}><HelpCircle size={20} /></button>
        <button className={styles.iconButton}><Bell size={20} /></button>
        <div className={styles.userProfile}>
          <div className={styles.userIcon}>
            <User size={20} />
          </div>
          <span>Julia R.</span>
          <span className={styles.userRole}>Business analyst</span>
        </div>
      </div>
    </nav>
  );
}
