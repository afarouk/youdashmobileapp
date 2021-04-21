import React from 'react';
import { useSelector } from 'react-redux';

import { Routes } from './routes';
import useInit from './hooks/useInit'

function App() {
  const user = useSelector((state) => state.auth.user);
  const theme = 'default';

  useInit();

  return (
    <div className={`${theme}-theme app`}>
      <Routes user={user} />
    </div>
  );
}

export default App;
