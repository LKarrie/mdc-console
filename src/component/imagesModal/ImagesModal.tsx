import React, { MutableRefObject, ReactNode, useRef, useState } from 'react';
import { App, Button, ConfigProvider, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip, message,} from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pullImage, tagImage } from '../../request/apis';
import { openErrorNotification, openSuccessMessage } from '../prompt/Prompt';
import { handleErrorMsg } from '../../utils/util';
import "./imagesModal.scss"

type Props = {
  title: ReactNode,
  placeholder: string,
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  operation: string,
  imageId?: string,
  registry: string,
}

const ImageModal = (prop:Props) => {
  const { message, notification } = App.useApp();
  // 弹框
  const [confirmLoadingModal, setConfirmLoadingModal] = useState(false);
  const [okReady, setOkReady] = useState(false);
  // 会导悬浮页面重复渲染 is not good
  // const [value, setValue] = useState("");
  const inputEl: MutableRefObject<any>  = useRef(null);

  const queryClient = useQueryClient();
  const pullMutation = useMutation({
    mutationFn:(imageName:string)=>pullImage(imageName),
    onSuccess: ()=>{
      openSuccessMessage(message,"拉取成功!")
      prop.setOpenModal(false)
      setConfirmLoadingModal(false)
      // 删除镜像后 docker 需要等待docker接口刷新 即刻刷新还会是旧数据 太快了
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ["images"] })
      },2000)
    },
    onError: (error:any)=>{
      setConfirmLoadingModal(false)
      openErrorNotification(notification,"拉取失败",handleErrorMsg(error))
    },
    onMutate: ()=>{
      setConfirmLoadingModal(true)
    }
  })
  const tagMutation = useMutation({
    mutationFn: (imageName:string)=> tagImage(prop.imageId as string,imageName),
    onSuccess: ()=>{
      openSuccessMessage(message,"新增成功!")
      prop.setOpenModal(false)
      setConfirmLoadingModal(false)
      // 删除镜像后 docker 需要等待docker接口刷新 即刻刷新还会是旧数据 太快了
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ["images"] })
      },2000)
    },
    onError: (error:any)=>{
      setConfirmLoadingModal(false)
      openErrorNotification(notification,"新增失败",handleErrorMsg(error))
    },
    onMutate: ()=>{
      setConfirmLoadingModal(true)
    }
  })

  const handleModalOk = () => {
    setConfirmLoadingModal(true)
    if (prop.operation === "tag"){
      tagMutation.mutate(inputEl.current.input.value)
    } else {
      pullMutation.mutate(inputEl.current.input.value)
    }
  }

  const handleModalCancel = () => {
    prop.setOpenModal(false)
  }

  // 标签输入框 改变
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value) {
      setOkReady(true)
    } else {
      setOkReady(false)
    }
  };

  return (
      <div className="imageModal">
        <Modal
          // centered
          title={prop.title}
          open={prop.openModal}
          onOk={handleModalOk}
          confirmLoading={confirmLoadingModal}
          onCancel={handleModalCancel}
          okButtonProps={{ disabled: !okReady }}
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <br/>
              <Input 
                addonBefore={prop.registry}
                placeholder={prop.placeholder} 
                onChange={onChange} 
                ref = {inputEl}
                allowClear
                onPressEnter={handleModalOk}
                />
            <br/>
          </Space>
        </Modal>
      </div>
  )
}

export default ImageModal