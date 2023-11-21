import React, { MutableRefObject, useRef, useState } from 'react';
import { App, Button, ConfigProvider, Input, Modal, Popconfirm, Progress, Space, Table, Tag, Tooltip, message,} from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pullImage, tagImage } from '../../request/apis';
import { openErrorNotification, openSuccessMessage } from '../prompt/Prompt';
import { handleErrorMsg } from '../../utils/util';
import "./processModal.scss"
import { HourglassTwoTone } from '@ant-design/icons';

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
    <div className='processModal'>    
      <Modal
        title={<><HourglassTwoTone /> 下载进度</>}
        open={prop.openModal}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
        ]}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <br/>
            <Progress percent={prop.process} status={prop.processStatus} strokeColor={twoColors} />
          <br/>
        </Space>
      </Modal>
    </div>
  )
}

export default ProcessModal