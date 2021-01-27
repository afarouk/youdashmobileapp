import React from 'react';
import { Routes } from './routes';

import { useSelector } from 'react-redux';
function App() {
  const user = useSelector((state) => state.auth.user);
  const theme = 'default';
  return (
    <div className={`${theme}-theme app`}>
      <Routes user={user} />
    </div>
  );
}

export default App;
