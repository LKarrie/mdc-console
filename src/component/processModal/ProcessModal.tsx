import React, { MutableRefObject, useRef, useState } from 'react';
import { App, Button, ConfigProvider, Input, Modal, Popconfirm, Progress, Space, Table, Tag, Tooltip, message,} from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pullImage, tagImage } from '../../request/apis';
import { openErrorNotification, openSuccessMessage } from '../prompt/Prompt';
import { handleErrorMsg } from '../../utils/util';
import "./processModal.scss"

const twoColors = { '0%': '#108ee9', '100%': '#87d068' };

type Props = {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  operation: string,
  process: number,
  processStatus: 'normal' | 'exception' | 'active' | 'success' | undefined
}

const ProcessModal = (prop:Props) => {
  const handleCancel = () => {
    prop.setOpenModal(false);
  }

  return (

      <Modal
        title={prop.operation === 'download' ? '下载进度' : '进度展示'}
        open={prop.openModal}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
        ]}
      >
        <Progress percent={prop.process} status={prop.processStatus} strokeColor={twoColors} />
      </Modal>

  )
}

export default ProcessModal