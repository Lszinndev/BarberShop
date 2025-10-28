import React from 'react';

const Header = () => {
  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <img
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt="BarberShop Logo"
        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
      />
      <h1 style={{ margin: 0, fontSize: '1.25rem' }}>BarberShop</h1>
    </header>
  );
};

export default Header;
