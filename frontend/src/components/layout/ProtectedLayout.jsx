// src/components/layout/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';
import Layout from './Layout';

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
