import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Modal, Button, Tabs, Form, Input, DatePicker, notification, Drawer } from 'antd';
import moment from "moment";
import events from "./event";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

moment.locale("zh-tw");
const localizer = momentLocalizer(moment);

const CarDistributionSystem2 = () => {
  const [eventsData, setEventsData] = useState(events);
  const [modalTitle, setModalTitle] = useState("");
  const [modalStatus, setModalStatus] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [dataArray, setDataArray] = useState([])
  const [timeDataArray, setTimeDataArray] = useState([])
  const [itemsArray, setItemsArray] = useState([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [ModifyDrawerStatus, setModifyDrawerStatus] = useState(false)
  const [form] = Form.useForm();
  const [modifyForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [choosenStartTime, setChoosenStartTime] = useState("")
  const [choosenEndTime, setChoosenEndTime] = useState("")

  const [modifyDrawerFields, setModifyDrawerFields] = useState([]);

  const handleSelect = ({ start, end }) => {
    setChoosenStartTime(start)
    setChoosenEndTime(end)
    setDrawerStatus(true);
  };

  useEffect(() => {
    md5alterVerify()
    identityVerify()
    dataFetcher()
  }, [])

  useEffect(() => {
    itemArrayGenerator(dataArray, timeDataArray)
  }, [dataArray, timeDataArray])

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

  const dataFetcher = () => {
    axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchCarDistributionAll`)
      .then((response) => {
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let tmpData = {}
          tmpData["id"] = response.data[i][0]
          tmpData["title"] = response.data[i][1]
          tmpData["applicant"] = response.data[i][2]
          tmpData["department"] = response.data[i][3]
          tmpData["location"] = response.data[i][4]
          tmpData["destination"] = response.data[i][5]
          tmpData["start"] = new Date(response.data[i][6])
          tmpData["end"] = new Date(response.data[i][7])
          tmpData["audit"] = response.data[i][8]
          tmpData["driver"] = response.data[i][9]
          data.push(tmpData)
        }
        setEventsData(data)
      })
  }

  const carDistributionByID = (value) => {
    axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/fetchCarDistributionByID`, {
      "id": value.id
    })

      .then((response) => {
        let data = response.data
        let items = []
        let timeData = []
        for (let i = 0; i < data.length; i++) {
          let tmpItem = {}
          tmpItem["id"] = data[i][0]
          tmpItem["reason"] = data[i][1]
          tmpItem["applicant"] = data[i][2]
          tmpItem["department"] = data[i][3]
          tmpItem["location"] = data[i][4]
          tmpItem["destination"] = data[i][5]
          tmpItem["start_time"] = data[i][6]
          tmpItem["end_time"] = data[i][7]
          tmpItem["audit"] = "?????????"
          tmpItem["driver"] = data[i][9]
          items.push(tmpItem)
          timeData.push(data[i][6])
        }
        setDataArray(items)
        setTimeDataArray(timeData)
        return { items, timeData }
      })
  }

  const itemArrayGenerator = (items, details) => {
    var itemArray = []
    for (var i = 0; i < details.length; i++) {
      itemArray.push({
        label: details[i],
        key: i,
        children:
          <>
            <p>????????????: {items[i]["department"]}</p>
            <p>?????????: {items[i]["applicant"]}</p>
            <p>????????????: {items[i]["reason"]}</p>
            <p>????????????: {items[i]["location"]}</p>
            <p>????????????: {items[i]["destination"]}</p>
            <p>????????????: {items[i]["start_time"]}</p>
            <p>????????????: {items[i]["end_time"]}</p>
            <p>????????????: {items[i]["audit"]}</p>
            <p>??????: {items[i]["driver"]}</p>
          </>,
      })
    }
    setItemsArray(itemArray)
    return itemArray
  }

  const dateOnSelect = (data) => {
    const formattedMonth = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(data["start"].getMonth() + 1)
    const formattedDate = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(data["start"].getDate())

    carDistributionByID(data)
    console.log(data)
    setModalTitle(data["title"])

    let tmpOuterLayer = []
    Object.entries(data).forEach(([key, value]) => {
      let tmpData = {}
      let tmpArray = []

      let newKey = (key === "title") ? key = "reason" : key
      // newKey = (key === "start") ? key = "start_time" : key
      // newKey = (key === "end") ? key = "end_time" : key

      tmpArray.push(newKey)
      tmpData["name"] = tmpArray
      tmpData["value"] = value
      tmpOuterLayer.push(tmpData)
    });
    setModifyDrawerFields(tmpOuterLayer)
  }

  const onChange = (value, dateString, type) => {
    if (type === "start_time") {
      setStartTime(dateString)
    } else if (type === "end_time") {
      setEndTime(dateString)
    }
  };

  const onFinish = (values) => {
    let reason = values["reason"]
    let applicant = values["applicant"]
    let department = sessionStorage.getItem("userGroupName")
    let location = values["location"]
    let destination = values["destination"]
    let start_time = startTime
    let end_time = endTime

    if (endTime < startTime) {
      alert("????????????????????????????????????")
      return
    } else {
      axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/insertNewSchedule`, {
        reason: reason,
        applicant: applicant,
        department: department,
        location: location,
        destination: destination,
        start_time: start_time,
        end_time: end_time
      })
        .then(res => {
          if (res.data === 1) {
            onClose()
          } else {
            alert("????????????")
          }

          let start = choosenStartTime
          let end = choosenEndTime
          let title = reason
          setEventsData([...eventsData, { start, end, title }]);
          openNotificationWithIcon('success', "????????????", "???????????????")
          onClose()
          dataFetcher()
        })
    }
  };

  const onUpdate = (values) => {
    let id = dataArray[0]['id']
    let reason = values["reason"]
    let applicant = values["applicant"]
    let department = sessionStorage.getItem("userGroupName")
    let location = values["location"]
    let destination = values["destination"]
    let start_time = startTime
    let end_time = endTime

    if (endTime < startTime) {
      alert("????????????????????????????????????")
      return
    } else {
      axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/updateSchedule`, {
        id: id,
        reason: reason,
        applicant: applicant,
        department: department,
        location: location,
        destination: destination,
        start_time: start_time,
        end_time: end_time
      })
        .then(res => {
          if (res.data === 1) {
            onClose()
          } else {
            alert("????????????")
          }

          let start = choosenStartTime
          let end = choosenEndTime
          let title = reason
          setEventsData([...eventsData, { start, end, title }]);
          openNotificationWithIcon('success', "????????????", "???????????????")
          onCloseModifyDrawer()
          carDistributionByID({ "id": id })
          dataFetcher()
        })
    }
  };

  const onClose = () => {
    setDrawerStatus(false);
    form.resetFields();
  };

  const onCloseModifyDrawer = () => {
    setModifyDrawerStatus(false);
    modifyForm.resetFields();
  }

  const openNotificationWithIcon = (type, msg, description) => {
    api[type]({
      message: msg,
      description:
        description,
    });
  };

  const deleteByID = () => {
    axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/deleteScheduledCarDistributionPlan`, {
      id: dataArray[0]["id"]
    })
      .then(res => {
        if (res.data === 1) {
          openNotificationWithIcon('warning', "????????????", "????????????~!")
          setModalStatus(false)
          dataFetcher()
        } else {
          alert("????????????")
        }
      })
  }

  return (
    <>
      <div>
        <Calendar
          views={["day", "agenda", "work_week", "month"]}
          selectable
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={eventsData}
          style={{ height: "100vh" }}
          onSelectEvent={(event) => { setModalStatus(true); dateOnSelect(event) }}
          onSelectSlot={handleSelect}
        />
      </div>

      <Modal
        title={modalTitle}
        centered
        open={modalStatus}
        onOk={() => setModalStatus(false)}
        onCancel={() => setModalStatus(false)}
        width={500}
        footer={[
          <Button type="primary" onClick={() => { setModifyDrawerStatus(true) }}>
            ??????
          </Button>,
          <Button type="primary" danger onClick={() => deleteByID()}>
            ??????
          </Button>,
        ]}
      >
        <div>
          <Tabs
            style={{ marginTop: 30 }}
            tabPosition="left"
            items={itemsArray}
          />
        </div>
      </Modal>

      <Drawer
        title="????????????"
        width={350}
        onClose={onClose}
        open={drawerStatus}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div style={{ float: "left", width: "100%", marginTop: "2%" }}>
          <Form onFinish={onFinish} autoComplete="off" form={form}>
            <Form.Item label="????????????" name="department">
              {/* <Input placeholder="?????????????????????" /> */}
              {sessionStorage.getItem("userGroupName")}
            </Form.Item>
            <Form.Item label="?????????" name="applicant" rules={[{ required: true, message: '????????????????????????!', },]}>
              <Input placeholder="??????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="reason" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="location" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="destination" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="start_time" rules={[{ required: true, message: '?????????????????????!', },]}>
              <DatePicker placeholder="???????????????????????????" showTime onChange={(value, dateString) => onChange(value, dateString, "start_time")} />
            </Form.Item>
            <Form.Item label="????????????" name="end_time" rules={[{ required: true, message: '?????????????????????!', },]}>
              <DatePicker placeholder="???????????????????????????" showTime onChange={(value, dateString) => onChange(value, dateString, "end_time")} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">??????</Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>

      <Drawer
        title="???????????????"
        width={350}
        onClose={onCloseModifyDrawer}
        open={ModifyDrawerStatus}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div style={{ float: "left", width: "100%", marginTop: "2%" }}>
          <Form fields={modifyDrawerFields} onFinish={onUpdate} autoComplete="off" form={modifyForm}>
            <Form.Item label="????????????" name="department">
              {sessionStorage.getItem("userGroupName")}
            </Form.Item>
            <Form.Item label="?????????" name="applicant" rules={[{ required: true, message: '????????????????????????!', },]}>
              <Input placeholder="??????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="reason" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="location" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="destination" rules={[{ required: true, message: '?????????????????????!', },]}>
              <Input placeholder="?????????????????????" />
            </Form.Item>
            <Form.Item label="????????????" name="start_time" rules={[{ required: true, message: '?????????????????????!', },]}>
              <DatePicker placeholder="???????????????????????????" showTime onChange={(value, dateString) => onChange(value, dateString, "start_time")} />
            </Form.Item>
            <Form.Item label="????????????" name="end_time" rules={[{ required: true, message: '?????????????????????!', },]}>
              <DatePicker placeholder="???????????????????????????" showTime onChange={(value, dateString) => onChange(value, dateString, "end_time")} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">??????</Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>

      {contextHolder}
    </>
  )
}

export default CarDistributionSystem2;