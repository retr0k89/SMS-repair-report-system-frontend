import React, {useState, useEffect} from "react";
import { Button, Form, Input, Select, message, Modal, Steps } from 'antd';
import axios from "axios";

const { Option } = Select;

const CallForFixing = () => {
    const [form] = Form.useForm();
    const [unitOptions, setUnitOptions] = useState([])
    const [choosenUnit, setChoosenUnit] = useState("")
    const [choosenNotifyUnit, setChoosenNotifyUnit] = useState("")
    const [repaireItemOptions, setRepaireItemOptions] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [formItemState, setFormItemState] = useState({
        notifyUnit: "",
        awaitRepairItem: "",
        others: "",
        amount: "",
        fillinPersoneel: "",
        breakdownDescription: "",
        breakdownLocation: "",
        fillinUnit: "",
    })

    const [formItemData, setFormItemData] = useState({
        notifyUnit: "",
        awaitRepairItem: "",
        others: "",
        amount: "",
        fillinPersoneel: "",
        breakdownDescription: "",
        breakdownLocation: "",
        fillinUnit: "",
    })
    const [confirmationModalStatus, setConfirmationModalStatus] = useState(false)

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        if(sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }

        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchUnit`)
        .then(res => {
            res.data.map((unit) => {
                setUnitOptions(unitOptions => [...unitOptions, {value: unit[0], label: unit[1]}])
            })
        })
    }, [])

    useEffect(() => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchRepairItem`, {
            unit_id: choosenUnit
        })
        .then(res => {
            if (res.data.length === 0){
                setRepaireItemOptions([])
                error("查無可選報修項目")
            }
            res.data.map((unit) => {
                setRepaireItemOptions(repaireItemOptions => [...repaireItemOptions, {value: unit[0], label: unit[1]}])
            })
        })
    }, [choosenUnit])

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

    const error = (msg) => {
        messageApi.open({
          type: 'error',
          content: msg,
        });
    };

    const onFinish = (values) => {
        verify(values)

        setFormItemData({
            ...formItemData,
            ...values
        })

        console.log(values)
        if (formItemState.notifyUnit === "" && formItemState.awaitRepairItem === "" && formItemState.others === "" && formItemState.amount === "" && formItemState.breakdownDescription === "" && formItemState.breakdownLocation === "" && formItemState.fillinUnit === "") {
            setConfirmationModalStatus(true)
        }
    };

    const verify = (values) => {
        let tempState = {
            notifyUnit: "",
            awaitRepairItem: "",
            others: "",
            amount: "",
            fillinPersoneel: "",
            breakdownDescription: "",
            breakdownLocation: "",
            fillinUnit: "",
        }

        if (values.notifyUnit === undefined) {
            tempState.notifyUnit = "error"
        }

        if (values.awaitRepairItem === undefined && values.others === undefined) {
            tempState.awaitRepairItem = "error"
            tempState.others = "error"
        }

        if (values.amount === undefined) {
            tempState.amount = "error"
        }

        if (values.fillinPersoneel === undefined) {
            tempState.fillinPersoneel = "error"
        }

        if (values.breakdownDescription === undefined) {
            tempState.breakdownDescription = "error"
        }

        if (values.breakdownLocation === undefined) {
            tempState.breakdownLocation = "error"
        }

        if (values.fillinUnit === undefined) {
            tempState.fillinUnit = "error"
        }

        setFormItemState({
            ...formItemState,
            ...tempState
        })
    }

    const modalClickOK = () => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/receivedRepairItem`, {
            notify_unit: formItemData["notifyUnit"],
            repair_item: formItemData["awaitRepairItem"],
            others: formItemData["others"],
            amount: formItemData["amount"],
            fillin_personeel: formItemData["fillinPersoneel"],
            breakdown_description: formItemData["breakdownDescription"],
            breakdown_location: formItemData["breakdownLocation"],
            fillin_unit: formItemData["fillinUnit"],
            c_id: choosenUnit, // 知會單位代號
            d_id: choosenNotifyUnit, // 填報單位代號
        })
        .then((res) => {
            console.log(res)
        })
        setConfirmationModalStatus(false)
    }

    const modalClickCancel = () => {
        setConfirmationModalStatus(false)
    }

    return (
        <>
            {contextHolder}
            <Form style={{width: "50%"}} onFinish={onFinish} form={form} labelCol={{ span: 4, }} wrapperCol={{ span: 10, }} autoComplete="off">
                <div style={{marginTop: 20}}>
                    <Form.Item name="notifyUnit" label="通知單位:">
                        <Select status={formItemState["notifyUnit"]} onChange={setChoosenUnit} options={unitOptions}>  

                        </Select>
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="awaitRepairItem" label="報修項目:">
                        <Select status={formItemState["awaitRepairItem"]} options={repaireItemOptions}>    

                        </Select>
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="others" label="其他:">
                        <Input status={formItemState["others"]} placeholder="如查無報修項目請填此" />
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="amount" label="數量">
                        <Select status={formItemState["amount"]}>    
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="fillinPersoneel" label="填寫人:">
                        <Input status={formItemState["fillinPersoneel"]}/>
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="breakdownDescription" label="損壞情形:">
                        <Input status={formItemState["breakdownDescription"]}/>
                    </Form.Item>
                </div>

                <div style={{marginTop: 20}}>
                    <Form.Item name="breakdownLocation" label="損壞地點:">
                        <Input status={formItemState["breakdownLocation"]}/>
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit">送出</Button>
                </Form.Item>
            </Form>

            <Modal
                title="資料確認"
                centered
                open={confirmationModalStatus}
                onOk={() => modalClickOK()}
                onCancel={() => modalClickCancel()}
                width={800}
            >
                <Steps
                    current={1}
                    style={{marginTop: 20}}
                    items={[
                        {
                            title: '資料輸入',
                            description: "Finished",
                        },
                        {
                            title: '資料確認',
                            description: "In Progress",
                        },
                        {
                            title: '完成填報',
                            description: "Next",
                        },
                    ]}
                />
                <div style={{width: "100%"}}>
                    <h3 style={{marginLeft: "35%"}}>通知單位: {choosenUnit}</h3>
                    <h3 style={{marginLeft: "35%"}}>報修項目: {formItemData['awaitRepairItem']}</h3>
                    <h3 style={{marginLeft: "35%"}}>其他: {formItemData['others']}</h3>
                    <h3 style={{marginLeft: "35%"}}>數量: {formItemData['amount']}</h3>
                    <h3 style={{marginLeft: "35%"}}>填寫人: {formItemData['fillinPersoneel']}</h3>
                    <h3 style={{marginLeft: "35%"}}>損壞情形: {formItemData['breakdownDescription']}</h3>
                    <h3 style={{marginLeft: "35%"}}>損壞地點: {formItemData['breakdownLocation']}</h3>
                    <h3 style={{marginLeft: "35%"}}>填報單位: {choosenNotifyUnit}</h3>
                </div>
            </Modal>
        </>
    )
}

export default CallForFixing