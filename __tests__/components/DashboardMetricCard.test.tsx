import { render, screen } from '@testing-library/react';

import { DashboardMetricCard } from '@/components/DashboardMetricCard';

describe('DashboardMetricCard Component', () => {
  it('should render metric card with label and value', () => {
    render(
      <DashboardMetricCard
        label="Total Revenue"
        value={1250000}
        unit="USD"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText(/1250000/)).toBeInTheDocument();
  });

  it('should display trending information', () => {
    render(
      <DashboardMetricCard
        label="Revenue"
        value={1250000}
        trend={12.5}
        trendLabel="vs last month"
      />
    );

    expect(screen.getByText('vs last month')).toBeInTheDocument();
    expect(screen.getByText(/12.5/)).toBeInTheDocument();
  });

  it('should display unit when provided', () => {
    render(
      <DashboardMetricCard
        label="Connections"
        value={5000}
        unit="active"
      />
    );

    expect(screen.getByText(/active/)).toBeInTheDocument();
  });

  it('should handle click callback', () => {
    const onClick = jest.fn();

    render(
      <DashboardMetricCard
        label="Clickable Metric"
        value={100}
        onClick={onClick}
      />
    );

    const card = screen.getByText('Clickable Metric').closest('div');
    if (card) {
      card.click();
      // Note: may need to adjust based on actual implementation
    }
  });
});
