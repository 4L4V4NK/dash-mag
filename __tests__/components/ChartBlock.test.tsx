import { render, screen } from '@testing-library/react';

import { ChartBlock } from '@/components/ChartBlock';

describe('ChartBlock Component', () => {
  const mockData = [
    { timestamp: '2025-01-01', value: 100, label: 'Jan' },
    { timestamp: '2025-01-02', value: 150, label: 'Feb' },
    { timestamp: '2025-01-03', value: 120, label: 'Mar' }
  ];

  it('should render chart block with title', () => {
    render(
      <ChartBlock
        data={mockData}
        title="Revenue Chart"
        type="line"
      />
    );

    expect(screen.getByText('Revenue Chart')).toBeInTheDocument();
  });

  it('should render with line chart type', () => {
    const { container } = render(
      <ChartBlock
        data={mockData}
        title="Test Chart"
        type="line"
      />
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should display loading state', () => {
    render(
      <ChartBlock
        data={mockData}
        title="Loading Chart"
        type="line"
        loading={true}
      />
    );

    const loadingElement = screen.queryByText(/loading/i);
    expect(loadingElement).toBeTruthy();
  });

  it('should handle different chart types', () => {
    const types: Array<'line' | 'bar' | 'pie' | 'area'> = ['line', 'bar', 'pie', 'area'];

    types.forEach(type => {
      const { unmount } = render(
        <ChartBlock
          data={mockData}
          title={`${type} chart`}
          type={type}
        />
      );

      expect(screen.getByText(`${type} chart`)).toBeInTheDocument();
      unmount();
    });
  });
});
