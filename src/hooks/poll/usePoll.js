import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { pollAPI } from '../../services/api';

export default (businessData) => {
  const { priorityBox } = businessData;
  const { pollsById, polls } = priorityBox || {};
  const { search } = useLocation();
  const { contestUUID } = useParams();
  const [poll, setPoll] = useState(null);
  const [pollResult, setPollResult] = useState(null);
  const [choice, setChoice] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!poll && polls.length && contestUUID && pollsById[contestUUID] !== undefined) {
      setPoll(pollsById[contestUUID]);
    }
  }, [businessData]);
  const handlePollSubmit = (user) => {
    if (user && user.uid && choice && poll && poll.contestUUID) {
      setLoading(true);
      pollAPI
        .submitPoll({
          choice,
          UID: user.uid,
          uuid: poll.contestUUID
        })
        .then(({ data }) => {
          setLoading(false);
          if (data) {
            setLoading(false);
            setPollResult(data);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return [poll, choice, setChoice, pollResult, loading, setLoading, handlePollSubmit];
};
