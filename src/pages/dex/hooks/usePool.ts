import { useMutation } from '@tanstack/react-query';
import { getAllPools } from '@/services/pool.ts';
import { useEffect, useState } from 'react';

const usePool = () => {
  const [poolType, setPoolType] = useState('0');
  const [time, setTime] = useState('24H');
  const { data, mutate, isPending } = useMutation({ mutationFn: getAllPools });
  useEffect(() => {
    mutate({ pageNum: 1, pageSize: 100 });
  }, []);

  const onPoolChange = (type: string) => {
    setPoolType(type);
    mutate({ pageNum: 1, pageSize: 100 });
  };
  const onTimeChange = (time: string) => {
    setTime(time);
    mutate({ pageNum: 1, pageSize: 100 });
  };

  const onSearch = (value: string) => {
    console.log(value);
    mutate({ pageNum: 1, pageSize: 100 });
  };
  return {
    pools: data?.items || [],
    total: data?.total || 0,
    isPending,
    onPoolChange,
    onSearch,
    poolType,
    time,
    onTimeChange,
  };
};

export default usePool;
