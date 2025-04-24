import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getTokenTVLStatistics,
  getTokenVOLStatistics,
} from '@/services/explore';
import { Recently } from '@/types/explore';

const useExplore = () => {
  const { data: tvls, mutate: getTvls } = useMutation({
    mutationFn: getTokenTVLStatistics,
  });

  const { data: vols, mutate: getVols } = useMutation({
    mutationFn: getTokenVOLStatistics,
  });

  useEffect(() => {
    getTvls({ recently: Recently.day });
    getVols({ recently: Recently.day });
  }, []);

  return {
    tvls,
    vols,
    getTvls,
    getVols,
  };
};

export default useExplore;
