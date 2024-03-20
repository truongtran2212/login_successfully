import { Button, Checkbox, Col, Collapse, Input, Modal, Row, Select, Spin, Table } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState, useCallback } from 'react'
import { localhost } from '../../server';
import BoxIcon from "./../../images/BoxInforImage.svg"
import ArrowPre from "./../../images/arrow/DoubleArrowPre.svg"
import ArrowNext from "./../../images/arrow/DoubleArrowNext.svg"
import ResetSizeImage from "./../../images/ResetIcon.svg"
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import { CheckOutlined, CloseOutlined, Loading3QuartersOutlined, RedoOutlined, UndoOutlined } from '@ant-design/icons';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GetDetailModelApi } from '../../api/usersApi';
import { Resizable } from 'react-resizable';
import ReactDragListView from "react-drag-listview";
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

// import 'react-resizable/css/styles.css';

const { createCanvas } = require('canvas');
const { Option } = Select;

const pdfjsLib = window.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const MySwal = withReactContent(Swal);
const openNotificationSweetAlert = (message) => {
  MySwal.fire({
    timer: 3000,
    // title: {message},
    html: <i style={{ fontSize: 16, margin: 0 }}>{message}</i>,
    icon: "error",
    // confirmButtonColor: "#fff",
    focusConfirm: false,
    // allowOutsideClick: false,
    showConfirmButton: false,
    customClass: {
      icon: "my-custom-icon-class", // Thêm class tùy chỉnh cho biểu tượng
      popup: "custom-notification",
      // confirmButton: "custom-confirm-btn"
      // image: "custom-image"
    },
    position: "top",
    // width: screenWindown768px === true ? "80%" : "20%",
  });
}


const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

