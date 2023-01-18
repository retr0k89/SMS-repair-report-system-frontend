import React, { useState, Suspense } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb } from 'antd';
import Sider from 'antd/es/layout/Sider';

const HomePage = () => {
    const { Header, Content, Sider} = Layout;
    const [clicked, setClicked] = useState('DashBoard');

    const DynamicImport = React.lazy(() => import("../Component/" + clicked));

    function getItem(label, key, icon, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
    }

    const items = [
        getItem('管理者功能權限', 'managerFunctionality', <MailOutlined />, [
            getItem('申請帳號', 'Register'),
            getItem('會員查詢', 'MemberSearch'),
            getItem('組別編輯', 'GroupEdit'),
            getItem('公告編輯', 'AnnouncementEdit'),
        ]),
        getItem('報修系統', 'DashBoard', <SettingOutlined />),
        getItem('派車系統', 'CarDistributionSystem', <SettingOutlined />),
        // getItem('系統管理', 'systemManagement', <MailOutlined />, [
        //     getItem('報修系統', 'DashBoard'),
        //     getItem('派車系統', 'CarDitributionSystem'),
        // ]),
        getItem('填寫維修單', 'CallForFixing', <SettingOutlined />),
        getItem('新增報修項目', 'AddToFixItem', <SettingOutlined />),
        getItem('登出', 'logout', <SettingOutlined />),
    ];

    return (
       <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <Menu
                        onClick={(e) => setClicked(e.key)}
                        style={{ minHeight: '100vh' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme='dark'
                        items={items}
                    />
                </Sider>

                <Layout className='site-layout'>
                    <Content style={{margin: '0 16px'}}>
                    {/* <h3> Hello !</h3> */}
                        <Suspense fallback={<div>Loading...</div>}>
                            <DynamicImport />
                        </Suspense>
                    </Content>
                </Layout>
            </Layout>
       </>
    )
}

export default HomePage;

