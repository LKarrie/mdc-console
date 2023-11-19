import "./bread.scss"
import { Breadcrumb , ConfigProvider} from 'antd';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {menu} from "../../data"

const Bread = () => {
  let location = useLocation()
  const [items,setItems] = useState()

  useEffect(() => {
    menu.map((list)=>{
      list.listItems.map((item)=>{
        if (item.url === location.pathname && location.pathname === '/'){
          let tmp =[{title:list.title},{title:item.title}] as any
          setItems(tmp)
        } 
        if (item.url === location.pathname && location.pathname != '/') {
          let tmp =[{title:list.title},{title:item.title}] as any
          setItems(tmp)
        }
      })
    })
  }, [location])

  return (
    <div className="bread">
      <ConfigProvider
        theme={{
          components: {
            Breadcrumb: {
              iconFontSize: 20,
            },
          },
        }}
      >
        <Breadcrumb items={items}
        />
      </ConfigProvider>
    </div>
  );
};

export default Bread;