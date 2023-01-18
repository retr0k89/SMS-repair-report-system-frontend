/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import { Space, Table, Popconfirm, Input, Button, Modal, Breadcrumb, Form } from 'antd';
import axios from "axios";

const GroupEdit = () => {
    const [editModalStatus, setEditModalStatus] = useState(false)
    const [classData, setClassData] = useState([])
    const [form] = Form.useForm();

    useEffect(() => {
        dataFetch()
    }, [])

    const dataFetch = () => {
        var dataList = []
        axios.get("http://127.0.0.1:8000/welcome/api/classData")
        .then((res)=> {
            res.data.forEach(element => {
                dataList.push({
                    number: element[0],
                    groupName: element[1]
                })
            })
            setClassData(dataList)
        })
    }

    const deleteOnRow = (e, record) => {
        axios.post("http://127.0.0.1:8000/welcome/api/deleteMemberData", {
            id: record.number,
        })
        .then(res => {
            console.log(res)
            dataFetch()
        })
    }

    const edit = (e, record) => {
        setEditModalStatus(true)
    }

    const handleOk = () => {
        setEditModalStatus(false);
    };

    const handleCancel = () => {
        setEditModalStatus(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post("http://127.0.0.1:8000/welcome/api/insertClassData", {
            nameData: values.username
        })
        .then((res) => {
            console.log(res)
            dataFetch()
        })
    };

    const columns = [
        {
            title: '編號',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '組別名稱',
            dataIndex: 'groupName',
            key: 'groupName',
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

    const data = [
        {
            number: "1",
            groupName: "資訊組",
        }
    ]

    return (
        <>
             <Breadcrumb separator="" style={{marginTop: "1%", marginLeft: "1%"}}>
                <Breadcrumb.Item>現在位置: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >管理者功能權限</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >組別編輯</Breadcrumb.Item>
            </Breadcrumb>

            {/* <div style={{float: "left", width: "50%", marginTop: "2%"}}>
                <Table columns={columns} dataSource={data}/>
            </div>

            <div style={{float: "left", width: "50%", marginTop: 4}}>
                
            </div> */}
            <div style={{textAlign: "left", marginTop: "1%", marginLeft: "1%"}}>
                {/* <Input style={{width: "25%", marginLeft: 10}}></Input> */}
                <Form style={{width: "50%"}} onFinish={onFinish} layout="inline" form={form}>
                    <Form.Item label="新增組別" name="username">
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">新增</Button>
                    </Form.Item>
                </Form>
                
            </div>

            <div style={{marginTop: "1%"}}>
                <Table pagination={{pageSize: 50,}} scroll={{y: 700}} columns={columns} dataSource={classData}/>
            </div>

            <Modal title="Basic Modal" open={editModalStatus} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

export default GroupEdit