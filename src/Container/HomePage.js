import React, { useState, Suspense, useEffect } from 'react';
import { SettingOutlined, UserAddOutlined, FormOutlined, UserOutlined, TeamOutlined, GlobalOutlined, CarOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import axios from 'axios';

const HomePage = () => {
    const { Content, Sider } = Layout;
    const [clicked, setClicked] = useState('DashBoard');

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        if (sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }
    }, [])

    const md5alterVerify = () => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/md5alternation`, {
            md5: sessionStorage.getItem("md5")
        })
        .then(res => {
            if (res.data === "md5 altered") {
                alert("md5 altered")
                sessionStorage.clear()
                window.location.href = "/login"
            }
        })
    }

    const identityVerify = () => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/identityVerify`, {
            md5: sessionStorage.getItem("md5")
        })
            .then(res => {
                if ((sessionStorage.getItem("userGroupName" !== res.data[0][1])) || (sessionStorage.getItem("userLevel" !== res.data[0][2])) || (sessionStorage.getItem("username" !== res.data[0][3])) || (sessionStorage.getItem("userPermission") !== res.data[0][5]) || (sessionStorage.getItem("sfsPermission") !== res.data[0][6]) || (sessionStorage.getItem("carDistributionSysPermission") !== res.data[0][7])) {
                    // alert("forge found")
                    sessionStorage.setItem("userGroupName", res.data[0][1])
                    sessionStorage.setItem("userLevel", res.data[0][2])
                    sessionStorage.setItem("username", res.data[0][3])
                    sessionStorage.setItem("userPermission", res.data[0][5])
                    sessionStorage.setItem("sfsPermission", res.data[0][6])
                    sessionStorage.setItem("carDistributionSysPermission", res.data[0][7])
                    sessionStorage.setItem("cID", res.data[0][8])
                    sessionStorage.setItem("md5", res.data[0][9])
                }
            })
    }

    const DynamicImport = React.lazy(() => import("../Component/" + clicked));

    function getItem(label, key, icon, children, managerAccess) {
        if ((managerAccess === true && sessionStorage.getItem("userPermission") === "1") || managerAccess === false) {
            return {
                key,
                icon,
                children,
                label,
            };
        } else {
            return {
                key,
                icon,
                label,
                disabled: true,
            };
        }
    }

    const items = [
        getItem('?????????????????????', 'managerFunctionality', <SettingOutlined />, [
            getItem('????????????', 'Register', <UserAddOutlined />, null, true),
            getItem('????????????', 'MemberSearch', <UserOutlined />, null, true),
            getItem('????????????', 'GroupEdit', <TeamOutlined />, null, true),
            getItem('????????????', 'AnnouncementEdit', <GlobalOutlined />, null, true),
        ], false),
        getItem('????????????', 'CarDistributionSystem', <CarOutlined />, [
            getItem('????????????', 'CarDistributionSystem2', <CarOutlined />, null, false),
            getItem('??????????????????', 'CarDistributionManagement', <SettingOutlined />, null, true),
        ], false),
        getItem('????????????', 'DashBoard', <FormOutlined />, null, false),
        getItem('???????????????', 'CallForFixing', <FormOutlined />, null, false),
        getItem('??????????????????', 'AddToFixItem', <EditOutlined />, null, false),
        getItem('??????', 'Logout', <SettingOutlined />, null, false),
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
                    <Content style={{ margin: '0 16px' }}>
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

