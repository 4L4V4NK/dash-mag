import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .dashboard-card {
    background: rgba(22, 27, 34, 0.95);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
  }

  .dashboard-content {
    flex: 1;
    overflow: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .chart-container {
    height: 400px;
    position: relative;
  }

  .recharts-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;