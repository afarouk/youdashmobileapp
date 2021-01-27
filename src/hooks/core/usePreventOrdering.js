import { useEffect, useState } from 'react';
import { serviceStatuses } from '../../config/constants';

export default (businessData) => {
  const { serviceStatus } = businessData;
  const [preventOrdering, setPreventOrdering] = useState(false);
  useEffect(() => {
    setPreventOrdering(
      serviceStatus &&
        (serviceStatus === serviceStatuses.CALL_AHEAD || serviceStatus === serviceStatuses.CLOSED)
    );
  }, [serviceStatus]);
  return [preventOrdering, setPreventOrdering];
};
