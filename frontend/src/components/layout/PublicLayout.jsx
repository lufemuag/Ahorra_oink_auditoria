// src/components/layout/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header2 from './Header2';

const PublicLayout = () => {
  return (
    <>
      <Header2 />
      <Outlet />
    </>
  );
};

export default PublicLayout;
