import React, { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Tag, Breadcrumb, Button, Modal, Form, Input, Drawer, Select, Divider, Tabs } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const CarDistributionManagement = () => {
    const columns = [
        {
            title: '派車處室',
            dataIndex: 'department',
            filters: [
                {
                    text: '行政科',
                    value: 'Submenu',
                    children: [
                        {
                            text: '資訊室',
                            value: 'information',
                        },
                        {
                            text: '人事室',
                            value: 'personeel',
                        },
                        {
                            text: '傳令室',
                            value: 'messenger',
                        }
                    ],
                },
            ],
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: "申請事由",
            dataIndex: "reason",
        },
        {
            title: "乘車起點",
            dataIndex: "location",
        },
        {
            title: "乘車終點",
            dataIndex: "destination",
        },
        {
            title: '開始時間',
            dataIndex: 'startTime',
        },
        {
            title: '結束時間',
            dataIndex: 'endTime',
        },
        {
            title: '審核狀態',
            key: 'audit',
            dataIndex: 'audit',
            render: (_, record) => (
                <>
                    {
                        tagRender(record)
                    }
                </>
            ),
        },
        {
            render: (_, record) => (
                <Space size="middle">
                    {
                        record.audit === "待審中" ? <Button type="primary" onClick={e => { showApproveDrawer(record) }}>通過</Button> : <Button type="primary" onClick={e => { showApproveDrawer(record) }} disabled>通過</Button>
                    }
                    {
                        record.audit === "待審中" ? <Button type="primary" onClick={e => { showRejectReasonModal(record) }} danger>退回</Button> : <Button type="primary" onClick={e => { showRejectReasonModal(record) }} danger disabled>退回</Button>
                    }
                </Space>
            ),
        },
    ];

    const [eventsData, setEventsData] = useState();
    const [currentHandlingEvent, setCurrentHandlingEvent] = useState();
    const [approveDrawerTitle, setApproveDrawerTitle] = useState("");
    const [approveDrawerStatus, setApproveDrawerStatus] = useState(false);
    const [appendDataDrawerStatus, setAppendDataDrawerStatus] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState("");
    const [selectedCar, setSelectedCar] = useState("");
    const [rejectReasonModal, setRejectReasonModal] = useState(false);
    const [rejectReasonModalTitle, setRejectReasonModalTitle] = useState("");
    const [carData, setCarData] = useState([{
        key: '1',
        plate: 'A12345',
    },
    {
        key: '2',
        plate: 'B12345',
    },
    {
        key: '3',
        plate: 'C12345',
    },]);

    const [personeelData, setPersoneelData] = useState([{
        key: '1',
        name: '幹你的',
    },
    {
        key: '2',
        name: '小乖乖',
    },
    {
        key: '3',
        name: '巴格壓路',
    },]);

    const [plateOptions, setPlateOptions] = useState([
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'Yiminghe',
            label: 'yiminghe',
        },
        {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
        },
    ]);

    const [personeelOptions, setPersoneelOptions] = useState([
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'Yiminghe',
            label: 'yiminghe',
        },
        {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
        },
    ]);
    const [form] = Form.useForm();
    const [carPlateForm] = Form.useForm();
    const [personeelForm] = Form.useForm();

    useEffect(() => {
        md5alterVerify();
        identityVerify();
        dataFetcher();
        carPlateFetcher();
        personeelFetcher();
        carPlateFetcherForSelect();
        personeelFetcherForSelect();
    }, [])

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

    const tagRender = (record) => {
        if (record.audit === "待審中") {
            return <Tag color="	#FFA042">待審中</Tag>
        } else if (record.audit === "通過") {
            return <Tag color="green">已通過</Tag>
        } else if (record.audit === "退回") {
            return <Tag color="red">已退回</Tag>
        }
    }

    const dataFetcher = () => {
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchCarDistributionAll`)
            .then((response) => {
                let data = []
                for (let i = 0; i < response.data.length; i++) {
                    let tmpData = {}
                    tmpData["id"] = response.data[i][0]
                    tmpData["reason"] = response.data[i][1]
                    tmpData["applicant"] = response.data[i][2]
                    tmpData["department"] = response.data[i][3]
                    tmpData["location"] = response.data[i][4]
                    tmpData["destination"] = response.data[i][5]
                    tmpData["startTime"] = timeProcessor(new Date(response.data[i][6]))
                    tmpData["endTime"] = timeProcessor(new Date(response.data[i][7]))
                    tmpData["audit"] = response.data[i][8]
                    tmpData["driver"] = response.data[i][9]
                    data.push(tmpData)
                }
                setEventsData(data)
                console.log(data)
            })
    }

    const carPlateFetcher = () => {
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchCarPlate`)
            .then((response) => {
                let data = []
                for (let i = 0; i < response.data.length; i++) {
                    let tmpData = {}
                    tmpData["key"] = i
                    tmpData["plate"] = response.data[i][1]
                    data.push(tmpData)
                }
                setCarData(data)
                console.log(data)
            })
    }

    const personeelFetcher = () => {
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchPersoneel`)
            .then((response) => {
                let data = []
                for (let i = 0; i < response.data.length; i++) {
                    let tmpData = {}
                    tmpData["key"] = i
                    tmpData["name"] = response.data[i][1]
                    data.push(tmpData)
                }
                setPersoneelData(data)
                console.log(data)
            })
    }

    const carPlateFetcherForSelect = () => {
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchCarPlate`)
            .then((response) => {
                let data = []
                for (let i = 0; i < response.data.length; i++) {
                    let tmpData = {}
                    tmpData["value"] = i
                    tmpData["label"] = response.data[i][1]
                    data.push(tmpData)
                }
                setPlateOptions(data)
                console.log(data)
            })
    }

    const personeelFetcherForSelect = () => {
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchPersoneel`)
            .then((response) => {
                let data = []
                for (let i = 0; i < response.data.length; i++) {
                    let tmpData = {}
                    tmpData["value"] = i
                    tmpData["label"] = response.data[i][1]
                    data.push(tmpData)
                }
                setPersoneelOptions(data)
            })
    }


    const timeProcessor = (time) => {
        const formattedMonth = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(time.getMonth() + 1)
        const formattedDate = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(time.getDate())
        const formattedHour = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(time.getHours())
        const formattedMinute = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(time.getMinutes())

        return `${time.getFullYear()}-${formattedMonth}-${formattedDate}  ${formattedHour}:${formattedMinute}`
    }

    const showRejectReasonModal = (data) => {
        setCurrentHandlingEvent(data)
        setRejectReasonModalTitle("退回 " + data.reason)
        setRejectReasonModal(true);
    };

    const rejectReasonModalHandleCancel = () => {
        setRejectReasonModal(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(currentHandlingEvent)
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/dismissSchedule`, {
            id: currentHandlingEvent.id,
            dismissReason: values.rejectReason
        })
            .then((response) => {
                console.log(response)
                setRejectReasonModal(false);
                dataFetcher()
            })

        form.resetFields();
    }

    const appendCarPlate = (values) => {
        console.log(values)
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/appendCarPlate`, {
            carPlate: values.car
        })
            .then((response) => {
                console.log(response)
                // setAppendDataDrawerStatus(false);
                carPlateFetcher()
                carPlateFetcherForSelect();
                carPlateForm.resetFields();
            })
    }

    const appendPersoneel = (values) => {
        console.log(values)
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/appendPersoneel`, {
            name: values.person
        })
            .then((response) => {
                console.log(response)
                personeelFetcher()
                personeelFetcherForSelect();
                personeelForm.resetFields();
            })
    }

    const showApproveDrawer = (data) => {
        setApproveDrawerTitle("通過 " + data.reason)
        setApproveDrawerStatus(true);
    };

    const onClose = () => {
        setApproveDrawerStatus(false);
    };

    const showChildrenDrawer = () => {
        setAppendDataDrawerStatus(true);
    };

    const onChildrenDrawerClose = () => {
        setAppendDataDrawerStatus(false);
    };

    const handleSelectedDriver = (value) => {
        setSelectedDriver(value)
    }

    const handleSelectedCar = (value) => {
        setSelectedCar(value)
    }

    const onChange = (key) => {
        console.log(key);
    };

    const deletePlate = (record) => {
        console.log(record)
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/deleteCarPlate`, {
            plate: record.plate
        })
            .then((response) => {
                console.log(response)
                carPlateFetcher()
            })
    }

    const deleteName = (record) => {
        console.log(record)
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/deletePersoneel`, {
            name: record.name
        })
            .then((response) => {
                console.log(response)
                personeelFetcher()
            })
    }

    const carColumns = [
        {
            title: '車牌',
            dataIndex: 'plate',
        },
        {
            title: '刪除',
            render: (_, record) => (
                <>
                    <Button type="primary" danger icon={<MinusOutlined />} onClick={e => deletePlate(record)} />
                </>
            ),
        },
    ]

    const personeelColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '刪除',
            render: (_, record) => (
                <>
                    <Button type="primary" danger icon={<MinusOutlined />} onClick={e => deleteName(record)} />
                </>
            ),
        },
    ]

    const items = [
        {
            key: 'driver',
            label: `駕駛`,
            children: <>
                <Form layout="inline" form={personeelForm} onFinish={appendPersoneel}>
                    <Form.Item name="person">
                        <Input placeholder="請輸入駕駛姓名" />
                    </Form.Item>
                    <Button type="primary" icon={<PlusOutlined />} htmlType="submit" />
                </Form>
                <Divider />
                <div>
                    <Table columns={personeelColumns} dataSource={personeelData} />
                </div>
            </>,
        },
        {
            key: 'car',
            label: `車輛`,
            children:
                <>
                    <Form layout="inline" form={carPlateForm} onFinish={appendCarPlate}>
                        <Form.Item name="car">
                            <Input placeholder="請輸入車牌號碼" />
                        </Form.Item>
                        <Button type="primary" icon={<PlusOutlined />} htmlType="submit" />
                    </Form>
                    <Divider />
                    <div>
                        <Table columns={carColumns} dataSource={carData} />
                    </div>
                </>,
        },
    ];

    return (
        <>
            <Breadcrumb separator="" style={{ marginTop: "1%", marginLeft: "1%", marginBottom: "1%" }}>
                <Breadcrumb.Item>現在位置</Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >派車系統</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >派車管理</Breadcrumb.Item>
            </Breadcrumb>

            <Table columns={columns} dataSource={eventsData} />

            <div>
                <Modal title={rejectReasonModalTitle} open={rejectReasonModal} onCancel={rejectReasonModalHandleCancel} form={form} footer={[<Button form="rejectForm" key="submit" type="primary" danger htmlType="submit">退回</Button>]}>
                    <Form id="rejectForm" onFinish={onFinish} autoComplete="off" form={form}>
                        <Form.Item
                            label="退回原因"
                            name="rejectReason"
                            rules={[{ required: true, message: '請輸入退回原因' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            {/* <div>
                <Modal title={approveModalTitle} open={approveModalStatus} onCancel={approveModalHandleCancel} footer={[<Button form="approveForm" key="submit" type="primary" htmlType="submit">通過</Button>]}>
                    <Form id="approveForm" onFinish={onFinish} layout="inline" autoComplete="off" form={form}>
                        <Form.Item
                            style={{ marginTop: "2%", width: "46%" }}
                            name="driver"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginTop: "2%", width: "47%" }}
                            name="car"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div> */}
            <div>
                <Drawer title={approveDrawerTitle} width={300} onClose={onClose} open={approveDrawerStatus}>
                    <div>
                        選擇駕駛:
                        <Select
                            defaultValue="Empty"
                            style={{
                                width: "80%",
                            }}
                            onChange={handleSelectedDriver}
                            options={personeelOptions}
                        />
                    </div>
                    <br />
                    <br />
                    <div>
                        選擇車輛:
                        <Select
                            defaultValue="Empty"
                            style={{
                                width: "80%",
                            }}
                            onChange={handleSelectedCar}
                            options={plateOptions}
                        />
                    </div>
                    <Divider />
                    <Button type="primary" onClick={showChildrenDrawer}>
                        新增、修改 駕駛 / 車輛
                    </Button>

                    <Button type="primary" style={{ background: "green", borderColor: "green", marginLeft: "2%" }} onClick={showChildrenDrawer}>
                        通過
                    </Button>

                    <Drawer
                        title="修改 駕駛 / 車輛"
                        width={320}
                        onClose={onChildrenDrawerClose}
                        open={appendDataDrawerStatus}
                    >
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    </Drawer>
                </Drawer>
            </div>
        </>
    )
}

export default CarDistributionManagement;