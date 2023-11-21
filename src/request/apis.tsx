import { QueryFunction } from "@tanstack/react-query"
import axios from "axios"

// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

const mdcServer = "http://127.0.0.1:8080"

// router.GET("/images/list", server.listImage)
// router.POST("/images/pull", server.pullImage)
// router.POST("/images/pull/auth", server.pullImageWithAuth)
// router.POST("/images/create/tag", server.tagImage)
// router.POST("/images/save", server.saveImage)
// router.POST("/images/load", server.loadImage)
// router.POST("/images/push", server.pushImage)
// router.POST("/images/push/auth", server.pushImageWithAuth)

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

export const uploadLoadAction= `${mdcServer}`+"/images/load"