/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Breadcrumb, Table, Space, Input, Radio, Modal, Form, Popconfirm } from 'antd';

const MemberSearch = () => {
    const [data, setData] = useState()
    const [editModalStatus, setEditModalStatus] = useState(false)
    const [currentUserAuthority, setCurrentUserAuthority] = useState('1')
    const [currentFixReportAuthority, setCurrentFixReportAuthority] = useState('1');
    const [currentVechielDistributionAuthority, setCurrentVechielDistributionAuthority] = useState('1');
    const [currentID, setCurrentID] = useState("")
    const [password, setPassword] = useState('testing')
    const [form] = Form.useForm();

    const columns =[
        {
            title: "編號",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "科別",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "權限",
            dataIndex: "authority",
            key: "authority",
        },
        {
            title: "使用者名稱",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "使用者密碼",
            dataIndex: "password",
            key: "password",
        },
        {
            title: "系統權限",
            dataIndex: "sysAuthority",
            key: "sysAuthority",
        },
        {
            title: "報修權限",
            dataIndex: "fixReportAuthority",
            key: "fixReportAuthority",
        },
        {
            title: "派車權限",
            dataIndex: "carDistributionAuthority",
            key: "carDistributionAuthority",
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={e => {edit(e, record)}}>編輯</a>
                    
                    <Popconfirm
                        title="確定要刪除嗎?"
                        description="請點選確認刪除"
                        okText="確認"
                        cancelText="取消"
                        onConfirm={e => {deleteOnRow(e, record)}}
                    >
                        <a>刪除</a>
                    </Popconfirm>
                    
                </Space>
            ),
        },
    ]

    useEffect(() => {
       dataFetch()
    }, [])

    const dataFetch = () => {
        var dataList = []
        axios.get("http://127.0.0.1:8000/welcome/api/member")
        .then(res => {
            res.data.forEach(element => {
                dataList.push({
                    number: element[0],
                    unit: element[1],
                    authority: element[2],
                    username: element[3],
                    password: element[4],
                    sysAuthority: element[5],
                    fixReportAuthority: element[6],
                    carDistributionAuthority: element[7],
                })
            });
            setData(dataList)
        })
    }

    const edit = (e, record) => {
        setEditModalStatus(true)
        setPassword(record.password)
        setCurrentID(record.number)
    }

    const deleteOnRow = (e, record) => {
        axios.post("http://127.0.0.1:8000/welcome/api/deleteMemberData", {
            id: record.number,
        })
        .then(res => {
            dataFetch()
        })
    }

    const editModalhandleOK = (e) => {
        setEditModalStatus(false)

        axios.post("http://127.0.0.1:8000/welcome/api/updateMemberData", {
            id: currentID,
            password: password,
            userAuthority: currentUserAuthority,
            fixReportAuthority: currentFixReportAuthority,
            vechielDistributionAuthority: currentVechielDistributionAuthority
        })
        .then(res => {
            dataFetch()
        })
    }

    const editModalhandleCancel = () => {
        setEditModalStatus(false)
        setPassword()
    }

    React.useEffect(() => {
        form.setFieldsValue({
            username: password,
        });
    }, [password]);

    return (
        <>
            <Breadcrumb separator="" style={{marginTop: "1%", marginLeft: "1%"}}>
                <Breadcrumb.Item>現在位置: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >管理者功能權限</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >會員查詢</Breadcrumb.Item>
            </Breadcrumb>

            <Table bordered pagination={{pageSize: 50,}} scroll={{y: 700}} columns={columns} dataSource={data} style={{marginTop: "2%"}}/>

            <div> {/* Modal for 編輯 */}
                <Modal title="修改使用者資料" open={editModalStatus} onCancel={editModalhandleCancel} onOk={editModalhandleOK}>
                    <div>
                        <div style={{float: "left", width: "25%", marginTop: 4}}>使用者密碼:</div>
                        <div>
                            <Form style={{width: "50%"}} form={form}>
                                <Form.Item name="username" rules={[{ required: true }]}>
                                    <Input onChange={e => {setPassword(e.target.value)}}/>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    <div>
                        <div style={{float: "left", width: "25%", marginTop: 4}}>使用者系統權限:</div>
                        <div>
                            <Radio.Group onChange={e => {setCurrentUserAuthority(e.target.value)}} defaultValue="user">
                                <Radio.Button value="user">使用者</Radio.Button>
                                <Radio.Button value="manager">管理員</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>

                    <div style={{marginTop: 20}}>
                        <div style={{float: "left", width: "25%", marginTop: 4}}>報修系統權限:</div>
                        <div>
                            <Radio.Group onChange={e => {setCurrentFixReportAuthority(e.target.value)}} defaultValue="squadron">
                                <Radio.Button value="squadron">一般中隊</Radio.Button>
                                <Radio.Button value="manager">管理員</Radio.Button>
                                <Radio.Button value="repaireManagement">維修管理(班本)</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    
                    <div style={{marginTop: 20}}>
                        <div style={{float: "left", width: "25%", marginTop: 4}}>派車系統權限:</div>
                        <div>
                            <Radio.Group onChange={e => {setCurrentVechielDistributionAuthority(e.target.value)}} defaultValue="squadron">
                                <Radio.Button value="squadron">一般中隊</Radio.Button>
                                <Radio.Button value="manager">管理員</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                 
                </Modal>
            </div>
        </>
    )
}

export default MemberSearch