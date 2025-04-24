import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import useTxStore from '@/store/pending.ts';
import { WriteContractErrorType } from 'viem';
import usePendingNotice from '@/components/notices/usePendingNotice.tsx';

const extraError = (error: WriteContractErrorType) => {
  const split = `Contract Call:`;
  return (
    error.message.split(split)[0] ||
    'Unknown error. please check the logs or contact support'
  );
};

const useXSendTransaction = ({
  showSubmittedModal = true,
  globalNotice = true,
  onSubmitted,
  onWriteSuccess,
  onError,
}: {
  showSubmittedModal?: boolean;
  globalNotice?: boolean;
  pendingPool?: boolean;
  onSubmitted?: (hash: string) => void;
  onWriteSuccess?: (e: any) => void;
  onError?: (e: WriteContractErrorType) => void;
}) => {
  const { writeTxErrorNotification, writeTxNotification } = usePendingNotice();
  const updateSubmitted = useTxStore((state) => state.updateSubmitted);
  const {
    sendTransactionAsync,
    isError,
    error: submittedError,
    data: hash,
    isSuccess: isSubmitted,
    isPending: isSubmittedLoading,
  } = useSendTransaction();
  const {
    isSuccess,
    data: writeEvent,
    error: writeError,
    isError: isWriteError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isError) {
      onError?.(submittedError as WriteContractErrorType);
      writeTxErrorNotification(
        hash,
        extraError(submittedError as WriteContractErrorType)
      );
    }
  }, [submittedError, isError]);

  useEffect(() => {
    if (isWriteError) {
      onError?.(writeError as WriteContractErrorType);
      writeTxErrorNotification(
        hash,
        extraError(writeError as WriteContractErrorType)
      );
    }
  }, [writeError, isWriteError]);

  useEffect(() => {
    if (isSuccess && hash && globalNotice) {
      // pendingPool
      // TODO collect 2 pools
      writeTxNotification(hash);
      onWriteSuccess?.(writeEvent);
    }
  }, [isSuccess, hash, globalNotice]);

  useEffect(() => {
    if (isSubmitted && showSubmittedModal) {
      updateSubmitted({ hash });
      onSubmitted?.(hash);
    }
  }, [isSubmitted, showSubmittedModal]);

  return {
    hash,
    submittedError,
    writeError,
    writeEvent,
    isSubmitted,
    isSuccess,
    isSubmittedLoading,
    sendTransactionAsync,
  };
};

export default useXSendTransaction;
