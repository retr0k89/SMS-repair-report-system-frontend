import React, {useState, useEffect} from "react";
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const AnnouncementEdit = () => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [announcementOnDB, setAnnouncementOnDB] = useState("")
    const [content, setContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        md5alterVerify()
        identityVerify()
        axios.get(`http://${sessionStorage.getItem("server")}:8000/welcome/api/getAnnouncement`)
        .then(res => {
           setAnnouncementOnDB(res.data[0][1])
        })

        if(sessionStorage.getItem("username") === null) {
            window.location.href = "/login"
        }
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            announcement: announcementOnDB,
        });
    }, [announcementOnDB]);

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

    const success = () => {
        messageApi.open({
          type: 'success',
          content: '更新成功!!',
        });
    };

    const onFinish = () => {
        axios.post(`http://${sessionStorage.getItem("server")}:8000/welcome/api/updateAnnouncement`, {
            content: content
        })
        .then((res) => {
            success()
        })
    }

    return (
       <>
            <Form style={{width: "50%"}} onFinish={onFinish} form={form}>
                <div style={{marginTop: 20}}>
                    <Form.Item name="announcement" label="公告內容:">
                        <TextArea rows={4} onChange={e => {setContent(e.target.value)}}/>
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button htmlType="submit">送出</Button>
                </Form.Item>
            </Form>

            {contextHolder}
       </>
    )
}

export default AnnouncementEdit