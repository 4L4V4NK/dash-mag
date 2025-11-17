/**
 * Navigation Menu Component
 * Provides navigation between all dashboard pages
 * 
 * URLs Supported:
 * - /dashboard/login
 * - /dashboard/executive
 * - /dashboard/operational-v2
 * - /dashboard/predictive-v2
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Brain,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import styles from './NavigationMenu.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Executive',
    href: '/dashboard/executive',
    icon: <LayoutDashboard size={20} />,
    description: 'Executive Dashboard with Bento Grid',
  },
  {
    label: 'Operational v2',
    href: '/dashboard/operational-v2',
    icon: <Activity size={20} />,
    description: 'Operational Metrics Dashboard',
  },
  {
    label: 'Predictive v2',
    href: '/dashboard/predictive-v2',
    icon: <Brain size={20} />,
    description: 'ML Predictions Dashboard',
  },
  {
    label: 'Legacy',
    href: '/dashboard/dashboard-oficial',
    icon: <TrendingUp size={20} />,
    description: 'Original Dashboard (Bento Grid)',
  },
];

interface NavigationMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'sidebar' | 'header' | 'drawer';
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isOpen = true,
  onClose,
  variant = 'sidebar',
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(isOpen);

  const isActive = (href: string) => pathname === href || pathname === href + '/';

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/dashboard/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (variant === 'header') {
    return (
      <nav className={styles.headerNav}>
        <div className={styles.headerContainer}>
          <div className={styles.headerBrand}>
            <LayoutDashboard size={24} />
            <span>AI Monitoring</span>
          </div>

          <div className={styles.headerLinks}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.headerLink} ${
                  isActive(item.href) ? styles.active : ''
                }`}
                title={item.description}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    );
  }

  if (variant === 'drawer') {
    return (
      <div className={`${styles.drawer} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Navigation</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className={styles.closeButton}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.drawerItem} ${
                isActive(item.href) ? styles.active : ''
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <div className={styles.drawerIcon}>{item.icon}</div>
              <div className={styles.drawerContent}>
                <div className={styles.drawerLabel}>{item.label}</div>
                {item.description && (
                  <div className={styles.drawerDesc}>{item.description}</div>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          <button
            onClick={handleLogout}
            className={styles.drawerLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: sidebar
  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.expanded : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.brand}>
          <LayoutDashboard size={24} />
          <span className={styles.brandText}>AI Monitoring</span>
        </div>
        <button
          className={styles.toggleButton}
          onClick={() => setMobileOpen(!mobileOpen)}
          title={mobileOpen ? 'Collapse' : 'Expand'}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              isActive(item.href) ? styles.active : ''
            }`}
            title={item.description}
          >
            <div className={styles.icon}>{item.icon}</div>
            {mobileOpen && (
              <div className={styles.content}>
                <div className={styles.label}>{item.label}</div>
                {item.description && (
                  <div className={styles.description}>{item.description}</div>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Logout"
        >
          <LogOut size={20} />
          {mobileOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default NavigationMenu;
