import React from 'react';
import { Button, Result } from 'antd';

const Maintenance: React.FC = () => (
  <Result
    status="warning"
    title="在做了,还没做完 😅"
    extra={
      <Button type="primary" key="console">
        回到首页
      </Button>
    }
  />
);

export default Maintenance;
