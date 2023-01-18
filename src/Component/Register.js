import React, {useState, useEffect} from "react";
import { Button, Breadcrumb, Form, Input, Select, Radio } from 'antd';
import axios from 'axios';

const Register = () => {
    const [userAuthority, setUserAuthority] = useState('user');
    const [fixReportAuthority, setFixReportAuthority] = useState('squadron');
    const [vechielDistributionAuthority, setVechielDistributionAuthority] = useState('squadron');
    const [unitList, setUnitList] = useState([]);

    useEffect(() => {
        var unitList= []

        axios.get("http://127.0.0.1:8000/welcome/api/getRepairedItem")
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

    const onFinish = (values) => {
        console.log('Success:', values);
        
        if (values["password"] !== values["reTypePassword"]) {
            alert("密碼不一致")
        } else {
            axios.post("http://127.0.0.1:8000/welcome/api/register", {
                unit: values["unit"]["value"],
                username: values["username"],
                password: values["password"],
                userAuthority: userAuthority,
                fixReportAuthority: fixReportAuthority,
                vechielDistributionAuthority: vechielDistributionAuthority
            })

            .then(res => {
                console.log(res)
                alert("註冊成功")
            })
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return(
        <>
            <Breadcrumb separator="" style={{marginTop: "1%", marginLeft: "1%"}}>
                <Breadcrumb.Item>現在位置: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >管理者功能權限</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >申請帳號</Breadcrumb.Item>
            </Breadcrumb>

            <Form
                name="basic"
                style={{marginTop: '20px'}}
                labelCol={{ span: 4, }}
                wrapperCol={{ span: 10, }}
                initialValues={{ remember: true,}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >   
                <Form.Item
                    label="單位選擇"
                    name="unit"
                    rules={[{
                        required: true,
                        message: '請選擇單位!',
                    },]}
                >
                    <Select
                        labelInValue
                        placeholder="填報單位"
                        style={{marginRight: "2%"}}
                        // onChange={e => {handleChange("fillingUnit", e); setFillingUnit(e.value)}}
                        options={unitList}
                    >
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="使用者名稱"
                    name="username"
                    rules={[{
                        required: true,
                        message: 'Please input your username!',
                    },]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="使用者密碼"
                    name="password"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    },]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="確認使用者密碼"
                    name="reTypePassword"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    },]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    style={{textAlign: "left"}}
                    label="使用者系統權限設置"
                >
                    <Radio.Group onChange={e => {setUserAuthority(e.target.value)}} defaultValue="user">
                        <Radio.Button value="user">使用者</Radio.Button>
                        <Radio.Button value="manager">管理員</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    style={{textAlign: "left"}}
                    label="報修系統權限設置"
                >
                    <Radio.Group onChange={e => {setFixReportAuthority(e.target.value)}} defaultValue="squadron">
                        <Radio.Button value="squadron">一般中隊</Radio.Button>
                        <Radio.Button value="manager">管理員</Radio.Button>
                        <Radio.Button value="repaireManagement">維修管理(班本)</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    style={{textAlign: "left"}}
                    label="派車系統權限設置"
                >
                    <Radio.Group onChange={e => {setVechielDistributionAuthority(e.target.value)}} defaultValue="squadron">
                        <Radio.Button value="squadron">一般中隊</Radio.Button>
                        <Radio.Button value="manager">管理員</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 1,}}>
                    <Button type="primary" htmlType="submit">
                        註冊
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default Register;