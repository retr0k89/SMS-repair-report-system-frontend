import React, {useState, useEffect} from "react";
import { Button, Form, Input, InputNumber, message, Space } from 'antd';
import axios from 'axios';

const AnnouncementEdit = () => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [announcementOnDB, setAnnouncementOnDB] = useState("")
    const [content, setContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/welcome/api/getAnnouncement")
        .then(res => {
           console.log(res)
           setAnnouncementOnDB(res.data[0][1])
        })
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            announcement: announcementOnDB,
        });
    }, [announcementOnDB]);

    const success = () => {
        messageApi.open({
          type: 'success',
          content: '更新成功!!',
        });
    };

    const onFinish = () => {
        axios.post("http://127.0.0.1:8000/welcome/api/updateAnnouncement", {
            content: content
        })
        .then((res) => {
            console.log(res)
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
       </>
    )
}

export default AnnouncementEdit