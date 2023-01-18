import React, {useEffect, useState} from "react";
import { Button, Checkbox, Form, Input, Breadcrumb, Space, Table, Tag, Popconfirm } from 'antd';
import axios from "axios";

const AddToFixItem = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        dbData()
    }, [])

    const dbData = () => {
        axios.post("http://127.0.0.1:8000/welcome/api/fetchFixItem", {
            user_group_name: sessionStorage.getItem("userGroupName")
        })

        .then(res => {
            setData(res.data.map((item, index) => {
                return {
                    key: index,
                    itemNumber: item[0],
                    itemName: item[1],
                    itemBelong: item[2]
                }
            }))
        })
    }

    const columns = [
        {
            title: '物品編號',
            dataIndex: 'itemNumber',
            key: 'itemNumber',
        },
        {
            title: '物品名稱',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: '物品歸屬',
            dataIndex: 'itemBelong',
            key: 'itemBelong',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
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
        }
    ]

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post("http://127.0.0.1:8000/welcome/api/insertFixItem", {
            item_name: values["newItem"],
            c_id: sessionStorage.getItem("cID"),
            item_unit: sessionStorage.getItem("userGroupName")
        })
        .then(res => {
            if (res.data === 1) {
                alert("新增成功")
                dbData()
            } else {
                alert("新增失敗")
                dbData()
            }
        })
        dbData()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const deleteOnRow = (e, record) => {
        axios.post("http://127.0.0.1:8000/welcome/api/deleteFixItem", {
            item_id: record.itemNumber,
        })
        .then(res => {
            dbData()
        })
        console.log(e, record)
    }

    return (
        <>  
            <Breadcrumb separator="" style={{marginTop: "1%", marginLeft: "1%"}}>
                <Breadcrumb.Item>現在位置</Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >新增報修項目</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{width: "40%", float: "left"}}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 10,
                    }}
                    style={{marginTop: 20}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    >
                        <Form.Item
                            label="新增報修品項"
                            name="newItem"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">新增</Button>
                        </Form.Item>
                </Form>
            </div>

            <div style={{width: "50%", float: "left"}}>
                <Table columns={columns} dataSource={data} />
            </div>
        </>
    )
}

export default AddToFixItem