import React from 'react';
import { Spin } from 'antd';
import 'antd/lib/spin/style/css';
import './PageLoader.css';
export const PageLoader = () => (
  <div className="page-loader">
    <Spin size="large" />
  </div>
);
