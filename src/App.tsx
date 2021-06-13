import React from 'react';

import { useInit } from './hooks/useInit'
import { useSelector } from './redux/store';

import { Routes } from './routes';

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
