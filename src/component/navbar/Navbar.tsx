import { LogoutOutlined } from "@ant-design/icons"
import "./navbar.scss"
import { openInfoMessage } from "../prompt/Prompt"
import { App } from "antd";

const Navbar = () => {
  const { message } = App.useApp();

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/mdc/svg/middleware.svg" alt=""/>
        <span>Middleware Controller</span>
      </div>
      <div className="icons">
        <div className="user">
          <img className="avator" src="/mdc/svg/fishing.svg" alt="" />
          <span>Anonymous</span>
        </div>
        <LogoutOutlined onClick={()=>openInfoMessage(message,"在做了,还没做完")} className="logout" />
      </div>
    </div>
  )
}

export default Navbar
