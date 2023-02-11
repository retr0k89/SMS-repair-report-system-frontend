import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Layout, Menu } from 'antd';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import axios from "axios";
import md5 from "js-md5";

const Login = () => {
    const { Content, Sider } = Layout;
    // useEffect(() => {
    //     if(sessionStorage.getItem("username") !== null) {
    //         window.location.href = "/homepage"
    //     }
    // }, [])
    localStorage.setItem("enviorment", "testing")

    useEffect(() => {
        if (sessionStorage.getItem("username") !== null) {
            window.location.href = "/homepage"
        }

        if (localStorage.getItem("enviorment") === "testing") {
            sessionStorage.setItem("server", "127.0.0.1")
        } else if (localStorage.getItem("enviorment") === "production") {
            sessionStorage.setItem("server", "192.168.80.222")
        }
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/login`, {
            username: values["username"],
            password: values["password"]
        })
            .then(res => {
                console.log(res)
                if (res.data[0].length === 10) {
                    alert("登入成功")
                    console.log(res.data)
                    sessionStorage.setItem("userGroupName", res.data[0][1])
                    sessionStorage.setItem("userLevel", res.data[0][2])
                    sessionStorage.setItem("username", res.data[0][3])
                    sessionStorage.setItem("userPermission", res.data[0][5])
                    sessionStorage.setItem("sfsPermission", res.data[0][6])
                    sessionStorage.setItem("carDistributionSysPermission", res.data[0][7])
                    sessionStorage.setItem("cID", res.data[0][8])
                    sessionStorage.setItem("md5", res.data[0][9])
                    let stringForMd5 = `${values["password"]}${res.data[0][3]}${res.data[0][2]}${values["password"]}`
                    console.log(md5(stringForMd5))

                    window.location.href = "/homepage"
                } else {
                    alert("登入失敗")
                }
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
        getItem('差勤系統', 'attandanceSys', <SettingOutlined />),
    ];

    const setClicked = (key) => {
        if(key === "attandanceSys") {
            window.location.href = "http://10.134.80.5/login.php"
        }
    }

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
                    <div style={{ width: "50%", marginTop: 20 }}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 10,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Layout>
            </Layout>
        </>
    )
}

export default Login