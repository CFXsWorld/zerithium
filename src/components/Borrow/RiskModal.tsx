import { Modal, Progress } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import useRiskProgress, {
  ProgressSegment,
} from '@/components/Borrow/useRiskProgress.ts';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useAccount, useReadContract } from 'wagmi';
import { Abi, Address } from 'viem';
import { useMemo } from 'react';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { useTranslate } from '@/i18n';
const HealthFactorInfo = ({
  segments,
  userPercent,
  userHealthFactor,
}: {
  userPercent: number;
  segments: ProgressSegment[];
  userHealthFactor: number;
}) => {
  const { t } = useTranslate();
  return (
    <div className="flex  flex-col gap-[8px] rounded-[8px] border border-line-primary p-[12px]">
      <div className="text-[16px]">{t('lending.health.factor')}</div>
      <div className="flex flex-col">
        <div className="text-[14px] text-tc-secondary">
          {t('lending.health.factor.detail')}
        </div>

        <div className="relative mt-[20px] h-[70px] py-[10px]">
          <div
            className="absolute  flex h-[36px] flex-col items-center text-[12px]"
            style={{
              left: `${userPercent * 96}%`,
            }}
          >
            <span
              className="absolute top-[-15px] line-clamp-1 flex w-[100px] whitespace-nowrap text-center text-[12px]  "
              style={{
                transform: 'translateX(15%)',
              }}
            >
              <span className="pr-[3px]">{`${t('lending.health.your')}:`}</span>
              <HealthFactor
                value={formatNumber(userHealthFactor || 0, 2).toString()}
              />
            </span>
            <span className="text-tc-secondary">
              <CaretDownOutlined />
            </span>
          </div>
          <div className="absolute top-[16px] w-full">
            <Progress
              percent={100}
              status="active"
              strokeColor={{ from: 'rgba(230, 93, 93, 1)', to: '#87d068' }}
              showInfo={false}
            />
          </div>
          {segments.map((item) => (
            <div
              className="absolute top-[32px] flex flex-col items-center justify-center"
              key={item.value}
              style={{
                left: `${item.percent * 100}%`,
              }}
            >
              {item.label !== '10' && (
                <div className="relative">
                  <span className="flex h-[8px] w-[2px] rounded-[2px] bg-tc-secondary" />
                  <span
                    className="absolute text-[12px]"
                    style={{
                      transform: 'translateX(-50%)',
                      color: item.color ?? 'auto',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-left  text-status-error">
          {t('lending.health.liquidation.value')}: 1.0
        </p>
      </div>
    </div>
  );
};

const CurrentLTV = ({
  userValueUsedRatio,
  userMaxUsedRatio,
  tokenLiquidateRatio,
}: {
  userValueUsedRatio: number;
  userMaxUsedRatio: number;
  tokenLiquidateRatio: number;
}) => {
  const { t } = useTranslate();
  return (
    <div className="flex  flex-col gap-[8px] rounded-[8px] border border-line-primary p-[12px]">
      <div className="text-[16px]">{t('lending.health.LTV')}</div>
      <div className="flex flex-col">
        <div className="text-[14px] text-tc-secondary">
          {t('lending.health.LTV.detail')}
        </div>

        <div className="relative mt-[30px] h-[70px] py-[10px]">
          <div
            className="absolute  flex h-[36px] flex-col items-center text-[12px]"
            style={{
              left: `${userValueUsedRatio}%`,
            }}
          >
            <div className="relative">
              <span
                className="absolute top-[-15px] line-clamp-1  flex w-[150px] flex-col text-left text-[12px]  "
                style={{
                  transform: 'translateX(-10%)',
                }}
              >
                {`${t('lending.health.your')}: ${formatNumber(userValueUsedRatio || 0, 2)}`}
              </span>
              <span className="text-tc-secondary">
                <CaretDownOutlined />
              </span>
            </div>
          </div>

          <div className="absolute top-[16px] w-full">
            <Progress
              percent={100}
              status="active"
              strokeColor={{ from: 'rgba(230, 93, 93, 1)', to: '#87d068' }}
              showInfo={false}
            />
          </div>
          <div
            className="absolute top-[32px]  flex h-[36px] flex-col items-center text-[12px]"
            style={{
              left: `${userMaxUsedRatio || 95}%`,
            }}
          >
            <div className="relative">
              <span className="flex h-[18px] w-[2px] rounded-[2px] bg-tc-secondary" />
              <span
                className="absolute top-[22px] line-clamp-1 flex w-[100px] text-[12px]"
                style={{
                  transform: 'translateX(-20%)',
                }}
              >
                {`${t('dex.swap.token.select.max')}: ${formatNumber(userMaxUsedRatio || 0, 2) || t('lending.health.fine')}`}
              </span>
            </div>
          </div>
          <div
            className="absolute top-[32px] flex flex-col items-center justify-center"
            style={{
              left: `${tokenLiquidateRatio}%`,
            }}
          >
            <div className="relative">
              <span className="flex h-[8px] w-[2px] rounded-[2px] bg-tc-secondary" />
              <span
                className="absolute text-[12px]"
                style={{
                  transform: 'translateX(-50%)',
                }}
              >
                {`${tokenLiquidateRatio}`}
              </span>
            </div>
          </div>
        </div>
        <p className="text-left  text-status-error">
          {t('lending.health.liquidation.threshold')}:
          {` ${tokenLiquidateRatio}`}
        </p>
      </div>
    </div>
  );
};

const RiskModal = ({
  open,
  onClose,
  userHealthFactor,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  userHealthFactor: number;
  contact: {
    abi: Abi;
    address: Address;
  };
}) => {
  const { t } = useTranslate();
  const { userPercent, segments } = useRiskProgress({
    userHealthFactor: userHealthFactor || 0,
  });

  const { address } = useAccount();
  const { data: overview } = useReadContract({
    address: contact.address,
    abi: contact.abi,
    functionName: 'usersRiskDetails',
    args: [address!],
  });

  const userValueUsedRatio = useMemo(() => {
    const value = (overview as bigint[])?.[1] || 0;
    if (value) {
      return Number(String(value)) / 100;
    }
    return 0;
  }, [overview]);

  const userMaxUsedRatio = useMemo(() => {
    const value = (overview as bigint[])?.[2] || 0;
    if (value) {
      return Number(String(value)) / 100;
    }
    return 0;
  }, [overview]);

  const tokenLiquidateRatio = useMemo(() => {
    const value = (overview as bigint[])?.[3] || 0;
    if (value) {
      return Number(String(value)) / 100;
    }
    return 0;
  }, [overview]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('lending.health.risk.title')}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-[20px]">
        <div className="mt-[20px]">
          <p>{t('lending.health.risk.description')}</p>
        </div>
        <HealthFactorInfo
          segments={segments}
          userPercent={userPercent}
          userHealthFactor={userHealthFactor}
        />
        <CurrentLTV
          userValueUsedRatio={userValueUsedRatio}
          userMaxUsedRatio={userMaxUsedRatio}
          tokenLiquidateRatio={tokenLiquidateRatio}
        />
      </div>
    </Modal>
  );
};

export default RiskModal;
