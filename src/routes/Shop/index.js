import React from 'react'
import { Avatar,Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {getPresents} from '../../network/present'

const data8 = [];
for (let i = 0; i < 100; i++) {
    data8.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber/>;
        }
        return <Input/>;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{margin: 0}}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class TableDemo extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        loading: false,
        data: [],
        pagination: {
            pageSize: 8
        },
        count: 2,
        editingKey: '',
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns = [
        {
            title: '礼品ID',
            dataIndex: 'id',
            width: '5%',
            editable: false,
        },
        {
            title: '礼品名',
            dataIndex: 'title',
            width: '10%',
            editable: true,
        },
        {
            title: '封面',
            dataIndex: 'cover',
            width: '5%',
            editable: false,
            render(src) {
                return <Avatar shape="square" src={src} size="large" />
            }
        },
        {
            title: '分类',
            dataIndex: 'categorystr',
            filters: [
                {text: '类别1', value: '类别1'},
                {text: '类别2', value: '类别2'},
            ],
            editable: false,
            width:'8%'
        },
        {
            title: '礼品介绍',
            dataIndex: 'decription',
            editable: true,
            width:'15%'
        },
        {
            title: '上架时间',
            dataIndex: 'created_at',
            editable: false,
            width:'10%'
        },
        {
            title: '售卖价格',
            dataIndex: 'price',
            editable: true,
            width:'10%'
        },
        {
            title: '热度',
            dataIndex: 'hot',
            editable: false,
            width:'8%'
        },
        {
            title: '打折状态',
            dataIndex: 'off',
            editable: true,
            width:'5%'
        },
        {
            title: '折扣',
            dataIndex: 'offcost',
            editable: true,
            width:'5%'
        },
        {
            title: '编辑',
            dataIndex: 'edit',
            render: (text, record) => {
                const editable = this.isEditing(record);
                console.log(record)
                return (
                    <div>
                        {editable ? (
                            <span>
                                <EditableContext.Consumer>
                                    {form => (
                                        <a

                                            onClick={() => this.save(form, record.id)}
                                            style={{marginRight: 8}}
                                        >
                                            Save
                                        </a>
                                    )}
                                </EditableContext.Consumer>
                                <Popconfirm
                                    title="取消？"
                                    onConfirm={() => this.cancel(record.id)}
                                >
                                    <a>取消</a>
                                </Popconfirm>
                            </span>
                        ) : (
                            <a onClick={() => this.edit(record.id)}>Edit</a>
                        )}
                    </div>
                );
            },
        },
        {
            title: '删除',
            dataIndex: 'delete',
            width:'7%',
            render: (text, record) => {
                return (
                    this.state.data.length > 1 ?
                        <Popconfirm title="删除?" onConfirm={() => this.onDelete(record.id)}>
                            <a>删除</a>
                        </Popconfirm> : null
                )
            }
        }
    ]


    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        })
    }
    clearFilters = () => {
        this.setState({filteredInfo: null})
    }
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        })
    }
    setSort = (type) => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: type,
            },
        })
    }

    async getRemoteData(params) {
        this.setState({
            loading: true
        })
        const resp = await getPresents()
        const pagination = {...this.state.pagination};
        pagination.total = 200
        // debugger
        this.setState({
            loading: false,
            data: resp.data,
            pagination
        })
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getRemoteData({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        })
    }
    onDelete = (key) => {
        const arr = this.state.data.slice()
        this.setState({
            data: arr.filter(item => item.id !== key)
        })
    }
    handleAdd = () => {
        const {data, count} = this.state //本来想用data的length来代替count，但是删除行后，length会-1
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            data: [...data, newData],
            count: count + 1
        })
    }
    isEditing = (record) => {
        return record.id === this.state.editingKey;
    };

    edit(key) {
        console.log(key)
        this.setState({editingKey: key});
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({data: newData, editingKey: ''});
            } else {
                newData.push(data8);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    cancel = () => {
        this.setState({editingKey: ''});
    };

    render() {
        const rowSelection = {
            selections: true
        }
        let {sortedInfo, filteredInfo} = this.state
        sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        }
        const columns = this.columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: record => ({
              record,
              inputType: col.dataIndex === 'age' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record),
            }),
          };
        })
        return (
            <div>
                <CustomBreadcrumb arr={[ '商城']}/>
                <Card bordered={false} title='商品目录' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
                    <p>
                        <Button onClick={this.handleAdd}>添加行</Button>
                    </p>
                    <Table bordered components={components} dataSource={this.state.data} columns={columns} style={styles.tableStyle}/>
                </Card>
                <BackTop visibilityHeight={200} style={{right: 50}}/>
            </div>
        )
    }
}

const styles = {
    tableStyle: {
        width: '100%'
    },
    affixBox: {
        position: 'absolute',
        top: 100,
        right: 50,
        with: 170
    }
}

export default TableDemo

