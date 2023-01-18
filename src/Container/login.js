import React, {useEffect, useState} from "react";
import { Button, Checkbox, Form, Input } from 'antd';
import axios from "axios";

const Login = () => {
    // useEffect(() => {
    //     if(sessionStorage.getItem("username") !== null) {
    //         window.location.href = "/homepage"
    //     }
    // }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post('http://127.0.0.1:8000/welcome/api/login', {
            username: values["username"],
            password: values["password"]
        })
        .then(res => {
            console.log(res)
            if (res.data[0].length === 9) {
                alert("登入成功")
                sessionStorage.setItem("userGroupName", res.data[0][1])
                sessionStorage.setItem("userLevel", res.data[0][2])
                sessionStorage.setItem("username", res.data[0][3])
                sessionStorage.setItem("userPermission", res.data[0][5])
                sessionStorage.setItem("sfsPermission", res.data[0][6])
                sessionStorage.setItem("carDistributionSysPermission", res.data[0][7])
                sessionStorage.setItem("cID", res.data[0][8])
                window.location.href = "/homepage"
            } else {
                alert("登入失敗")
            }
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div style={{width: "50%", marginTop: 20}}>
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
        </>
    )
}

export default Login