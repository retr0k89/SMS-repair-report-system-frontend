/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Select, Button, Space, Table, Tag, Breadcrumb, Modal, Segmented, Input } from 'antd';
import axios from "axios";

const DashBoard = () => {
    const [fillinUnit, setFillingUnit] = useState("");
    const [fixingUnit, setFixingUnit] = useState("");
    const [repairItem, setRepairItem] = useState("");
    const [awaitProcess, setAwaitProcess] = useState("ε°εΎθη");
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
            status: type === "onload" ? "ε°εΎθη" : awaitProcess
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
            title: 'η·¨θ',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'ε ±δΏ?ι η?',
            dataIndex: 'repairItem',
            key: 'repairItem',
        },
        {
            title: 'ε‘«ε―«δΊΊ',
            dataIndex: 'fillinPersoneel',
            key: 'fillinPersoneel',
        },
        {
            title: 'ζε£εε ',
            dataIndex: 'brokeDownReason',
            key: 'brokenDownReason',
        },
        {
            title: 'ε°ι»',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'ε‘«ε ±ε?δ½',
            dataIndex: 'fillingUnit',
            key: 'fillingUnit',
        },
        {
            title: 'δΏ?ηΉε?δ½',
            dataIndex: 'fillinPersoneel',
            key: 'fillinPersoneel',
        },
        {
            title: 'ε ±δΏ?ζ₯ζ',
            dataIndex: 'fillinDate',
            key: 'fillinDate',
        },
        {
            title: 'ηζ',
            key: 'status',
            dataIndex: 'status',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'ε°εΎθη') {
                            color = 'volcano';
                        } else if (tag === 'ε·²ε?ζ') {
                            color = "green";
                        } else if (tag === 'θηδΈ­') {
                            color = "blue";
                        } else if (tag === 'εͺι€') {
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
                    <a onClick={e => { reply(e, record) }}>εθ¦</a>
                    <a onClick={e => { viewDetail(e, record) }}>ζ₯η</a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Breadcrumb separator="" style={{ marginTop: "1%", marginLeft: "1%" }}>
                <Breadcrumb.Item>ηΎε¨δ½η½?: </Breadcrumb.Item>
                <Breadcrumb.Separator>:</Breadcrumb.Separator>
                <Breadcrumb.Item >ι¦ι </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item >ειΆζΏ</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ marginTop: "2%" }}>
                ε‘«ε ±ε?δ½:
                <Select
                    labelInValue
                    placeholder="ε‘«ε ±ε?δ½"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("fillingUnit", e); setFillingUnit(e.value) }}
                    options={unitList}
                />

                δΏ?ηΉε?δ½:
                <Select
                    labelInValue
                    placeholder="δΏ?ηΉε?δ½"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("fixingUnit", e); setFixingUnit(e.value) }}
                    options={[
                        {
                            value: 'θ³θ¨η΅',
                            label: 'θ³θ¨η΅',
                        },
                        {
                            value: 'ε·₯η¨η΅',
                            label: 'ε·₯η¨η΅',
                        },
                        {
                            value: 'ζ°΄ι»η΅',
                            label: 'ζ°΄ι»η΅',
                        },
                        {
                            value: 'ι«ηη΅',
                            label: 'ι«ηη΅',
                        },
                        {
                            value: 'ζζζεΊ·',
                            label: 'ζζγζεΊ·',
                        },
                        {
                            value: 'ι£ε€η΅',
                            label: 'ι£ε€η΅',
                        },
                        {
                            value: 'θ‘ζΏθ£ε',
                            label: 'θ‘ζΏθ£ε',
                        },
                        {
                            value: 'θ²‘η’θ»θΌ',
                            label: 'θ²‘η’γθ»θΌ',
                        },
                        {
                            value: 'θ«?εδΈ­εΏ',
                            label: 'θ«?εδΈ­εΏ',
                        },
                        {
                            value: 'ηΆηεΊ«ζΏ',
                            label: 'ηΆηεΊ«ζΏ',
                        },
                        {
                            value: 'ζ©ι»η΅',
                            label: 'ζ©ι»η΅',
                        },
                        {
                            value: 'δΊΊδΊη΅',
                            label: 'δΊΊδΊη΅',
                        },
                    ]}
                />

                ε ±δΏ?ι η?:
                <Select
                    labelInValue
                    placeholder="ε ±δΏ?ι η?"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("repairItem", e); setRepairItem(e.value) }}
                    options={repairItemList}
                />

                θηηζ:
                <Select
                    labelInValue
                    placeholder="θηηζ"
                    style={{ width: 120, marginRight: "2%" }}
                    onChange={e => { handleChange("awaitProcess", e); setAwaitProcess(e.value) }}
                    options={[
                        {
                            value: 'ε°εΎθη',
                            label: 'ε°εΎθη',
                        },
                        {
                            value: 'θηδΈ­',
                            label: 'θηδΈ­',
                        },
                        {
                            value: 'θηε?ζ',
                            label: 'θηε?ζ',
                        },
                        {
                            value: 'εͺι€',
                            label: 'εͺι€',
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

            <div> {/* Modal for "ζ₯η" */}
                <Modal title="ηΆ­δΏ?ιη₯ε?" open={detailModalStatus} onOk={detailModalhandleOk} onCancel={detailModalhandleCancel}>
                    <table style={{ border: "1px solid black", borderCollapse: "collapse", marginLeft: "auto", marginRight: "auto" }}>
                        <thead>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>η·¨θ:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['number']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε‘«ε ±ε?δ½:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinUnit']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε‘«ε ±δΊΊ:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinPersoneel']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε ±δΏ?ι η?:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['repairItem']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ζε£ζε½’:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['brokeDownReason']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ζε£ε°ι»:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['location']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ιη₯ε?δ½:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['notifyUnit']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε‘«ε ±ζ₯ζ:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['fillinDate']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>θηζε½’:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['handleStatus']}</td>
                            </tr>
                            <tr>
                                <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>εθ¦ε§ε?Ή:</th>
                                <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{detailModalData['replyContent']}</td>
                            </tr>
                        </thead>
                    </table>
                </Modal>
            </div>

            <div>
                <Modal title="δΏ?ηΉε?η·¨θΌ―" style={{ width: "40%" }} open={replyModalStatus} onOk={replyModalHandleOK} onCancel={replyModalhandleCancel}>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε‘«ε ±ε?δ½:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['fillinUnit']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ιη₯ε?δ½:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['notifyUnit']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε ±δΏ?ι η?:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['repairItem']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ζε£ζΈι:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['brokeDownAmount']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ζε£ε°ι»:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['location']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>θ©³η΄°ζθΏ°:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['detail']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>ε‘«ε ±δΊΊε‘:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>{updateFixReportData['fillinPersoneel']}</td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>εθ¦ε§ε?Ή:</th>
                        <td style={{ width: 200, border: "1px solid black", borderCollapse: "collapse" }}>
                            <Segmented options={['ε°εΎθη', 'θηδΈ­', 'θηε?ζ', 'εͺι€']} value={choosenReplyStatus} onChange={setChoosenReplyStatus} />
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: 120, border: "1px solid black", borderCollapse: "collapse" }}>εθ¦ε§ε?Ή:</th>
                        <td style={{ width: 350, border: "1px solid black", borderCollapse: "collapse" }}>
                            <Select
                                labelInValue
                                placeholder="ιΈζη―ζ¬"
                                style={{ width: "74%", marginRight: "1%" }}
                                onChange={e => { setChoosenReplyValue(e.value) }}
                                options={[
                                    {
                                        value: 'ζΊεζ΄ΎδΊΊε‘θθ§£εηζ³ζι€γ',
                                        label: 'ζΊεζ΄ΎδΊΊε‘θθ§£εηζ³ζι€γ',
                                    },
                                    {
                                        value: 'ε·²ε‘«δΏ?ηΉε?οΌε§θ«δΊεη§ζ΄½ε» εθηγ',
                                        label: 'ε·²ε‘«δΏ?ηΉε?οΌε§θ«δΊεη§ζ΄½ε» εθη',
                                    },
                                    {
                                        value: 'η‘ζ³δΏ?εΎ©οΌε¦θ³Όζ°εδΈ­',
                                        label: 'η‘ζ³δΏ?εΎ©οΌε¦θ³Όζ°εδΈ­',
                                    },
                                ]}
                            />
                            <Button style={{ width: "25%" }} type="primary" onClick={replyContentCombination}>θ²ΌδΈ</Button>
                            <TextArea rows={4} style={{ marginTop: 10 }} value={updateFixReportData['replyContent']} placeholder="maxLength is 6" maxLength={6} />
                        </td>
                    </tr>
                </Modal>
            </div>
        </>
    )
}

export default DashBoard;