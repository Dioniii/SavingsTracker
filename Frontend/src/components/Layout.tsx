
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="finance-container">
      <div className="finance-card">
        <div className="finance-logo">FinTrack</div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
