import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NotebookPage from './components/NotebookPage';

const routes = [
  {
    path: '/',
    element: <Layout />, 
    children: [
      { index: true, element: <Navigate to="/notebook/default" /> },
      {
        path: '/notebook/:notebookId',
        element: <NotebookPage />, 
      },
    ],
  },
];

export default routes;