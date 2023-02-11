/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Select, Button, Space, Table, Tag, Breadcrumb, Modal, Segmented, Input } from 'antd';
import axios from "axios";

const DashBoard = () => {
    const [fillinUnit, setFillingUnit] = useState("");
    const [fixingUnit, setFixingUnit] = useState("");
    const [repairItem, setRepairItem] = useState("");
    const [awaitProcess, setAwaitProcess] = useState("尚待處理");
    const [data, setData] = useState([]);
    const [detailModalData, setDetailModalData] = useState({
        number: "",
        fillinUnit: "",
        fillinPersoneel: "",
        repairItem: "",
        brokeDownReason: "",
        location: "",
        notifyUnit: "",
        fillinDate: "",
        handleStatus: "",
        replyContent: "",
    });
    const [unitList, setUnitList] = useState([]);
    const [repairItemList, setRepairItemList] = useState([]);
    const [detailModalStatus, setDetailModalStatus] = useState(false);
    const [replyModalStatus, setReplyModalStatus] = useState(false);
    const [choosenReplyValue, setChoosenReplyValue] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [updateFixReportData, setUpdateFixReportData] = useState({
        number: "",
        fillinUnit: "",
        notifyUnit: "",
        repairItem: "",
        brokeDownAmount: "",
        location: "",
        detail: "",
        handleStatus: "",
        replyContent: "",
        fillinPersoneel: "",
    })
    const [choosenReplyStatus, setChoosenReplyStatus] = useState("");

    const { TextArea } = Input;

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        var unitList = []

        if (sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }

        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/getUnitList`)
            .then(res => {
                res.data.forEach(element => {
                    unitList.push({
                        value: element[1],
                        label: element[1]
                    })
                });
                setUnitList(unitList)
            })

        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/getRepairItemList`)
            .then(res => {
                var repairItemList = []
                res.data.forEach(element => {
                    repairItemList.push({
                        value: element[1],
                        label: element[1]
                    })
                });
                setRepairItemList(repairItemList)
            })
        fetchData("onload")
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

    const showDetailModal = () => {
        setDetailModalStatus(true);
    };

    const detailModalhandleOk = () => {
        setDetailModalStatus(false);
    };

    const detailModalhandleCancel = () => {
        setDetailModalStatus(false);
    };

    const fetchData = (type) => {
        var dataList = []
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fixReport`, {
            unit: type === "onload" ? sessionStorage.getItem("userGroupName") : fillinUnit,
            item: fixingUnit,
            notice: repairItem,
            status: type === "onload" ? "尚待處理" : awaitProcess
        })
            .then(res => {
                res.data.forEach(element => {
                    dataList.push({
                        number: element[0],
                        repairItem: element[1],
                        fillinPersoneel: element[2],
                        brokeDownReason: element[3],
                        location: element[4],
                        fillingUnit: element[5],
                        fixingUnit: element[6],
                        fillinDate: element[7],
                        tags: [element[8]],
                        key: element[0]
                    })
                });
                setData(dataList)
            })
    }

    const handleChange = (type, value) => {
        console.log(type);
        console.log(value);
    };

    const reply = (e, value) => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchFixReport`, {
            id: value.number
        })
            .then(res => {
                setUpdateFixReportData({
                    number: res.data[0][0],
                    fillinUnit: res.data[0][5],
                    notifyUnit: res.data[0][6],
                    repairItem: res.data[0][1],
                    brokeDownAmount: 1,
                    location: res.data[0][5],
                    detail: res.data[0][3],
                    handleStatus: res.data[0][8],
                    replyContent: res.data[0][9],
                    fillinPersoneel: res.data[0][2],
                })
            })
        setReplyModalStatus(true)
    }

    const viewDetail = (e, value) => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/viewFixReportDetail`, {
            id: value.number
        })
            .then(res => {
                setDetailModalData({
                    number: res.data[0][0],
                    fillinUnit: res.data[0][1],
                    fillinPersoneel: res.data[0][2],
                    repairItem: res.data[0][3],
                    brokeDownReason: res.data[0][4],
                    location: res.data[0][5],
                    notifyUnit: res.data[0][6],
                    fillinDate: res.data[0][7],
                    handleStatus: res.data[0][8],
                    replyContent: res.data[0][9],
                })
            })
        showDetailModal()
    }

    const replyModalHandleOK = () => {
        setReplyModalStatus(false);
        updateData(updateFixReportData['replyContent'])
    }

    const replyModalhandleCancel = () => {
        setReplyModalStatus(false);
    }

    const replyContentCombination = () => {
        var currentDate = new Date();
        var date = "(" + currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + ")";

        setReplyContent(choosenReplyValue + " " + date)

        var dataFormat = updateFixReportData["replyContent"] + "\r\n" + choosenReplyValue + " " + date
        var newData = { ...updateFixReportData, ["replyContent"]: dataFormat };

        setUpdateFixReportData(newData)

        updateData(dataFormat)
    }

    const updateData = (dataPack) => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/updateFixReport`, {
            id: updateFixReportData["number"],
            handle: choosenReplyStatus,
            reply: dataPack
        })
            .then(res => {
                console.log(res)
            })
    }

    const columns = [
        {
            title: '編號',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '報修項目',
            dataIndex: 'repairItem',
            key: 'repairItem',
        },
        {
            title: '填寫人',
            dataIndex: 'fillinPersoneel',
            key: 'fillinPersoneel',
        },
        {
            title: '損壞原因',
            dataIndex: 'brokeDownReason',
            key: 'brokenDownReason',
        },
        {
            title: '地點',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '填報單位',
            dataIndex: 'fillingUnit',
            key: 'fillingUnit',
        },
        {
            title: '修繕單位',
            dataIndex: 'fillinPersoneel',
            key: 'fillinPersoneel',
        },
        {
            title: '報修日期',
            dataIndex: 'fillinDate',
            key: 'fillinDate',
        },
        {
            title: '狀態',
            key: 'status',
            dataIndex: 'status',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === '尚待處理') {
                            color = 'volcano';
                        } else if (tag === '已完成') {
                            color = "green";
                        } else if (tag === '處理中') {
                            color = "blue";
                        } else if (tag === '刪除') {
                            color = "red";
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={e => { reply(e, record) }}>回覆</a>
                    <a onClick={e => { viewDetail(e, record) }}>查看</a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Breadcrumb separator="" style={{ marginTop: "1%", marginLeft: "1%" }}>
                <Breadcrumb.Item>現在位置: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >首頁</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >儀錶板</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ marginTop: "2%" }}>
                填報單位:
                <Select
                    labelInValue
                    placeholder="填報單位"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("fillingUnit", e); setFillingUnit(e.value) }}
                    options={unitList}
                />

                修繕單位:
                <Select
                    labelInValue
                    placeholder="修繕單位"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("fixingUnit", e); setFixingUnit(e.value) }}
                    options={[
                        {
                            value: '資訊組',
                            label: '資訊組',
                        },
                        {
                            value: '工程組',
                            label: '工程組',
                        },
                        {
                            value: '水電組',
                            label: '水電組',
                        },
                        {
                            value: '醫療組',
                            label: '醫療組',
                        },
                        {
                            value: '教材文康',
                            label: '教材、文康',
                        },
                        {
                            value: '食勤組',
                            label: '食勤組',
                        },
                        {
                            value: '行政裝備',
                            label: '行政裝備',
                        },
                        {
                            value: '財產車輛',
                            label: '財產、車輛',
                        },
                        {
                            value: '諮商中心',
                            label: '諮商中心',
                        },
                        {
                            value: '經理庫房',
                            label: '經理庫房',
                        },
                        {
                            value: '機電組',
                            label: '機電組',
                        },
                        {
                            value: '人事組',
                            label: '人事組',
                        },
                    ]}
                />

                報修項目:
                <Select
                    labelInValue
                    placeholder="報修項目"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("repairItem", e); setRepairItem(e.value) }}
                    options={repairItemList}
                />

                處理狀態:
                <Select
                    labelInValue
                    placeholder="處理狀態"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("awaitProcess", e); setAwaitProcess(e.value) }}
                    options={[
                        {
                            value: '尚待處理',
                            label: '尚待處理',
                        },
                        {
                            value: '處理中',
                            label: '處理中',
                        },
                        {
                            value: '處理完成',
                            label: '處理完成',
                        },
                        {
                            value: '刪除',
                            label: '刪除',
                        },
                    ]}
                />

                <Button type="primary" icon={<SearchOutlined />} onClick={e => fetchData("normal")}>
                    Search
                </Button>
            </div>

            <div>
                <Table bordered pagination={{ pageSize: 50, }} scroll={{ y: 700 }} columns={columns} dataSource={data} style={{ marginTop: "2%" }} />
            </div>

            <div> {/* Modal for "查看" */}
                <Modal title="維修通知單" open={detailModalStatus} onOk={detailModalhandleOk} onCancel={detailModalhandleCancel}>
                    <table style={{ border: "1px solid black", borderCollapse: "collapse", marginLeft: "auto", marginRight: "auto" }}>
                        <thead>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>編號:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['number']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>填報單位:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinUnit']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>填報人:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinPersoneel']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>報修項目:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['repairItem']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>損壞情形:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['brokeDownReason']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>損壞地點:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['location']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>通知單位:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['notifyUnit']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>填報日期:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinDate']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>處理情形:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['handleStatus']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>回覆內容:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['replyContent']}</td>
                            </tr>
                        </thead>
                    </table>
                </Modal>
            </div>

            <div>
                <Modal title="修繕單編輯" style={{ width: "40%" }} open={replyModalStatus} onOk={replyModalHandleOK} onCancel={replyModalhandleCancel}>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>填報單位:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['fillinUnit']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>通知單位:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['notifyUnit']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>報修項目:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['repairItem']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>損壞數量:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['brokeDownAmount']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>損壞地點:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['location']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>詳細描述:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['detail']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>填報人員:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['fillinPersoneel']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>回覆內容:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>
                            <Segmented options={['尚待處理', '處理中', '處理完成', '刪除']} value={choosenReplyStatus} onChange={setChoosenReplyStatus} />
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>回覆內容:</th>
                        <td style={{ width: 350, border: "1px solid black", borderCollapse: "collapse" }}>
                            <Select
                                labelInValue
                                placeholder="選擇範本"
                                style={{ width: "74%", marginRight: "1%" }}
                                onChange={e => { setChoosenReplyValue(e.value) }}
                                options={[
                                    {
                                        value: '準備派人員聊解及狀況排除。',
                                        label: '準備派人員聊解及狀況排除。',
                                    },
                                    {
                                        value: '已填修繕單，委請事務科洽廠商處理。',
                                        label: '已填修繕單，委請事務科洽廠商處理',
                                    },
                                    {
                                        value: '無法修復，另購新品中',
                                        label: '無法修復，另購新品中',
                                    },
                                ]}
                            />
                            <Button style={{ width: "25%" }} type="primary" onClick={replyContentCombination}>貼上</Button>
                            <TextArea rows={4} style={{ marginTop: 10 }} value={updateFixReportData['replyContent']} placeholder="maxLength is 6" maxLength={6} />
                        </td>
                    </tr>
                </Modal>
            </div>
        </>
    )
}

export default DashBoard;