import { App, Modal, Space, message } from "antd"
import React, { useState } from 'react';
import { FileZipTwoTone, StarOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { uploadLoadAction } from "../../request/apis";
import { openErrorMessage, openErrorNotification, openSuccessMessage } from "../prompt/Prompt";
import { useQueryClient } from "@tanstack/react-query";
import "./imagesUpload.scss"

type Props = {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const allowUploadFileType = ['application/x-gzip','application/x-tar']

const ImagesUpload = (prop:Props) => {
  const { message,notification } = App.useApp();
  const queryClient = useQueryClient();
  const props: UploadProps = {
    beforeUpload: (file) => {
      const allow = allowUploadFileType.includes(file.type);
      if (!allow) {
        openErrorMessage(message,'非gz或tar结尾文件不允许上传');
      }
      return allow || Upload.LIST_IGNORE;
    },
    maxCount: 3,
    name: 'file',
    listType: "picture",
    action: uploadLoadAction,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        openSuccessMessage(message,`${info.file.name} 镜像包上传成功,2s后自动刷新镜像列表`)
        setTimeout(()=>{
          queryClient.invalidateQueries({ queryKey: ["images"] })
        },2000)
      } else if (info.file.status === 'error') {
        openErrorNotification(notification,"镜像包上传失败",info.file.response?.error)
      }
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  const handleModalCancel = () => {
    prop.setOpenModal(false)
  }

  return (
      <Modal
        title={<><FileZipTwoTone /> 镜像上传</>}
        open={prop.openModal}
        onCancel={handleModalCancel}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            返回
          </Button>
        ]}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <br/>
          <Upload {...props}>
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>
          <br/>
        </Space>
      </Modal>
  )
}

export default ImagesUpload