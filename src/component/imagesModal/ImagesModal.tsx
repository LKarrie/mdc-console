import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { App, Input, InputRef, Modal, Select, Space } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pullImage, pushImage, tagImage } from '../../request/apis';
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
  registry?: string,
  tags?: KeyValue[],
}

interface KeyValue {
  label: string;
  value: string;
}

const ImageModal = (prop:Props) => {
  const { message, notification } = App.useApp()
  // 弹框
  const [confirmLoadingModal, setConfirmLoadingModal] = useState(false)
  const [okReady, setOkReady] = useState(false)
  // 会导悬浮页面重复渲染 is not good
  // const [value, setValue] = useState("");
  const inputEl = useRef<InputRef>(null);

  const queryClient = useQueryClient();
  const pullMutation = useMutation({
    mutationFn:(imageName:string)=>pullImage(imageName),
    onSuccess: ()=>{
      openSuccessMessage(message,"拉取成功,2s后自动刷新镜像列表")
      // 拉取可能会多次操作 所以不自动关闭
      // prop.setOpenModal(false)
      setConfirmLoadingModal(false)
      // 拉取镜像后 docker 需要等待docker接口刷新 即刻刷新还会是旧数据 太快了
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ["images"] })
      },2000)
    },
    onError: (error)=>{
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
      // Tag 应该只会新增一次 自动关闭
      prop.setOpenModal(false)
      setConfirmLoadingModal(false)
      // 删除镜像后 docker 需要等待docker接口刷新 即刻刷新还会是旧数据 太快了
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ["images"] })
      },2000)
    },
    onError: (error)=>{
      setConfirmLoadingModal(false)
      openErrorNotification(notification,"新增失败",handleErrorMsg(error))
    },
    onMutate: ()=>{
      setConfirmLoadingModal(true)
    }
  })
  const pushMutation = useMutation({
    mutationFn: (imageName:string)=> pushImage(imageName as string),
    onSuccess: ()=>{
      openSuccessMessage(message,"推送成功!")
      // Push 应该只会推一次 自动关闭
      prop.setOpenModal(false)
      setConfirmLoadingModal(false)
    },
    onError: (error)=>{
      setConfirmLoadingModal(false)
      openErrorNotification(notification,"推送失败",handleErrorMsg(error))
    },
    onMutate: ()=>{
      setConfirmLoadingModal(true)
    }
  })

  const handleModalOk = () => {
    setConfirmLoadingModal(true)
    if (prop.operation === "tag"){
      tagMutation.mutate(inputEl.current?.input?.value as string)
    } else if (prop.operation === "pull") {
      pullMutation.mutate(inputEl.current?.input?.value as string)
    } else {
      pushMutation.mutate(selected)
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

  // 推送镜像相关
  const [selected, setSelected] = useState('');
  const onChangePush = (value: string) => {
    setSelected(value)
  };
  
  // const onSearchPush = (value: string) => {
  //   console.log('search:', value);
  // };
  
  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (prop.tags && prop.tags[0]){
      setSelected(prop.tags[0].value)
      setOkReady(true)
    }
  }, [prop.tags])
  

  return (
      <div className="imageModal">
        <Modal
          // centered
          title={prop.title}
          open={prop.openModal}
          onOk={handleModalOk}
          confirmLoading={confirmLoadingModal}
          onCancel={handleModalCancel}
          okButtonProps={{ disabled: (!okReady)}}
          destroyOnClose={prop.operation==="push"}
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <br/>
              { prop.operation != "push" ?
              <Input 
                addonBefore={prop.registry ? prop.registry : "https://docker.io/"}
                placeholder={prop.placeholder} 
                onChange={onChange} 
                ref = {inputEl}
                allowClear
                onPressEnter={handleModalOk}
                />
              :
              <Select
                style={{ width: '100%' }}
                showSearch
                placeholder={prop.placeholder} 
                optionFilterProp="children"
                onChange={onChangePush}
                // onSearch={onSearchPush}
                filterOption={filterOption}
                options={prop.tags}
                defaultValue={selected}
              />
              } 
            <br/>
          </Space>
        </Modal>
      </div>
  )
}

export default ImageModal