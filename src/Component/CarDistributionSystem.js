import React, {useEffect, useState} from "react";
import { Badge, Calendar, Button, Modal, Radio, Space, Tabs, Col, DatePicker, Drawer, Form, Input, Timeline, theme, notification } from 'antd';
import dayjs from 'dayjs';
import axios from "axios";
import "./CarDistributionSystem.css";


const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
};

const CarDistributionSystem = () => {
    const [baseURL, setBaseURL] = useState("127.0.0.1")
    const [value, setValue] = useState(() => dayjs('2017-01-25'));
    const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
    const [modalStatus, setModalStatus] = useState(false);
    const [itemsArray, setItemsArray] = useState([])
    const [modalTitle, setModalTitle] = useState("")
    const [drawerStatus, setDrawerStatus] = useState(false);
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [dataArray, setDataArray] = useState([])
    const [timeDataArray, setTimeDataArray] = useState([])
    const [dataForDateRender, setDataForDateRender] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const [requestCounter, setRequestCounter] = useState(0)
    // const [triggerStatus, setTriggerStatus] = useState("automatic")
    // var triggerStatus = "automatic"
    

    useEffect(() => {
      localStorage.setItem("counter", 0)

        if(sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }

        if (localStorage.getItem("enviorment") === "testing") {
            setBaseURL("127.0.0.1")
        } else if (localStorage.getItem("enviorment") === "production") {
            setBaseURL("192.168.80.222")
        }

        setDataForDateRender([[{type: 'warning', content: 'this is warning event'}, {type: 'success', content: 'This is usual event.'}], [{type: 'warning', content: 'this is warning event'}, {type: 'success', content: 'This is usual event.'}]])
    }, [])

    useEffect(() => {
      itemArrayGenerator(dataArray, timeDataArray)
    }, [dataArray, timeDataArray])

    // useEffect(() => {
    //   if(triggerStatus === "automatic"){
    //       setModalStatus(false)
    //   }
    // }, [triggerStatus])

    const carDistributionByDate = (value) => {
      axios.post(`http://${baseURL}:8000/welcome/api/fetchCarDistributionByDate`, {
        "date": value
      })

      .then((response) => {
          // console.log(response)
          let data = response.data
          let items = []
          let timeData = []
          for (let i = 0; i < data.length; i++) {
            let tmpItem = {}
            tmpItem["reason"] = data[i][1]
            tmpItem["applicant"] = data[i][2]
            tmpItem["department"] = data[i][3]
            tmpItem["location"] = data[i][4]
            tmpItem["destination"] = data[i][5]
            tmpItem["start_time"] = data[i][6]
            tmpItem["end_time"] = data[i][7]
            tmpItem["audit"] = "?????????"
            items.push(tmpItem)
            timeData.push(data[i][6])
          }
          setDataArray(items)
          setTimeDataArray(timeData)
          return {items, timeData}
      })
    }
  
    const monthCellRender = (value) => {
        const num = getMonthData(value);
        setModalStatus(false)
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
    };

    const onSelect = (newValue) => {
        setModalTitle(newValue.format('YYYY-MM-DD'))
        carDistributionByDate(newValue.format('YYYY-MM-DD'))

        let tmpData = getListData(newValue)
        if(tmpData.length === 0){
          // showDrawer()
          setModalStatus(false)
        } else {
          setModalStatus(true)
        }
    };

    const onPanelChange = (newValue, mode) => {
        setValue(newValue);
        // console.log(mode)
    };

    // const dateCellRender = (value) => {
    //     const listData = getListData(value);
    //     return (
    //         <ul className="events">
    //         {listData.map((item) => (
    //             <li key={item.content}>
    //             <Badge status={item.type} text={item.content} />
    //             </li>
    //         ))}
    //         </ul>
    //     );
    // };

    function queryDateData(value){
      return new Promise((resolve, reject) => {
        axios.post(`http://${baseURL}:8000/welcome/api/queryDateData`, {
          date: value.format('YYYY-MM-DD'),
          userGroupName: sessionStorage.getItem("userGroupName")
        })
  
        .then(res => {
          resolve(res)
        })

        .catch(err => {
          reject(err)
        })
      })
    }

    var testVar = 0

      const DateCellRender = (value) => {
        // console.log(value.format('YYYY-MM-DD'))
        // if(testVar === 0){
        //   console.log("triggered")
        //   testVar = 1
        //   queryDateData(value).then(res => {
        //     let data = res.data
        //     console.log(data)
        //   })
        // }

        queryDateData(value).then(res => {
          let data = res.data
          console.log(data)
        })

        const listData = getListData(value);
        return (
            <ul className="events">
            {listData.map((item) => (
                <li key={item.content}>
                <Badge status={item.type} text={item.content} />
                </li>
            ))}
            </ul>
        );
      };

      const getListData = (value) => {
          if(dataForDateRender[value.date() - 1] === undefined){
            return []
          } else {
            return dataForDateRender[value.date() - 1];
          }
      };

    const showDrawer = () => {
      setDrawerStatus(true);
    };

    const onClose = () => {
      setDrawerStatus(false);
      form.resetFields();
    };

    const onChange = (value, dateString, type) => {
        if (type === "start_time") {
            setStartTime(dateString)
        } else if (type === "end_time") {
            setEndTime(dateString)
        }
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        let reason = values["reason"]
        let applicant = values["applicant"]
        let department = values["department"]
        let location = values["location"]
        let destination = values["destination"]
        let start_time = startTime
        let end_time = endTime

        if (endTime < startTime) {
            // message.error("????????????????????????????????????")
            alert("????????????????????????????????????")
            return
        } else {
            axios.post(`http://${baseURL}:8000/welcome/api/insertNewSchedule`, {
                reason: reason,
                applicant: applicant,
                department: department,
                location: location,
                destination: destination,
                start_time: start_time,
                end_time: end_time
            })
            .then(res => {
                console.log(res)
                if (res.data === 1) {
                    alert("????????????")
                    onClose()
                    openNotificationWithIcon('success')
                } else {
                    alert("????????????")
                }
            })
        }
    };

    const openNotificationWithIcon = (type) => {
        api[type]({
          message: '????????????',
          description:
            "????????????????????????????????????????????????",
        });
    };

    const itemArrayGenerator = (items, details) => {
      var itemArray = []
      for (var i = 0; i < details.length; i++) {
        itemArray.push({
          label: details[i],
          key: i,
          children: 
            <>
              <p>????????????: {items[i]["reason"]}</p>
              <p>?????????: {items[i]["applicant"]}</p>
              <p>????????????: {items[i]["department"]}</p>
              <p>????????????: {items[i]["location"]}</p>
              <p>?????????: {items[i]["destination"]}</p>
              <p>????????????: {items[i]["start_time"]}</p>
              <p>????????????: {items[i]["end_time"]}</p>
              <p>????????????: {items[i]["audit"]}</p>
            </>,
        })
      }
      setItemsArray(itemArray)
      return itemArray
    }

    return (
      <>
        <Button type="primary" style={{"margin": 20, "left": "45%"}} onClick={() => showDrawer()}> ???????????? </Button>
        {/* <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} onSelect={onSelect} onPanelChange={onPanelChange} /> */}
        {/* <Calendar dateCellRender={autoTrigger} monthCellRender={monthCellRender} onSelect={(date) => {onSelect(date)}} onPanelChange={onPanelChange} /> */}
        <Calendar dateCellRender={DateCellRender} onSelect={onSelect} onPanelChange={onPanelChange} />

        <Modal
          title={modalTitle}
          centered
          open={modalStatus && false}
          // open={modalStatus}
          onOk={() => setModalStatus(false)}
          onCancel={() => setModalStatus(false)}
          width={500}
          footer={[
            <Button type="primary" onClick={() => showDrawer()}>
              ????????????
            </Button>,
            <Button key="submit" type="primary" danger onClick={() => setModalStatus(false)}>
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
          // extra={
          //   <Space>
          //     <Button type="primary" danger onClick={onClose}>??????</Button>
          //     <Button htmlType="submit" form={form} type="primary">
          //       ??????
          //     </Button>
          //   </Space>
          // }
        >
          {/* <div style={{float: "left", width: "50%", marginTop: "2%"}}>
              <Timeline>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
              </Timeline>
          </div> */}

          <div style={{float: "left", width: "100%", marginTop: "2%"}}>
            <Form onFinish={onFinish} autoComplete="off" form={form}>
              <Form.Item label="????????????" name="reason">
                <Input placeholder="?????????????????????" />
              </Form.Item>
              <Form.Item label="?????????" name="applicant">
                <Input placeholder="??????????????????" />
              </Form.Item>
              <Form.Item label="????????????" name="department">
                <Input placeholder="?????????????????????" />
              </Form.Item>
              <Form.Item label="????????????" name="location">
                <Input placeholder="?????????????????????" />
              </Form.Item>
              <Form.Item label="?????????" name="destination">
                <Input placeholder="??????????????????" />
              </Form.Item>
              <Form.Item label="????????????" name="start_time">
                <Space direction="vertical" size={12}>
                  <DatePicker placeholder="???????????????????????????" showTime onChange={(value, dateString) => onChange(value, dateString, "start_time")} />
                </Space>
              </Form.Item>
              <Form.Item label="????????????" name="end_time">
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

export default CarDistributionSystem;