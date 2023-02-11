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
            tmpItem["audit"] = "待審核"
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
            // message.error("回程時間不可早於用車時間")
            alert("回程時間不可早於用車時間")
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
                    alert("新增成功")
                    onClose()
                    openNotificationWithIcon('success')
                } else {
                    alert("新增失敗")
                }
            })
        }
    };

    const openNotificationWithIcon = (type) => {
        api[type]({
          message: '新增成功',
          description:
            "您的申請已經成功送出，請等待審核",
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
              <p>申請事由: {items[i]["reason"]}</p>
              <p>申請人: {items[i]["applicant"]}</p>
              <p>派車單位: {items[i]["department"]}</p>
              <p>乘車地點: {items[i]["location"]}</p>
              <p>目的地: {items[i]["destination"]}</p>
              <p>用車時間: {items[i]["start_time"]}</p>
              <p>回程時間: {items[i]["end_time"]}</p>
              <p>審核狀態: {items[i]["audit"]}</p>
            </>,
        })
      }
      setItemsArray(itemArray)
      return itemArray
    }

    return (
      <>
        <Button type="primary" style={{"margin": 20, "left": "45%"}} onClick={() => showDrawer()}> 新派車單 </Button>
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
              新派車單
            </Button>,
            <Button key="submit" type="primary" danger onClick={() => setModalStatus(false)}>
              關閉
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
          title="新派車單"
          width={350}
          onClose={onClose}
          open={drawerStatus}
          bodyStyle={{
            paddingBottom: 80,
          }}
          // extra={
          //   <Space>
          //     <Button type="primary" danger onClick={onClose}>取消</Button>
          //     <Button htmlType="submit" form={form} type="primary">
          //       送出
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
              <Form.Item label="申請事由" name="reason">
                <Input placeholder="請輸入申請事由" />
              </Form.Item>
              <Form.Item label="申請人" name="applicant">
                <Input placeholder="請輸入申請人" />
              </Form.Item>
              <Form.Item label="派車單位" name="department">
                <Input placeholder="請輸入派車單位" />
              </Form.Item>
              <Form.Item label="乘車地點" name="location">
                <Input placeholder="請輸入乘車地點" />
              </Form.Item>
              <Form.Item label="目的地" name="destination">
                <Input placeholder="請輸入目的地" />
              </Form.Item>
              <Form.Item label="用車時間" name="start_time">
                <Space direction="vertical" size={12}>
                  <DatePicker placeholder="請選擇用車日期時間" showTime onChange={(value, dateString) => onChange(value, dateString, "start_time")} />
                </Space>
              </Form.Item>
              <Form.Item label="回程時間" name="end_time">
                  <DatePicker placeholder="請選擇回程日期時間" showTime onChange={(value, dateString) => onChange(value, dateString, "end_time")} />
              </Form.Item>
              <Form.Item>
                  <Button type="primary" htmlType="submit">送出</Button>
              </Form.Item>
            </Form>
          </div>
        </Drawer>

        {contextHolder}
      </>
    )
}

export default CarDistributionSystem;