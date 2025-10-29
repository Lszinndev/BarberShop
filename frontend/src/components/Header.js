import React from 'react';

const Header = () => {
  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt="BarberShop Logo"
        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
      />
    </header>
  );
};

export default Header;