function ModalDetail({ open, close, dataRecord }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [urlPDF, setUrlPDF] = React.useState();
  const [itemsClone, setItemsClone] = useState([])
  const [dataDetail, setDataDetail] = useState()
  const [degree, setDegree] = useState(0)

  const handleNextPage = () => {
    if (currentPage < urlPDF.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function dataURLtoFile(dataURL, fileName) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  const labelCollapse = (text) => {
    return (
      <>
        <span style={{ columnGap: 8 }}><img alt='' src={BoxIcon}></img>{text}</span>
      </>
    )
  }

  const ConverLocaleString = (text) => {
    if (text !== undefined && text !== null) {
      return text.toLocaleString()
    } else {
      return text
    }
  }

  const textNG = (text, record) => {
    if (record["Check result"] === "✖") {
      console.log(text)
      return <span style={{ color: "red" }}>{text}</span>
    } else {
      return <span>{text}</span>
    }
  }

  const [columns, setColumns] = useState([
    {
      title: 'No',
      dataIndex: 'No',
      key: 'No',
      width: 50,
      ellipsis: true,
      align: "left",
      resizable: true, // Enable resizing
      render: (text, record) => textNG(text, record)
    },
    {
      title: '項目名',
      dataIndex: '項目名',
      key: '項目名',
      // width: 150,
      ellipsis: true,
      align: "left",
      render: (text, record) => textNG(text, record)
    },
    {
      title: 'Field name',
      dataIndex: 'Field name',
      key: 'Field name',
      // width: 150,
      ellipsis: true,
      align: "left",
      render: (text, record) => textNG(text, record)
    },
    {
      title: 'Required Value',
      dataIndex: 'Required Value',
      key: 'Required Value',
      // width: 130,
      ellipsis: true,
      align: "left",
      render: (text, record) => textNG(text, record)
    },
    {
      title: <span>Checksheet<br></br> OCR value</span>,
      dataIndex: 'Checksheet OCR value',
      key: 'Checksheet OCR value',
      // width: 140,
      align: "left",
      ellipsis: true,
      render: (text, record) => textNG(text, record)
    },
    {
      title: <span>Name plate/ <br></br>Image OCR value</span>,
      dataIndex: 'Name plate/ Image OCR value',
      key: 'Name plate/ Image OCR value',
      // width: 100,
      align: "left",
      ellipsis: true,
      render: (text, record) => textNG(text, record)
    },
    {
      title: 'Check result',
      dataIndex: 'Check result',
      key: 'Check result',
      // width: 100,
      align: "left",
      ellipsis: true,
      render: (text, record) => text === "✖" ? <CloseOutlined style={{ color: "red", fontSize: 16 }} /> : text === "✔" ? <CheckOutlined style={{ color: "green", fontSize: 16 }} /> : text
    },
    {
      title: 'Remark',
      dataIndex: 'Remark',
      key: 'Remark',
      // width: 200,
      ellipsis: true,
      align: "left",
      render: (text, record) => textNG(text, record)
    },
  ]);

  // const columns = [
  //   {
  //     title: 'No',
  //     dataIndex: 'No',
  //     key: 'No',
  //     width: 50,
  //     ellipsis: true,
  //     align: "left",
  //     resizable: true, // Enable resizing
  //   },
  //   {
  //     title: 'Field name',
  //     dataIndex: 'Field name',
  //     key: 'Field name',
  //     // width: 150,
  //     ellipsis: true,
  //     align: "left",
  //   },
  //   {
  //     title: 'Required Value',
  //     dataIndex: 'Required Value',
  //     key: 'Required Value',
  //     width: 130,
  //     ellipsis: true,
  //     align: "left",
  //   },
  //   {
  //     title: 'Checksheet OCR value',
  //     dataIndex: 'Checksheet OCR value',
  //     key: 'Checksheet OCR value',
  //     // width: 140,
  //     align: "left",
  //     ellipsis: true,
  //   },
  //   {
  //     title: 'Name plate/ Image OCR value',
  //     dataIndex: 'Name plate/ Image OCR value',
  //     key: 'Name plate/ Image OCR value',
  //     // width: 150,
  //     align: "left",
  //     ellipsis: true,
  //   },
  //   {
  //     title: 'Check result',
  //     dataIndex: 'Check result',
  //     key: 'Check result',
  //     width: 100,
  //     align: "left",
  //     ellipsis: true,
  //   },
  //   {
  //     title: 'Remark',
  //     dataIndex: 'Remark',
  //     key: 'Remark',
  //     // width: 200,
  //     ellipsis: true,
  //     align: "left",
  //   },
  // ];

  const [dataSource, setDataSource] = useState([])
  const fetchDataDetail = () => {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("name_folder", dataRecord.name_folder);
    GetDetailModelApi({ name_folder: dataRecord.name_folder }).then(res => {
      setDataDetail(res.data)
      let data = []
      for (let i = 0; i < res.data.results.length; i++) {
        data.push({
          key: i + 1,
          label: labelCollapse(res.data.results[i].name_sheet),
          children: <DataTable columns={columns} dataSource={res.data.results[i].data_sheet} setColumns={setColumns} />,
        })
      }
      setDataSource(res.data.results[0].data_sheet)
      setUrlPDF(res.data.data_img)
      setItemsClone(data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchDataDetail()
  }, []);

  const onChange = (key) => {
    console.log(key);
  };

  const choosePage = (e) => {
    console.log(parseInt(e.target.value) <= urlPDF.length)
    if (parseInt(e.target.value) <= urlPDF.length) {
      setCurrentPage(parseInt(e.target.value))
    } else {
      setCurrentPage(1)
      document.getElementById("current_page").value = 1
      openNotificationSweetAlert(`Out of range`)
    }
  }

  const choosePageImg = (e) => {
    setCurrentPage(e)

    // if (parseInt(document.getElementById("current_page").value) <= urlPDF.length) {
    //   setCurrentPage(parseInt(document.getElementById("current_page").value))
    // } else {
    //   document.getElementById("current_page").value = currentPage
    //   setCurrentPage(currentPage)
    //   openNotificationSweetAlert(`Out of range`)
    // }
  }

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <Row
          style={{
            alignItems: "center",
            display: "flex",
            paddingBottom: "0.5%"
          }}
        >
          <Col span={5} style={{ display: "flex", alignItems: "center", columnGap: "1ch" }}>
            <Button onClick={() => resetTransform()} className='btn-reset'>
              <img style={{ cursor: "pointer", width: 16, height: 16 }} src={ResetSizeImage} alt='' />
            </Button>
          </Col>
          <Col span={14} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ float: "unset" }}>
              {urlPDF && urlPDF.length > 0 ? (
                <>
                  <Row style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Col span={3}>
                      <Button
                        // type="primary"
                        shape="round"
                        size="small"
                        // icon={<DoubleLeftOutlined style={{ color: "#516583" }} />}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className='btn-pagination'
                      >
                        <img src={ArrowPre} alt=''></img>
                      </Button>
                    </Col>
                    <Col span={16} style={{ padding: "0px 10px" }}>
                      <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/* <Input
                          id='current_page'
                          // value={currentPage}
                          onChange={(e) => changeValue(e)}
                          defaultValue={currentPage}
                          // maxLength={2}
                          onKeyPress={(e) => {
                            const charCode = e.which ? e.which : e.keyCode;
                            if (charCode === 13) {
                              choosePage(e)
                              e.preventDefault();
                            }
                          }}
                          style={{ width: "35%", padding: "0px 5px", textAlign: "center" }}></Input> */}
                        <Select
                          style={{
                            width: 50,
                            textAlign: "center"
                          }}
                          key="type_document1"
                          maxLength={3}
                          // maxTagCount="responsive"
                          onChange={(e) => choosePageImg(e)}
                          // optionFilterProp="children"
                          // optionLabelProp="data-label"
                          // getPopupContainer={getPopupContainer}
                          showSearch={true}
                          defaultValue={currentPage}
                        >
                          {urlPDF && urlPDF.map((item, index) => (
                            <Option style={{ paddingInlineEnd: "2px", textAlign: "center", paddingInlineStart: "2px" }} key={index + 1} value={index + 1}>
                              {index + 1}
                            </Option>
                          ))}
                        </Select>
                        &nbsp; / {urlPDF && urlPDF.length}
                      </span>
                    </Col>
                    <Col span={3}>
                      <Button
                        // type="primary"
                        shape="round"
                        size="small"
                        // icon={<DoubleRightOutlined style={{ color: "#516583" }} />}
                        onClick={handleNextPage}
                        disabled={currentPage === urlPDF.length}
                        className='btn-pagination'
                      >
                        <img src={ArrowNext} alt=''></img>
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : null}
            </span>
          </Col>
          <Col span={5} style={{ display: "flex", alignItems: "center", columnGap: "1ch", justifyContent: "flex-end" }}>
            <Button onClick={() => setDegree(degree - 90)} className='btn-reset'>
              {/* <img style={{ cursor: "pointer", width: 16, height: 16 }} src={ResetSizeImage} alt='' /> */}
              <RotateLeftIcon style={{ cursor: "pointer", width: 16, height: 16, fontSize: 16 }} />
            </Button>
            <Button onClick={() => setDegree(degree + 90)} className='btn-reset'>
              {/* <img style={{ cursor: "pointer", width: 16, height: 16 }} src={ResetSizeImage} alt='' /> */}
              <RotateRightIcon style={{ cursor: "pointer", width: 16, height: 16, fontSize: 16 }} />
            </Button>
          </Col>
          {/* <Col span={5} ><span className='text-pagi' style={{ float: "right" }}>{currentPage}/{urlPDF && urlPDF.length}</span></Col> */}
        </Row>
      </>
    );
  };

  const antIcon = <Loading3QuartersOutlined style={{ fontSize: 50 }} spin />;

  return (
    <>
      <Modal
        open={open}
        // onOk={handleOk}
        onCancel={close}
        width={'100%'}
        style={{ height: '60vh', top: 10 }}
        // closable={false}
        className="modal-detail"

        footer={false}
      // centered
      >
        {dataDetail !== undefined ?
          <Row>
            <Col
              span={8}
              style={{
                height: '100%',
                width: '100%',
                // justifyContent: 'center',
                // alignItems: 'center'
              }}
            >
              <div style={{ position: "relative" }}>
                <TransformWrapper>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <Controls />
                      <TransformComponent contentStyle={{ cursor: 'zoom-in', width: "100%", display: "flow", padding: "1% 1% 2%" }}>
                        {/* Your content to be zoomed goes here */}
                        <img
                          // src={urlPDF && localhost + '/' + urlPDF[currentPage - 1]}
                          src={`data:image/jpeg;base64,${urlPDF && urlPDF[currentPage - 1].base64}`}
                          // src={dataDetail !== undefined ? `${localhost + "/" + dataDetail.file_invoice[0].path}` : null}
                          style={{ width: "100%", height: "auto", maxHeight: "86vh", filter: "drop-shadow(2px 4px 6px black)", imageRendering: "unset", transform: `rotate(${degree + "deg"})` }}
                          alt="Zoomable"
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>

              </div>

            </Col>
            <Col span={16} style={{ paddingLeft: "2%" }}>

              {/* <ReactDragListView.DragColumn {...dragProps}>
                <Table
                  size='small'
                  dataSource={dataSource}
                  columns={columnsWithResize}
                  components={{
                    header: {
                      cell: ResizableTitle,
                    },
                  }}
                  scroll={{
                    x: 1100
                  }}
                  pagination={false}
                  bordered
                  className='table-detail-product'
                />
              </ReactDragListView.DragColumn> */}
              {/* <DataTable columns={columns} dataSource={dataSource} setColumns={setColumns} /> */}
              <Row style={{ rowGap: "1ch", paddingBottom: "1%" }}>

                <Col span={6}><span style={{ fontWeight: "bold" }}>Sent date:  </span>{dayjs(dataRecord.send_date).format("DD-MM-YYYY")}</Col>
                <Col span={6}><span style={{ fontWeight: "bold" }}>Checked date:  </span>{dayjs(dataRecord.checked_date).format("DD-MM-YYYY")}</Col>
                <Col span={6}><span style={{ fontWeight: "bold" }}>Model name:  </span>{dataRecord.model_name}</Col>
                <Col span={6}><span style={{ fontWeight: "bold" }}>Result:  </span><span style={{ fontWeight: "bold", color: dataRecord.status === "1" ? "#2EB85C" : dataRecord.status === "2" ? "#E55353" : "orange" }}>{dataRecord.name_status}</span></Col>

              </Row>

              <Collapse style={{ height: "88vh", overflowY: "auto", background: "#fff", border: "unset" }} expandIconPosition="end" size='small' items={itemsClone} defaultActiveKey={['1']} onChange={onChange} />
            </Col>
          </Row>
          :
          <Row style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin indicator={antIcon} spinning={true} size="large"></Spin>
          </Row>
        }
      </Modal>
    </>
  )
}

const DataTable = ({ columns, dataSource, setColumns }) => {
  const handleResize = useCallback(
    (index) => (e, { size }) => {
      setColumns((prevColumns) => {
        const nextColumns = [...prevColumns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    },
    []
  );

  // const components = {
  //   header: {
  //     cell: ResizableTitle,
  //   },
  // };

  const columnsWithResize = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));
  const dragProps = {
    onDragEnd: useCallback(
      (fromIndex, toIndex) => {
        const updatedColumns = [...columns];
        const item = updatedColumns.splice(fromIndex, 1)[0];
        updatedColumns.splice(toIndex, 0, item);
        setColumns(updatedColumns);
      },
      [columns]
    ),
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };
  return (
    <>
      <ReactDragListView.DragColumn {...dragProps}>
        <Table
          scroll={{
            y: "40vh"
          }}
          size='small'
          dataSource={dataSource}
          columns={columns}
          // components={{
          //   header: {
          //     cell: ResizableTitle,
          //   },
          // }}
          pagination={false}
          bordered
          className='table-detail-product'
        />
      </ReactDragListView.DragColumn>
    </>
  )
}


export default ModalDetail