'use client';

import { Search, HelpCircle, Bell, User, ChevronDown, Share2, Download, Sparkles, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  onOpenAssistant?: () => void;
}

export default function DashboardHeader({ onOpenAssistant }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoText} style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.1em' }}>NEREIDAS</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a
            href="/dashboard/dashboard-oficial"
            className={`${styles.navLink} ${pathname === '/dashboard/dashboard-oficial' ? styles.active : ''}`}
          >
            Dashboard
          </a>
          <a
            href="/dashboard/executive"
            className={`${styles.navLink} ${pathname === '/dashboard/executive' ? styles.active : ''}`}
          >
            Executive
          </a>
          <a
            href="/dashboard/operational-v2"
            className={`${styles.navLink} ${pathname === '/dashboard/operational-v2' ? styles.active : ''}`}
          >
            Operational V2
          </a>
          <a
            href="/dashboard/predictive-v2"
            className={`${styles.navLink} ${pathname === '/dashboard/predictive-v2' ? styles.active : ''}`}
          >
            Predictive V2
          </a>
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          <button className={styles.iconButton}>
            <Search size={16} />
          </button>
          <button className={styles.iconButton}>
            <HelpCircle size={16} />
          </button>
          <button className={styles.iconButton}>
            <Bell size={16} />
          </button>
          
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <User size={16} />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name || 'Usuário'}</div>
              <div className={styles.userRole}>{user?.role || 'viewer'}</div>
            </div>
          </div>

          <button 
            className={styles.logoutButton}
            onClick={logout}
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>
            <span>Last year</span>
            <ChevronDown size={14} />
          </button>
          
          <button className={styles.iconFilterButton}>
            <Share2 size={14} />
          </button>
          
          <button className={styles.iconFilterButton}>
            <Download size={14} />
          </button>
          
          <button 
            className={styles.primaryButton}
            onClick={onOpenAssistant}
          >
            <Sparkles size={14} />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
}
