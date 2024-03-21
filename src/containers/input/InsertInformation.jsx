
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { localhost } from '../../server';
import LoadingIcon from "./../../images/iconLoading.svg"
import "./InsertInformation.css"
import { Splide } from '@splidejs/react-splide';
const { createCanvas } = require('canvas');

const InsertInformation = ({ open, setIsOpenDetail }) => {
    const [form] = Form.useForm();
    const [indexImage, setIndexImage] = useState(0)
    const [mainImageURL, setMainImageURL] = useState()
    const [thumbnailURL, setThumbnailURL] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [dataDetail, setDataDetail] = useState()
    const [loadingImage, setLoadingImage] = useState(true)
    const [loadingTable, setLoadingTable] = useState(true)
    const [listDataDefault, setListDataDefault] = useState([])
    const convertToImage = (value) => {
        let arrData = []
        for (let i = 0; i < value.lst_thum_base64.length; i++) {
            arrData.push(`data:image/jpeg;base64,${value.lst_thum_base64[i]}`)
        }
        setThumbnailURL(arrData)
        setMainImageURL(`data:image/jpeg;base64,${value.img_base64}`)
        setLoadingImage(false)
    }
    const inputRef = useRef(null);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'row_number',
            key: 'row_number',
            align: "center",
            ellipsis: true,
            width: 40,
        },
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            align: "center",
            ellipsis: true,
            width: 40,
        },

        {
            title: 'JP field name',
            dataIndex: 'jp_field_name',
            key: 'jp_field_name',
            align: "center",
            ellipsis: true,
            width: 80,
        },

        {
            title: 'EN field name',
            dataIndex: 'en_field_name',
            key: 'en_field_name',
            align: "center",
            ellipsis: true,
            width: 80,

        },
        {
            title: 'Required value',
            dataIndex: 'required_value',
            key: 'required_value',
            align: "center",
            ellipsis: true,
            width: 100,
            render: (text, record, index) => (
                formInsert(index, text, 'required_value', record)
            )
        },
        {
            title: 'Checksheet OCR value',
            dataIndex: 'checksheet_ocr_value',
            key: 'checksheet_ocr_value',
            align: "center",
            ellipsis: true,
            width: 120,
            render: (text, record, index) => (
                formInsert(index, text, 'checksheet_ocr_value', record)
            )
        },
        {
            title: 'Nameplate OCR value',
            dataIndex: 'nameplate_ocr_value',
            key: 'nameplate_ocr_value',
            align: "center",
            ellipsis: true,
            width: 120,
            render: (text, record, index) => (
                formInsert(index, text, 'nameplate_ocr_value', record)
            )
        },
        {
            title: 'Check result',
            dataIndex: 'check_result',
            key: 'check_result',
            align: "center",
            ellipsis: true,
            width: 100,
            render: (text, record, index) => (
                formInsert(index, text, 'check_result', record)
            )
        },
    ];

    const [inputValue, setInputValue] = useState(''); // Sử dụng state để lưu trữ giá trị của ô input


    const handleKeyPress = (event, dataIndex, index) => {
        console.log(123)
        var test = document.getElementById(dataIndex + index)
        if (event.ctrlKey && event.key === '1') {
            // test.value = '☑'
            setInputValue('123')
            // event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt (ví dụ: tìm kiếm trang)
        }
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    };


    const formInsert = (index, text, dataIndex, record) => {
        return <Form.Item
            name={["data_add", index, dataIndex]}
            label={""}
            rules={[{ required: true, message: "" }]}
            key={dataIndex}
            className='insert-infor'
        >
            <Input
                value={inputValue} id={dataIndex + index} onKeyDown={(event) => handleKeyPress(event, dataIndex, index)}></Input>
        </Form.Item>
    }

    useEffect(() => {
        const handleKeyPress = (event) => {
            console.log(event.key)
            if (event.ctrlKey && event.key === '1') {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt (ví dụ: tìm kiếm trang)
            }
        };
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const fetchDataInsert = () => {
        setLoadingTable(true)
        const FormData = require('form-data');
        let data = new FormData();
        data.append('pumb_model', "LK");
        data.append('user_lvl', 1);
        let arrData = []
        axios.post(`${localhost}/get_fields`, data).then(res => {
            setDataSource(res.data.list_fields)
            for (let i = 0; i < res.data.list_fields.length; i++) {
                arrData.push({
                    en_field_name: res.data.list_fields[i].en_field_name,
                    jp_field_name: res.data.list_fields[i].jp_field_name,
                    no: res.data.list_fields[i].no,
                    row_number: res.data.list_fields[i].row_number,
                    sheet_name: res.data.list_fields[i].sheet_name,
                })
            }
            console.log(res)
            console.log(arrData)
            setListDataDefault(arrData)
            setLoadingTable(false)
        }).catch(err => {
            setLoadingTable(false)
            console.log(err)
        })
    }

    const fetchListImage = (index, data) => {
        setLoadingImage(true)
        axios.post(`${localhost}/file_details`, {
            pack_file_path: data.pack_list_file_path[0][index],
            pack_list_thumbnail_path: data.pack_list_file_path[0]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            convertToImage(res.data)
        }).catch(err => {
            setLoadingImage(false)
        })
    }

    const fetchUserPackage = () => {
        const FormData = require('form-data');
        let data = new FormData();
        data.append('user_lvl', 1);

        axios.post(`${localhost}/get_user_package`, data).then(res => {
            // setDataSource(res.data.list_fields)
            setDataDetail(res.data)
            fetchListImage(0, res.data)
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const returnPackage = () => {
        const FormData = require('form-data');
        let data = new FormData();
        data.append('user_lvl', 1);
        data.append('pack_id', 1);
        data.append('pack_info', 1);

        axios.post(`${localhost}/return_package`, data).then(res => {
            // setDataSource(res.data.list_fields)
            setDataDetail(res.data)
            fetchListImage(0, res.data)
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    // useEffect(() => {
    //     fetchListImage(indexImage)
    // }, [indexImage]);

    const onFinish = (values) => {
        console.log(values)
        let arr3 = values.data_add.map((item, i) => Object.assign({}, item, listDataDefault[i]));
        console.log(arr3)

        axios.post(`${localhost}/submit_user_package`, {
            user_Id: 2,
            user_lvl: 1,
            pack_id: 2,
            pack_info: "2403_Data_L1",
            pack_table: "2403_Package",
            qualified: true,
            list_fields: arr3
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchDataInsert()
        fetchUserPackage()
    }, []);

    const changeMainImage = (index) => {
        setIndexImage(index)
        if (index !== indexImage) {
            fetchListImage(index, dataDetail)
        }
    }
    return (
        <Row>
            <Col span={9}>
                <div style={{ position: "relative", paddingTop: "2%" }} className='size-image'>
                    <TransformWrapper initialScale={1}>
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <TransformComponent contentStyle={{ cursor: 'zoom-in', width: "100%", display: "flex", padding: "1% 1% 2%", height: "76vh", justifyContent: "center" }}>
                                    {loadingImage === false ?
                                        <img
                                            src={mainImageURL}
                                            style={{ width: "96%", height: "74vh", filter: "drop-shadow(2px 4px 6px black)", imageRendering: "unset" }}
                                            alt="Hình ảnh"
                                        />
                                        :
                                        <img src={LoadingIcon} className='load-image' alt=''></img>
                                    }
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>
                </div>
                <div className='thumbnail-class'>
                    {thumbnailURL.map((item, index) => (
                        <img onClick={() => changeMainImage(index)} style={{ border: index === indexImage ? "2px solid red" : null }} src={item} alt=''></img>
                    ))}
                </div>
            </Col>

            <Col span={15} style={{ height: "90vh", padding: "1% 1%" }}>
                <Form onFinish={onFinish}>
                    <Table size="small" loading={loadingTable} columns={columns} dataSource={dataSource} pagination={false} scroll={{
                        y: "75vh",
                    }}>
                    </Table>
                    <Button style={{ float: "right", marginTop: "1%", fontWeight: "bold" }} type='primary' htmlType='submit'>
                        SAVE
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}

export default InsertInformation