import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { App, Button, ConfigProvider, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import "./imagesTable.scss"
import Search, { SearchProps } from 'antd/es/input/Search';
import ImagesModal from '../imagesModal/ImagesModal';
import { getImages, removeImages, saveImage } from '../../request/apis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { openErrorNotification, openSuccessMessage } from '../prompt/Prompt';
import { handleErrorMsg } from '../../utils/util';
import ProcessModal from '../processModal/ProcessModal';
import ImagesUpload from '../imagesUpload/ImagesUpload';
import { BoxPlotTwoTone, InteractionTwoTone, TagsTwoTone } from '@ant-design/icons';

const colors:string[]= ['geekblue','green','volcano']
// const twoColors = { '0%': '#108ee9', '100%': '#87d068' };
// TODO just a fake tips 
const PullRegistry = import.meta.env.VITE_REGISTRY_SCHEME

interface DataType {
  Containers: number;
  Created: number;
  Id: string;
  Labels: object|null;
  ParentId: string;
  RepoDigests: string[]|null;
  RepoTags: string[];
  SharedSize: number;
  Size: number;
  VirtualSize: number;
}

const ImageTable = () => {

  const queryClient = useQueryClient();
  const { message,notification } = App.useApp();
  const searhInputEl: MutableRefObject<any>  = useRef(null);

  const columns: ColumnsType<DataType> = [
    {
      title: '镜像ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (text) => <Tooltip placement="topLeft" title={text}><span>{text}</span></Tooltip>,
      ellipsis: true,
      fixed: 'left',
      width: 100,
      responsive: ['md'],
    },
    {
      title: '镜像标签',
      key: 'RepoTags',
      dataIndex: 'RepoTags',
      render: (_, { RepoTags }) => (
        <>
          {RepoTags.map((tag) => {
            return (
              <Tag color={colors[0]} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
      // ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" key={record.Id}>
          <Button type="link" onClick={()=>newTag(record.Id)}>新增标签</Button>
          <Button type="link" onClick={()=>newPush(record.RepoTags)}>镜像推送</Button>
          <Button type="text" loading={downloadingIds.includes(record.Id)} onClick={()=>{
              if(downloadingIds.length<1){
                // 这里是未来可能支持多个同时下载的准备
                setDownloadingIds([...downloadingIds,record.Id])
                downloadMutation.mutateAsync([record.RepoTags[0]]).then(()=>{
                  setDownloadingIds(downloadingIds.filter(id => id !== record.Id))
                }).catch(()=>{
                  setDownloadingIds(downloadingIds.filter(id => id !== record.Id))
                })
              } else {
                openErrorNotification(notification,"下载失败","等待其他下载任务结束")
              }
          }}>
              {downloadingIds.includes(record.Id)? '下载中' : '下载'}
          </Button>
        </Space>
      ),
      fixed: 'right',
      width: 300,
      responsive: ['md'],
    },
  ];

  // 多选
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  // 批量 选择
  const batchDownLoad = () => {
    if(downloadingIds.length<1){
      setLoading(true);
      // ajax request after empty completing
      let imageNames:string[] = []
      let imageIds:string[] = []
      images.data.map((image:any)=>{
        let temp:any = selectedRowKeys.find((id)=>{
          return image.Id == id
        })
        if(temp){
          // TODO select Name
          imageNames.push(image.RepoTags[0])
          imageIds.push(image.Id)
        }
      })
      setDownloadingIds([...imageIds])

      downloadMutation.mutateAsync(imageNames).then(()=>{
        // 取消 按钮 Loading 和 多选
        setLoading(false);
        setSelectedRowKeys([]);
        setDownloadingIds([])
      }).catch(()=>{
        setLoading(false);
        setDownloadingIds([])
      })
    } else {
      openErrorNotification(notification,"下载失败","等待其他下载任务结束")
    }
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  
  // 查询
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    // 来源 info?.source 判断是 输入 还是 清空搜索
    if (info?.source === 'clear') {
      searhInputEl.current.input.value = value
    }
    queryClient.invalidateQueries({ queryKey: ["images"] })
  }

  // 批量删除
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    removeMutation.mutateAsync(selectedRowKeys as string[]).then(()=>{
      // 取消 按钮 Loading 和 多选
      setOpen(false);
      setConfirmLoading(false);
      setSelectedRowKeys([]);
    }).catch(()=>{
      setConfirmLoading(false);
      setOpen(false);
    })
  };
  const handleCancel = () => {
    setOpen(false);
  };

  // 弹框 拉取
  const [openModalLoad, setOpenModalLoad] = useState(false);
  const showModalLoad = () => {
    setOpenModalLoad(true);
  };

  // 弹框 拉取
  const [openModal, setOpenModal] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };

  // 弹框 标签
  const newTag = (id:string)  => {
    setOpenModalNewTag(true)
    setNewTagImageId(id)
  };
  const [openModalNewTag, setOpenModalNewTag] = useState(false);
  const [newTagImageId, setNewTagImageId] = useState("");

  // 弹框 推送
  const newPush = (tags:string[])  => {
    setOpenModalNewPush(true)
    let list:{
      label: string;
      value: string;
    }[]=[]
    tags.map(
      (tag) => (list.push({label: tag,value: tag,}))
    )
    setNewPushImageTags(list as any)
  };
  const [openModalNewPush, setOpenModalNewPush] = useState(false);
  const [newPushImageTags, setNewPushImageTags] = useState([]);

  // 查询所有镜像
  const images = useQuery({
    queryKey:["images"],
    queryFn: ()=>getImages(searhInputEl.current.input.value),
    retry: 0
  })

  // 处理 useQuery ERROR的方法
  useEffect(() => {
    if(images.isError){
      openErrorNotification(notification,"查询镜像失败",handleErrorMsg(images.error))
    }
  },[images.isError])

  // 处理 镜像下载
  const [downLoadProcess, setDownLoadProcess] = useState(0)
  const [downLoadProcessStatus, setDownLoadProcessStatus] = useState(undefined)
  const [openDownloadProcessModal, setOpenDownloadProcessModal] = useState(false)
  const [downloadingIds, setDownloadingIds] = useState([] as string[])
  const downloadMutation = useMutation({
    mutationFn: (images:string[])=> saveImage(setDownLoadProcess,images),
    onSuccess: (response)=>{
      const href = window.URL.createObjectURL(response.data)
      const anchorElement = document.createElement('a')
      anchorElement.href = href
      const disposition = response.headers['content-disposition']
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = fileNameRegex.exec(disposition);
      const fileName = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'images.tar'
      anchorElement.download = fileName;
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
      // 多余
      // openSuccessMessage(message,"下载成功!")
      setDownLoadProcessStatus('success' as any)
      setTimeout(()=>{
        setOpenDownloadProcessModal(false)
      },2000)
    },
    onError: (error:any)=>{
      openErrorNotification(notification,"下载失败",handleErrorMsg(error))
      setDownLoadProcessStatus('exception' as any)
      setTimeout(()=>{
        setOpenDownloadProcessModal(false)
      },2000)
    },
    onMutate: ()=>{
      setDownLoadProcess(0)
      setDownLoadProcessStatus('active' as any)
      setOpenDownloadProcessModal(true)
    }
  })

  // 处理 批量删除
  const removeMutation = useMutation({
    mutationFn: (imagesIds:string[])=> removeImages(imagesIds),
    onSuccess: ()=>{
      openSuccessMessage(message,"删除成功,2s后自动刷新镜像列表")
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ["images"] })
      },2000)
    },
    onError: (error:any)=>{
      openErrorNotification(notification,"删除失败",handleErrorMsg(error))
    }
  })

  return (
    <div className="imagesTable">
      <ConfigProvider
            theme={{
              components: {
                Table: {
                  borderColor: "#ddd",
                },
                Typography: {
                },
              },
            }}
        >
        <Space size="middle">

          <Button type="primary" onClick={showModalLoad} >
            镜像上传
          </Button>

          <Button type="primary" onClick={showModal} >
            镜像拉取
          </Button>

          <Button type="primary" onClick={batchDownLoad} disabled={!hasSelected} loading={loading}>
            批量下载
          </Button>

          <Popconfirm
            title="警告"
            description="确定删除所有被选镜像吗?"
            placement="leftTop"
            open={open}
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
          >
            <Button 
              type="primary" 
              danger 
              onClick={showPopconfirm}
              disabled={!hasSelected}
              >
              批量删除
            </Button>
          </Popconfirm>
        </Space>
        <Space size="middle">
          <Search
            allowClear
            placeholder="请输入标签关键字"
            onSearch={onSearch}
            enterButton
            loading={images.isFetching}
            ref = {searhInputEl}
          />
        </Space>
        <Table 
          size="small"
          loading={images.isFetching}
          rowKey={recode=> recode.Id}
          rowSelection={rowSelection}
          scroll={{ x: 1000, y: "calc(40vh)" }}
          columns={columns} 
          pagination={{
            size: "default",
            showTotal: (total) => `本地镜像总数 [ ${total} ]`,
            total: images.data?.length,
            onShowSizeChange:()=>{console.log("page size change ,can reajax here")},
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50, 100]
          }} 
          dataSource={images.data} />

        <ImagesModal
          title={<><InteractionTwoTone /> 镜像拉取</>}
          placeholder="请输入需要拉取的镜像标签"
          openModal={openModal}
          setOpenModal={setOpenModal}
          operation="pull"
          registry={PullRegistry}
        />

        <ImagesModal
          title={<><TagsTwoTone /> 新增标签</>}
          placeholder="请输需要为当前镜像新增的标签"
          openModal={openModalNewTag}
          setOpenModal={setOpenModalNewTag}
          operation="tag"
          imageId={newTagImageId}
        />

        <ImagesModal
          title={<><BoxPlotTwoTone /> 镜像推送</>}
          placeholder="请选择需要推送的镜像标签"
          openModal={openModalNewPush}
          setOpenModal={setOpenModalNewPush}
          operation="push"
          tags={newPushImageTags}
        />

        {/* 暂时控制只能单个下载单个展示进度 */}
        <ProcessModal
          openModal={openDownloadProcessModal}
          operation="download"
          setOpenModal={setOpenDownloadProcessModal}
          process={Math.trunc(downLoadProcess*100)}
          processStatus={downLoadProcessStatus}
        />

        <ImagesUpload
          openModal={openModalLoad}
          setOpenModal={setOpenModalLoad}
        />
      </ConfigProvider>
    </div>
  )
}

export default ImageTable