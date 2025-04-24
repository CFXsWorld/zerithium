import { Button, Input, message, Upload, UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTranslate } from '@/i18n';
import { getCSRF, uploadIcon } from '@/services/token';
import { useAccount } from 'wagmi';

const { Dragger } = Upload;

const UploadInfo = ({
  tokenAddress,
  lpAddress,
}: {
  tokenAddress?: string;
  lpAddress?: string;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { address } = useAccount();

  const { t } = useTranslate();

  const handleUpload = async () => {
    if (fileList.length && tokenAddress && address && lpAddress) {
      setUploading(true);
      const { data: csrf } = await getCSRF();
      if (csrf) {
        uploadIcon(csrf, {
          file: fileList[0] as unknown as File,
          token: tokenAddress,
          address: address + '',
        })
          .then(() => {
            setFileList([]);
            message.success('upload successfully.');
          })
          .catch(() => {
            message.error('upload failed.');
          })
          .finally(() => {
            setUploading(false);
          });
      }
    }
  };

  const props: UploadProps = {
    multiple: false,
    maxCount: 1,
    listType: 'picture',
    accept: 'image/png, image/jpeg, image/svg, image/jpg',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (file.size > 200 * 1024) {
        return;
      }
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };
  return (
    <div className="mt-[20px] flex flex-col gap-[10px]">
      <div className="font-normal">{t('dex.pools.info')}</div>
      <div className="flex-center-between text-tc-secondary">
        <div className="flex-center ">
          <span className="text-red-600">*</span>
          <span>Token Address</span>
        </div>
      </div>
      <div>
        <Input
          value={tokenAddress || ''}
          disabled
          size="large"
          className="h-[48px]"
        />
      </div>
      <div>
        <Dragger {...props}>
          <div className="flex flex-1 flex-col items-start">
            <p className="">
              <UploadOutlined />
            </p>
            <p className="ant-upload-hint">
              {t('common.upload.limit', { size: '200KB' })}
            </p>
            <p className="ant-upload-hint">
              {t('common.upload.accept', { accept: 'jpg, jpeg, png, svg' })}
            </p>
          </div>
        </Dragger>
      </div>
      <div className="mt-[20px] w-full">
        <Button
          type="primary"
          size="large"
          className="w-full"
          loading={uploading}
          disabled={!tokenAddress || !lpAddress || !fileList?.length}
          onClick={() => {
            handleUpload();
          }}
        >
          {t('common.submit')}
        </Button>
      </div>
    </div>
  );
};

export default UploadInfo;
