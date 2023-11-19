import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Home from "./pages/home/Home"
import Navbar from "./component/navbar/Navbar";
import Footer from "./component/footer/Footer";
import Menu from "./component/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss"
import "./styles/variables.scss"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Images from "./pages/images/Images";
import Bread from "./component/bread/Bread";
import { ConfigProvider, theme , App as AntdApp} from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

function App(){
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}> 
        <div className="main">
          <ConfigProvider
              locale={zhCN}
              theme={{
                components: {
                },
                token: {
                  fontSize: 16,
                  colorBorderSecondary: "#ddd",
                },
                // algorithm: theme.darkAlgorithm, // 暗黑算法
                // algorithm: theme.defaultAlgorithm, // 默认算法
                algorithm: theme.compactAlgorithm, // 紧凑算法
              }}
          >
            <AntdApp>
              <Navbar/>
                <div className="container">
                  <div className="menuContainer">
                    <Menu/>
                  </div>
                  <div className="contentContainer">
                    <Bread/>
                  
                      <Outlet/>
                    
                  </div>
                </div>
              <Footer/>
            </AntdApp>
          </ConfigProvider>
        </div>
        <ReactQueryDevtools/>
      </QueryClientProvider>    
      )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element:<Layout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/images/download",
          element:<Images/>
        },
        {
          path:"/images/push",
          element:<Images/>
        },
      ]
    },
    {
      path:"/login",
      element:<Login/>
    },
  ]);

 return (
    <RouterProvider router={router}/>
 )
}

export default App;
