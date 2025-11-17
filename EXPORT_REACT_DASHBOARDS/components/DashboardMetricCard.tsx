'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Target, BarChart3 } from 'lucide-react';
import styles from '../app/dashboard-oficial/Dashboard.module.css';

interface DashboardMetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon?: 'dollar' | 'users' | 'target' | 'chart' | 'calculator' | 'smile' | 'sparkles' | React.ReactNode;
  subtext?: string;
  colorScheme?: 'blue' | 'purple' | 'orange' | 'green';
}

export function DashboardMetricCard({ 
  title, 
  value, 
  change, 
  trend,
  icon = 'chart',
  subtext,
  colorScheme 
}: DashboardMetricCardProps) {
  
  const iconMap = {
    dollar: BarChart3,
    users: Users,
    target: Target,
    chart: BarChart3,
    calculator: BarChart3,
    smile: Target,
    sparkles: BarChart3,
  };

  // Se icon é um elemento React, usa diretamente; senão, usa o mapa
  const iconElement = React.useMemo(() => {
    if (!icon || icon === 'chart') {
      return <BarChart3 size={18} />;
    }
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon as keyof typeof iconMap];
      return IconComponent ? <IconComponent size={18} /> : <BarChart3 size={18} />;
    }
    return icon;
  }, [icon]);

  return (
    <div className={styles.metricsCard}>
      <div className={styles.metricContent}>
        <div className={styles.metricInfo}>
          <span className={styles.metricTitle}>{title}</span>
          <div className={styles.metricValue}>{value}</div>
          
          {change && (
            <div className={`${styles.metricChange} ${trend === 'up' ? styles.positive : styles.negative}`}>
              {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change} to previous year
            </div>
          )}
          
          {subtext && (
            <div className={styles.metricSubtext}>{subtext}</div>
          )}
        </div>
        
        <div className={styles.metricIconCircle}>
          {iconElement}
        </div>
      </div>
    </div>
  );
}
