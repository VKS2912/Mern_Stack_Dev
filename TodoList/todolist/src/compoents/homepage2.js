import React, { useState } from "react";
import moment from "moment";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import './home.css'
import { Table, Tag, Button, Modal, Form, Input, DatePicker, Select } from "antd";
import ProTable from "@ant-design/pro-table";
import locale from 'antd/es/date-picker/locale/en_US';
import "antd/dist/reset.css";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

const ProTableDemo = () => {
 const [original,setOriginal] = useState([
   {
      key: "1",
      title: "Task 1",
      description: "Description for Task 1",
      date: "2023-04-08",
      tags: ["tag1", "tag2"],
      status: "Working",
    },
    {
      key: "2",
      title: "Task 2",
      description: "Description for Task 2",
      date: "2023-04-09",
      tags: ["tag1"],
      status: "Open",
    },
    {
      key: "3",
      title: "Task 3",
      description: "Description for Task 3",
      date: "2023-04-10",
      tags: ["tag3"],
      status: "Done",
    },{
      key: "4",
      title: "Task 4",
      description: "Description for Task 4",
      date: "2023-04-09",
      tags: ["tag4", "tag2"],
      status: "Working",
    },
    {
      key: "5",
      title: "Task 5",
      description: "Description for Task 5",
      date: "2023-04-10",
      tags: ["tag5"],
      status: "Open",
    },
    {
      key: "6",
      title: "Task 6",
      description: "Description for Task 6",
      date: "2023-04-12",
      tags: ["tag3","tag6"],
      status: "Open",
    },{
      key: "7",
      title: "Task 7",
      description: "Description for Task 7",
      date: "2023-04-12",
      tags: ["tag7", "tag5"],
      status: "Working",
    },
    {
      key: "8",
      title: "Task 8",
      description: "Description for Task 8",
      date: "2023-04-13",
      tags: ["tag2","tag8","tag4"],
      status: "Open",
    },
    {
      key: "9",
      title: "Task 9",
      description: "Description for Task 9",
      date: "2023-04-11",
      tags: ["tag9","tag3",],
      status: "Done",
    },{
      key: "10",
      title: "Task 10",
      description: "Description for Task 10",
      date: "2023-04-15",
      tags: ["tag5", "tag2"],
      status: "Working",
    },
    {
      key: "11",
      title: "Task 11",
      description: "Description for Task 11",
      date: "2023-04-13",
      tags: ["tag11","tag5","tag6"],
      status: "Open",
    },
    {
      key: "12",
      title: "Task 12",
      description: "Description for Task 12",
      date: "2023-04-14",
      tags: ["tag3","tag6","tag9","tag12"],
      status: "Overdue",
    },
   ])
  const [data, setData] = useState([
    {
      key: "1",
      title: "Task 1",
      description: "Description for Task 1",
      date: "2023-04-08",
      tags: ["tag1", "tag2"],
      status: "Working",
    },
    {
      key: "2",
      title: "Task 2",
      description: "Description for Task 2",
      date: "2023-04-09",
      tags: ["tag1"],
      status: "Open",
    },
    {
      key: "3",
      title: "Task 3",
      description: "Description for Task 3",
      date: "2023-04-10",
      tags: ["tag3"],
      status: "Done",
    },{
      key: "4",
      title: "Task 4",
      description: "Description for Task 4",
      date: "2023-04-09",
      tags: ["tag4", "tag2"],
      status: "Working",
    },
    {
      key: "5",
      title: "Task 5",
      description: "Description for Task 5",
      date: "2023-04-10",
      tags: ["tag5"],
      status: "Open",
    },
    {
      key: "6",
      title: "Task 6",
      description: "Description for Task 6",
      date: "2023-04-12",
      tags: ["tag3","tag6"],
      status: "Open",
    },{
      key: "7",
      title: "Task 7",
      description: "Description for Task 7",
      date: "2023-04-12",
      tags: ["tag7", "tag5"],
      status: "Working",
    },
    {
      key: "8",
      title: "Task 8",
      description: "Description for Task 8",
      date: "2023-04-13",
      tags: ["tag2","tag8","tag4"],
      status: "Open",
    },
    {
      key: "9",
      title: "Task 9",
      description: "Description for Task 9",
      date: "2023-04-11",
      tags: ["tag9","tag3",],
      status: "Done",
    },{
      key: "10",
      title: "Task 10",
      description: "Description for Task 10",
      date: "2023-04-15",
      tags: ["tag5", "tag2"],
      status: "Working",
    },
    {
      key: "11",
      title: "Task 11",
      description: "Description for Task 11",
      date: "2023-04-13",
      tags: ["tag11","tag5","tag6"],
      status: "Open",
    },
    {
      key: "12",
      title: "Task 12",
      description: "Description for Task 12",
      date: "2023-04-14",
      tags: ["tag3","tag6","tag9","tag12"],
      status: "Overdue",
    },
  ]);
  const [data2,setData2] = useState(data)
  console.log(data2)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [form] = Form.useForm();
  const [visible,setVisible] = useState(false)
  const columns = [
   {
    title: 'Timestamp Created',
    dataIndex: 'timestampCreated',
    valueType: 'dateTime',
    hideInTable: false,
    hideInSearch: false,
    initialValue: () => new Date(),
  },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
       sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),

    },
    {
      title: "Due Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags", sorter: (a, b) => a.tags.join(', ').localeCompare(b.tags.join(', ')),
      render: (tags) => (
        <>
          {Array.isArray(tags) && tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <Tag color={status === "Open" ? "orange" : status === "Working" ? "blue" : "green"}>
          {status}
        </Tag>
      ), 
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button type="link" style={{margin:2}} icon={<EditOutlined className="da" style={{color:'#117171'}} />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" style={{margin:2}} icon={<DeleteOutlined className="da"  style={{color:'#117171'}} />}  onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];
  const [key,setKey] = useState(3)
  const handleAdd = () => {
   setKey(key+1)
   console.log("in")
  form.validateFields().then((values) => {
    const newRow = {
      key: key,
      title: values.title,
      description: values.description,
      date: values.date.format("YYYY-MM-DD"),
      tags: values.tags,
      status: values.status,
    };
    setData([...data, newRow]);
    setData2([...data,newRow])
    setOriginal([...data,newRow])
    setVisible(false);
    form.resetFields();
  });
};

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      date: moment(record.date),
      tags: record.tags,
      status: record.status,
    });
  };

  const handleDelete = (record) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      const index = newData.findIndex((item) => item.key === selectedRecord.key);
      if (index > -1) {
        newData[index] = {
          ...selectedRecord,
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        };
        setData(newData);
        setOriginal(newData);
        setData2(newData)
        setEditModalVisible(false)
                  }})
      }
    
    const handleQuery = () => {
    setData([...data]);
  };
  const handleReset = () =>{
  
    setData(original);
    console.log(data,"reset")
  }

  return (

    <>
    <div style={{position:"absolute",top:0,left:0,height:90,width:'100%',backgroundColor:"#810000",zIndex:"9009"}}><span style={{fontSize:"1.9rem",color:"#EEEBDD",fontWeight:'bolder',marginTop:17}}>TodoList</span></div>
    <ConfigProvider locale={enUS}>
    
      <ProTable
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 7 }}
        style={{backgroundColor:"#810000"}}
        toolbar={{ search: {
          onSearch: (value) => {
            const filteredData = data.filter((item) =>
              Object.values(item).some((val) =>
                val.toString().toLowerCase().includes(value.toLowerCase())
              )
            );
            setData(filteredData);
          },
          placeholder: 'Search by any field',
        }, reset: {
          onReset: handleReset,
        },}}
        toolBarRender={() => [
          <Button key="add-column" onClick={() => setVisible(true)}>Add New Task</Button>,
          <Button key="reset" onClick={handleReset}>Reset</Button>,
        ]}
      />
      <Modal
        title="Edit Record"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker  locale={locale}
      format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Enter tags">
              <Option value="tag1">Tag 1</Option>
              <Option value="tag2">Tag 2</Option>
              <Option value="tag3">Tag 3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: "Required" }]}>
            <Select style={{ width: "100%" }} placeholder="Select status">
              <Option value="New">New</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
       <Modal
      visible={visible}
      title="Add New Record"
      onCancel={() => setVisible(false)}
      onOk={handleAdd}
      okText="Save"
      destroyOnClose
    >
     <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker  locale={locale}
      format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Enter tags">
              <Option value="tag1">Tag 1</Option>
              <Option value="tag2">Tag 2</Option>
              <Option value="tag3">Tag 3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: "Required" }]}>
            <Select style={{ width: "100%" }} placeholder="Select status">
              <Option value="New">New</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
    </Modal>
     </ConfigProvider>
    </>
  );
};

export default ProTableDemo;

