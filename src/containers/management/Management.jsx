import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Table } from 'antd'
import DetailIcon from "./../../images/ViewDetail.svg"
import SearchIcon from "./../../images/search.svg"
import ResetFields from "./../../images/ResetFieldFilter.svg"
import DownloadIcon from "./../../images/DownloadIcon.svg"
import UploadIcon from "./../../images/UploadIcon.svg"

import "./Management.css"
import { GetListModelsApi } from '../../api/usersApi';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs'
import ModalDetail from './ModalDetail'
const { RangePicker } = DatePicker;
const { Option } = Select;

function Management() {
  const [dataSource, setDataSource] = useState([])
  const [dataSourceSearch, setDataSourceSearch] = useState([])
  const [form] = Form.useForm();
  const userInfo = useSelector((state) => state.getUserInfo.userInfo);
  const [status, setStatus] = useState([])
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
  const [dataRecord, setDataRecord] = useState()
  const [pager, setPager] = useState({
    pageSize: 10,
    count: 0,
    current: 1,
  });

  const [fieldFilter, setFieldFilter] = useState({
    mfg_no: null,
    model_name: null,
    send_date: null,
    status: null
  })

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const openModalDetail = (value) => {
    setDataRecord(value)
    setIsOpenModalDetail(true)
  }

  const customColorStatus = (text) => {
    if (text.toLowerCase() === 'not qualified') {
      return { color: "#E55353" }
    }
    else if (text.toLowerCase() === 'need information') {
      return { color: "orange" }
    }
    else if (text.toLowerCase() === 'qualified') {
      return { color: "#2EB85C" }
    }
  }

  // const dataSource = [
  //   {
  //     stt: 1,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Qualified",
  //   },
  //   {
  //     stt: 2,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Not qualified",
  //   },
  //   {
  //     stt: 3,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Need information",
  //   },
  //   {
  //     stt: 4,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Not qualified",
  //   },
  //   {
  //     stt: 5,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Qualified",
  //   },
  //   {
  //     stt: 6,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Need information",
  //   },
  //   {
  //     stt: 7,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Need information",
  //   },
  //   {
  //     stt: 8,
  //     model_name: "abc123",
  //     sent_date: "10-10-2023",
  //     checked_date: "11-11-2023",
  //     result: "Qualified",
  //   },
  // ]

  const columns = [
    {
      title: 'No.',
      dataIndex: 'stt',
      key: 'stt',
      align: "center",
      ellipsis: true,
      width: 60,
      render: (value, item, index) =>
        index + 1 + (pager.current - 1) * pager.pageSize,
    },

    {
      title: 'MFG No.',
      dataIndex: 'mfg_no',
      key: 'mfg_no',
      align: "center",
      ellipsis: true,
      width: 150
    },

    {
      title: 'Model Name',
      dataIndex: 'model_name',
      key: 'model_name',
      align: "center",
      ellipsis: true,
      width: 150
    },

    {
      title: 'Sent Date',
      dataIndex: 'send_date',
      key: 'send_date',
      align: "center",
      ellipsis: true,
      width: 150,
      render: (text, record) => text !== undefined && text !== null ? dayjs(text).format("DD/MM/YYYY") : null
    },

    {
      title: 'Checked Date',
      dataIndex: 'checked_date',
      key: 'checked_date',
      align: "center",
      ellipsis: true,
      width: 200,
      render: (text, record) => text !== undefined && text !== null ? dayjs(text).format("DD/MM/YYYY") : null
    },

    {
      title: 'Result',
      dataIndex: 'name_status',
      key: 'name_status',
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        return (<>
          {/* <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}> */}
          <p className='text-result' style={customColorStatus(text)}>{text}</p>
          {/* </div> */}
        </>)
      }
    },

    {
      title: 'Details',
      dataIndex: 'view_detail',
      key: 'view_detail',
      align: "center",
      ellipsis: true,
      width: 150,
      render: (text, record) =>
        <Row style={{ justifyContent: "center", alignItems: "center", columnGap: "1.5ch" }}>
          <img style={{ cursor: "pointer" }} alt='' src={DownloadIcon}></img>
          <img style={{ cursor: "pointer" }} alt='' src={UploadIcon}></img>
          <img style={{ cursor: "pointer" }} onClick={() => openModalDetail(record)} src={DetailIcon} alt=''></img>
        </Row>
    },
  ];

  const fetchDataImage = (params = {}) => {
    GetListModelsApi(params).then(res => {
      console.log(params)
      setPager({
        current: params.page,
        pageSize: params.page_size,
        count: res.data.count,
      });
      console.log(res)
      setDataSource(res.data.results)
      setDataSourceSearch(res.data.results)
      setStatus(res.data.data_status)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    const id = setInterval(() => {
      fetchDataImage({ page: 1, page_size: pager.pageSize });
      clearInterval(id);
    }, 300);
    return () => clearInterval(id);
  }, []);

  const onFinish = (values) => {
    const listType = ['', '[]', 'undefined']
    if (listType.includes(String(values.mfg_no)) && listType.includes(String(values.model_name)) && listType.includes(String(values.sent_date)) && listType.includes(String(values.result))) {
      fetchDataImage(
        {
          page: 1,
          page_size: pager.pageSize,
        }
      )
    } else {
      fetchDataImage(
        {
          page: 1,
          page_size: pager.pageSize,
          mfg_no: values.mfg_no !== undefined ? values.mfg_no.trim() : null,
          model_name: values.model_name !== undefined ? values.model_name.trim() : null,
          send_date: values.sent_date !== undefined && values.sent_date !== null ? dayjs(values.sent_date).format("YYYY-MM-DD") : null,
          status: JSON.stringify(values.result)
        }
      )
    }

    // if (listType.includes(String(values.mfg_no)) && listType.includes(String(values.model_name)) && listType.includes(String(values.sent_date)) && listType.includes(String(values.result))) {
    //   setDataSourceSearch(dataSource)
    // } else {
    //   const newData = dataSource.filter(item =)
    // }


    console.log(values)
    setFieldFilter({
      mfg_no: values.mfg_no !== undefined ? values.mfg_no.trim() : null,
      model_name: values.model_name !== undefined ? values.model_name.trim() : null,
      send_date: values.sent_date !== undefined && values.sent_date !== null ? dayjs(values.sent_date).format("YYYY-MM-DD") : null,
      status: JSON.stringify(values.result)
    })
  }

  const handleClose = () => {
    setIsOpenModalDetail(false)
  }

  const resetData = () => {
    form.resetFields();
    setFieldFilter({
      mfg_no: null,
      model_name: null,
      send_date: null,
      status: null
    })
    fetchDataImage({
      page: 1,
      page_size: pager.pageSize,
    })
  }

  const handleChange = (pagination) => {
    const currentPager = { ...pager };
    currentPager.current = pagination.current;
    currentPager.pageSize = 10;
    setPager({ ...currentPager });
    console.log(fieldFilter)
    fetchDataImage({
      page: pagination.current,
      page_size: pagination.pageSize,
      mfg_no: fieldFilter.mfg_no,
      model_name: fieldFilter.model_name,
      send_date: fieldFilter.sent_date,
      status: fieldFilter.status
    });
  };
  return (
    <>
      <div className='element-center' style={{ padding: "1.5%" }}>
        <div style={{ background: "aliceblue", width: "96%", height: "85vh", borderRadius: 20, padding: "1.5%", boxShadow: "2px 4px 16px -2px #00000075" }}>
          <Row className='element-center'>
            <Form
              form={form}
              // initialValues={{
              //     username: username || "",
              //     password: password || "",
              // }}
              name="control-hooks"
              layout='vertical'
              onFinish={onFinish}
              style={{ width: "90%" }}
            // validateMessages={validateMessages}
            >
              <Row>
                <Col span={5}>
                  <Form.Item label="MFG No." name={"mfg_no"}>
                    <Input placeholder='Search MFG No.'></Input>
                  </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                  <Form.Item label="Model Name" name={"model_name"}>
                    <Input placeholder='Search Model Name'></Input>
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item name={"sent_date"} label="Sent Date">
                    <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item name={"result"} label="Result">
                    <Select
                      placeholder="Choose result"
                      style={{
                        width: "100%",
                      }}
                      key="type_document1"
                      allowClear
                      maxTagCount="responsive"
                      optionFilterProp="children"
                      mode='multiple'
                    // optionLabelProp="data-label"
                    // getPopupContainer={getPopupContainer}
                    >
                      {status.map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label={" "}>
                    <Button style={{ float: "right" }} htmlType='submit' className='btn-search'><img src={SearchIcon} alt=''></img></Button>
                    <Button className='btn-search' style={{ marginRight: "10%", float: "right" }} htmlType='button' onClick={resetData} ><img src={ResetFields} alt=''></img></Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Row>

          <Row className='element-center'>
            <h1>LIST OF MODELS</h1>
          </Row>
          <Row className='element-center'>
            <Table
              style={{ width: "90%" }}
              onChange={handleChange}
              scroll={{
                y: "48vh"
              }}
              pagination={{
                current: pager.current,
                pageSize: pager.pageSize,
                total: pager.count,
                // showQuickJumper: true,
                // locale: {
                //   jump_to: "Đến trang: ",
                //   page: "",
                // },
                // pageSizeOptions: ["10", "15", "25", "50"],
                // showSizeChanger: true,
              }} size='small' columns={columns} dataSource={dataSource}>
            </Table>
          </Row>
        </div>
        {isOpenModalDetail === true ?
          <ModalDetail
            open={isOpenModalDetail}
            close={handleClose}
            dataRecord={dataRecord}
          />
          : null}
      </div>
    </>
  )
}

export default Management