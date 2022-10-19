import React from 'react';
//import {SyncOutlined,} from '@ant-design/icons';
import Icon from "antd/es/icon";
import Spin from "antd/es/spin";

export default function LoadingIndicator(props) {

    const antIcon = <Icon type="sync" style={{ fontSize: 70 ,color:"#58AF61"}} spin />;
    return (
        <Spin indicator={antIcon} style = {{display: 'block', textAlign: 'center', marginTop: 30}} />
    );

  /*return (

      <SyncOutlined spin  style = {{display: 'block', textAlign: 'center', marginTop: 30, fontSize: 70 ,color:"#58AF61"}}/>

  )*/
}