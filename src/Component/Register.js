import React, { useState, useEffect } from "react";
import { Button, Breadcrumb, Form, Input, Select, Radio } from 'antd';
import axios from 'axios';

const Register = () => {
    const [userAuthority, setUserAuthority] = useState('user');
    const [fixReportAuthority, setFixReportAuthority] = useState('squadron');
    const [vechielDistributionAuthority, setVechielDistributionAuthority] = useState('squadron');
    const [unitList, setUnitList] = useState([]);

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        var unitList = []

        if (sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }

        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/getRepairedItem`)
            .then(res => {
                res.data.forEach(element => {
                    unitList.push({
                        value: element[1],
                        label: element[1]
                    })
                });
                setUnitList(unitList)
            })
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

    const onFinish = (values) => {
        console.log('Success:', values);

        if (values["password"] !== values["reTypePassword"]) {
            alert("???????????????")
        } else {
            axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/register`, {
                unit: values["unit"]["value"],
                username: values["username"],
                password: values["password"],
                userAuthority: userAuthority,
                fixReportAuthority: fixReportAuthority,
                vechielDistributionAuthority: vechielDistributionAuthority
            })

                .then(res => {
                    console.log(res)
                    alert("????????????")
                })
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Breadcrumb separator="" style={{ marginTop: "1%", marginLeft: "1%" }}>
                <Breadcrumb.Item>????????????: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >?????????????????????</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >????????????</Breadcrumb.Item>
            </Breadcrumb>

            <Form
                name="basic"
                style={{ marginTop: '20px' }}
                labelCol={{ span: 4, }}
                wrapperCol={{ span: 10, }}
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="????????????"
                    name="unit"
                    rules={[{
                        required: true,
                        message: '???????????????!',
                    },]}
                >
                    <Select
                        labelInValue
                        placeholder="????????????"
                        style={{ marginRight: "2%" }}
                        options={unitList}
                    >
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="???????????????"
                    name="username"
                    rules={[{
                        required: true,
                        message: 'Please input your username!',
                    },]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="???????????????"
                    name="password"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    },]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="?????????????????????"
                    name="reTypePassword"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    },]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    style={{ textAlign: "left" }}
                    label="???????????????????????????"
                >
                    <Radio.Group onChange={e => { setUserAuthority(e.target.value) }} defaultValue="user">
                        <Radio.Button value="user">?????????</Radio.Button>
                        <Radio.Button value="manager">?????????</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    style={{ textAlign: "left" }}
                    label="????????????????????????"
                >
                    <Radio.Group onChange={e => { setFixReportAuthority(e.target.value) }} defaultValue="squadron">
                        <Radio.Button value="squadron">????????????</Radio.Button>
                        <Radio.Button value="manager">?????????</Radio.Button>
                        <Radio.Button value="repaireManagement">????????????(??????)</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    style={{ textAlign: "left" }}
                    label="????????????????????????"
                >
                    <Radio.Group onChange={e => { setVechielDistributionAuthority(e.target.value) }} defaultValue="squadron">
                        <Radio.Button value="squadron">????????????</Radio.Button>
                        <Radio.Button value="manager">?????????</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 1, }}>
                    <Button type="primary" htmlType="submit">
                        ??????
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default Register;