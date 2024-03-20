import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import React, { useCallback, useState } from 'react';
import '../containers/management/Management.css';
import ReactDragListView from "react-drag-listview";

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

const Demo = () => {
    const [columns, setColumns] = useState([
        {
            title: <span className="dragHandler">Key</span>,
            dataIndex: "key",
            render: (text) => <span>{text}</span>,
            width: 50,
        },
        {
            title: <span className="dragHandler">Name</span>,
            dataIndex: "name",
            width: 200,
        },
        {
            title: <span className="dragHandler">Gender</span>,
            dataIndex: "gender",
            width: 100,
        },
        {
            title: <span className="dragHandler">Age</span>,
            dataIndex: "age",
            width: 100,
        },
        {
            title: <span className="dragHandler">Address</span>,
            dataIndex: "address",
        },
    ]);

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

    const components = {
        header: {
            cell: ResizableTitle,
        },
    };

    const data = [
        {
            key: "1",
            name: "Boran",
            gender: "male",
            age: "12",
            address: "New York",
        },
        {
            key: "2",
            name: "JayChou",
            gender: "male",
            age: "38",
            address: "TaiWan",
        },
        {
            key: "3",
            name: "Lee",
            gender: "female",
            age: "22",
            address: "BeiJing",
        },
        {
            key: "4",
            name: "ChouTan",
            gender: "male",
            age: "31",
            address: "HangZhou",
        },
        {
            key: "5",
            name: "AiTing",
            gender: "female",
            age: "22",
            address: "Xi’An",
        },
    ];

    const columnsWithResize = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    }));

    return (
        // <div style={{display: "flex", justifyContent: "center"}}>
            <ReactDragListView.DragColumn {...dragProps}>
                <Table style={{ width: "100%" }} bordered components={components} columns={columnsWithResize} dataSource={data} />
            </ReactDragListView.DragColumn>
        // </div>
    );
};

export default Demo
