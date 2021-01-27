import { useEffect, useState } from 'react';
import { getQueryStringParams } from '../utils/helpers';

export default () => {
  const [qsParams, setQsParams] = useState(null);
  useEffect(() => {
    setQsParams(getQueryStringParams());
  }, []);
  return qsParams;
};
