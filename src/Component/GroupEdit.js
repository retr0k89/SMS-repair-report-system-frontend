import React, { useEffect, useState } from "react";
import { Space, Table, Popconfirm, Input, Button, Modal, Breadcrumb, Form } from 'antd';
import axios from "axios";

const GroupEdit = () => {
    const [editModalStatus, setEditModalStatus] = useState(false)
    const [classData, setClassData] = useState([])
    const [form] = Form.useForm();

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        if (sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }

        dataFetch()
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

    const dataFetch = () => {
        var dataList = []
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/classData`)
            .then((res) => {
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
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/deleteMemberData`, {
            id: record.number,
        })
            .then(res => {
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
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/insertClassData`, {
            nameData: values.username
        })
            .then((res) => {
                dataFetch()
            })
    };

    const columns = [
        {
            title: '??????',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '????????????',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            title: '??????',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={e => { edit(e, record) }}>??????</a>

                    <Popconfirm
                        title="???????????????????"
                        description="?????????????????????"
                        okText="??????"
                        cancelText="??????"
                        onConfirm={e => { deleteOnRow(e, record) }}
                    >
                        <a>??????</a>
                    </Popconfirm>

                </Space>
            ),
        },
    ]

    const data = [
        {
            number: "1",
            groupName: "?????????",
        }
    ]

    return (
        <>
            <Breadcrumb separator="" style={{ marginTop: "1%", marginLeft: "1%" }}>
                <Breadcrumb.Item>????????????: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >?????????????????????</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >????????????</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ textAlign: "left", marginTop: "1%", marginLeft: "1%" }}>
                <Form style={{ width: "50%" }} onFinish={onFinish} layout="inline" form={form}>
                    <Form.Item label="????????????" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">??????</Button>
                    </Form.Item>
                </Form>

            </div>

            <div style={{ marginTop: "1%" }}>
                <Table pagination={{ pageSize: 50, }} scroll={{ y: 700 }} columns={columns} dataSource={classData} />
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