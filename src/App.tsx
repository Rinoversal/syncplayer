import React, { useEffect } from 'react';
import { TestBenchHost } from './bench/TestBench';
import { installMockElectronAPI } from './mock/electronAPI';
import { AppProviders } from './state/appStore';
import { WindowRouter } from './windows/WindowRouter';
import './regions/shell/shell.css';

installMockElectronAPI();

const SHOW_BENCH = !import.meta.env.PROD || import.meta.env.VITE_PREVIEW_BENCH === '1';

export default function App() {
  useEffect(() => {
    installMockElectronAPI();
  }, []);

  return (
    <AppProviders>
      {SHOW_BENCH ? (
        <TestBenchHost>
          {(dims) => <WindowRouter frameWidthPx={dims.width} frameHeightPx={dims.height} />}
        </TestBenchHost>
      ) : (
        <div className="sp-app-frame" data-app-frame="1">
          <WindowRouter />
        </div>
      )}
    </AppProviders>
  );
}
