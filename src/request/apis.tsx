import axios from "axios"

// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
const mdcServer = import.meta.env.VITE_MDC_SERVER+"/mdc/api"

/**
 * 获取所有本地所有镜像列表，分页前端处理
 * @returns 
 */
export async function getImages(key?:string|""){
  let res
  if (key==='') {
    res = await axios.get(`${mdcServer}`+`/images/list`)
  }else{
    res = await axios.get(`${mdcServer}`+`/images/list?key=${key}`)
  }
  return res.data
}

/**
 * 拉取远端仓库镜像，单个
 * @returns 
 */
export async function pullImage(imageName:string){
  const res = await axios.post(`${mdcServer}`+"/images/pull",{
      image_name: imageName,
    }
  )
  return res.data
}

/**
 * 新增标签 单个
 * @returns 
 */
export async function tagImage(imageId:string,target:string){
  const res = await axios.post(`${mdcServer}`+"/images/create/tag",{
      image_id: imageId,
      target: target
    }
  )
  return res.data
}

/**
 * 下载 单个/批量
 * @returns 
 */
export async function saveImage(progressCallBack:React.Dispatch<React.SetStateAction<number>>,images:string[]){
  const res = await axios.post(`${mdcServer}`+"/images/save",{
      images: images
    },
    {
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        progressCallBack && progressCallBack(progressEvent.progress as number)
      },
    }
  )
  return res
}

/**
 * 镜像上传
 */
export const uploadLoadAction= `${mdcServer}`+"/images/load"

/**
 * 镜像推送 单个
 * @returns 
 */
export async function pushImage(imageName:string){
  const res = await axios.post(`${mdcServer}`+"/images/push",{
    image_name: imageName,
    }
  )
  return res.data
}

/**
 * 镜像删除 批量
 * @returns 
 */
export async function removeImages(imageIds:string[]){
  const res = await axios.post(`${mdcServer}`+"/images/remove/batch",{
    image_ids: imageIds,
    }
  )
  return res.data
}