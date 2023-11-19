import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { App, Button, ConfigProvider, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import "./dataTable.scss"
import Search, { SearchProps } from 'antd/es/input/Search';
import DataModal from '../dataModal/DataModal';
import { getImages, saveImage } from '../../request/apis';
import { QueryFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { openErrorNotification, openSuccessMessage } from '../prompt/Prompt';
import { handleErrorMsg } from '../../utils/util';

const colors:string[]= ['geekblue','green','volcano']

const PullRegistry ="https://docker.io/"
const PushRegistry ="https://docker.io/"

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

const data: DataType[] = [
    {
      "Containers": -1,
      "Created": 1700152410,
      "Id": "sha256:3f39be3950d4169b5eb8fd91574c9e3588482df2c982d062dd99994244e7b98f",
      "Labels": {
          "com.docker.compose.project": "learn-go-project",
          "com.docker.compose.service": "api",
          "com.docker.compose.version": "2.15.1"
      },
      "ParentId": "",
      "RepoDigests": null,
      "RepoTags": [
          "learn-go-project-api:latest1",
          "learn-go-project-api:latest2",
          "learn-go-project-api:latest3",
          "learn-go-project-api:latest4"
      ],
      "SharedSize": -1,
      "Size": 70397855,
      "VirtualSize": 70397855
  },
  {
      "Containers": -1,
      "Created": 1700151164,
      "Id": "sha256:866b7c725d437b8e3a45c4107e7fb474ed512b9b006968dbf17020853302e7fa",
      "Labels": null,
      "ParentId": "",
      "RepoDigests": null,
      "RepoTags": [
          "test:latest"
      ],
      "SharedSize": -1,
      "Size": 19357569,
      "VirtualSize": 19357569
  },
];
const DataTable = () => {
  const queryClient = useQueryClient();
  const { message, notification } = App.useApp();
  const searhInputEl: MutableRefObject<any>  = useRef(null);

  const columns: ColumnsType<DataType> = [
    {
      title: '镜像ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (text) => <Tooltip placement="topLeft" title={text}><span>{text}</span></Tooltip>,
      ellipsis: true,
      fixed: 'left',
      width: 200,
    },
    {
      title: '镜像标签',
      key: 'RepoTags',
      dataIndex: 'RepoTags',
      render: (_, { RepoTags }) => (
        <>
          {RepoTags.map((tag) => {
            let randomInt = Math.floor(Math.random()*3)
            let color = colors[randomInt]
            return (
                <Tag color={color} key={tag}>
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
          <Button type="text" onClick={()=>downloadMutation.mutate([record.RepoTags[0]])}>
              下载
          </Button>
        </Space>
      ),
      fixed: 'right',
      width: 200,
    },
  ];

  // 多选
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  // 批量 选择
  const batchDownLoad = () => {
    setLoading(true);
    // ajax request after empty completing
    let imageNames:string[] = []
    images.data.map((image:any)=>{
      let temp:any = selectedRowKeys.find((id)=>{
        return image.Id == id
      })
      if(temp){
        // TODO select Name
        imageNames.push(image.RepoTags[0])
      }
    })
    downloadMutation.mutateAsync(imageNames).then(()=>{
      // 取消 按钮 Loading 和 多选
      setLoading(false);
      setSelectedRowKeys([]);
    })
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
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  // 弹框
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
  // TODO 单个下载 增加 Loading
  const downloadMutation = useMutation({
    mutationFn: (images:string[])=> saveImage(images),
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
      openSuccessMessage(message,"下载成功!")
    },
    onError: (error:any)=>{
      openErrorNotification(notification,"下载失败",handleErrorMsg(error))
    },
  })

  return (
    <div className="dataTable">
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
          <Button type="primary" onClick={showModal} >
            镜像拉取
          </Button>

          <Button type="primary" onClick={batchDownLoad} disabled={!hasSelected} loading={loading}>
            批量下载
          </Button>

          <Popconfirm
            title="警告"
            description="确认删除所有被选镜像吗?"
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
              // TODO
              // disabled={!hasSelected}
              disabled={true}
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
          scroll={{ x: 1000, y: 600 }}
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

        <DataModal
          title="镜像拉取"
          placeholder="请输入需要拉取的镜像标签"
          openModal={openModal}
          setOpenModal={setOpenModal}
          operation="pull"
          registry={PullRegistry}
        />

        <DataModal
          title="新增标签"
          placeholder="请输需要为当前镜像新增的标签"
          openModal={openModalNewTag}
          setOpenModal={setOpenModalNewTag}
          operation="tag"
          imageId={newTagImageId}
          registry={PushRegistry}
        />
      </ConfigProvider>
    </div>
  )
}

export default DataTable