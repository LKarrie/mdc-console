import { MessageInstance } from "antd/es/message/interface";
import { IconType, NotificationInstance } from "antd/es/notification/interface";
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const NotificationType = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export function openErrorNotification (notification: NotificationInstance,title:string, description:string){
  notification.open({
    type: NotificationType.ERROR as IconType ,
    message: title,
    description:description,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
} 

export function openSuccessMessage (message:MessageInstance,text:string){
  message.success(text);
} 

export function openInfoMessage (message:MessageInstance,text:string){
  message.info(text);
} 

export function openErrorMessage (message:MessageInstance,text:string){
  message.error(text);
} 