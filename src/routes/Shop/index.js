import React from 'react'
import { Avatar,Card, Popconfirm, Button,Switch, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {getPresents, delPresent, updPresent} from '../../network/present'

const {Search, TextArea} = Input

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
        switch( this.props.dataIndex) {
            case 'price':
            case 'offcost':
                return <InputNumber/>
            case 'description': 
                return <TextArea />
            case 'off': 
                return <Switch/>
            default:
             return <Input/>
        }
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
            width: '50px',
            editable: false,
        },
        {
            title: '礼品名',
            dataIndex: 'title',
            width: '170px',
            editable: true,
        },
        {
            title: '封面',
            dataIndex: 'cover',
            width: '100px',
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
            width:'80px'
        },
        {
            title: '礼品介绍',
            dataIndex: 'description',
            editable: true,
            width:'300px'
        },
        {
            title: '上架时间',
            dataIndex: 'created_at',
            editable: false,
            width:'100px'
        },
        {
            title: '售卖价格',
            dataIndex: 'price',
            editable: true,
            width:'100px'
        },
        {
            title: '热度',
            dataIndex: 'hot',
            editable: false,
            width:'80px'
        },
        {
            title: '打折状态',
            dataIndex: 'off',
            editable: true,
            width:'50px',
            render: (text, record) => (<Switch checked={text}/>)
        },
        {
            title: '折扣',
            dataIndex: 'offcost',
            editable: true,
            width:'80px'
        },
        {
            title: '编辑',
            dataIndex: 'edit',
            width: '200px',
            render: (text, record) => {
                const editable = this.isEditing(record);
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
                                            保存
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
                            <a onClick={() => this.edit(record.id)}>编辑</a>
                        )}
                    </div>
                );
            },
        },
        {
            title: '删除',
            dataIndex: 'delete',
            width:'200px',
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
        const resp = await getPresents(params)
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
    
    onDelete = async (key) => {
        const arr = this.state.data.slice()
        await delPresent(key)
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
        this.setState({editingKey: key});
    }

     save(form, key) {
        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.id);
            if (index > -1) {
                const item = newData[index];
                const newRow = {
                  ...item,
                  ...row,
                }
                newData.splice(index, 1, newRow);
                // error handler
                console.log(row, item)
                const resp = await updPresent(newRow)
                this.setState({data: newData, editingKey: ''});
            } else {
                // newData.push(data);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    orderState = {
      hot: 'desc',
      price: 'desc',
    }
    sortOrder(field) {
      const order = {
        type: field,
        order: this.orderState[field],
      }
      if (this.orderState[field] == 'desc') {
        this.orderState[field] = 'asc'
      }else {
        this.orderState[field] = 'desc'
      }
      this.getRemoteData(order)
    }
    handleSearch(value) {
      this.getRemoteData({q: value})
    }
    cancel = () => {
        this.setState({editingKey: ''});
    };

    render() {
        // let {sortedInfo, filteredInfo} = this.state
        // sortedInfo = sortedInfo || {}
        // filteredInfo = filteredInfo || {}
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        }
        const numberTypedCol = ['price', 'offcost']
        const columns = this.columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: record => ({
              record,
              inputType: numberTypedCol.includes(col.dataIndex) ? 'number' : 'text',
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
                        <Search
                            placeholder="input search text"
                            onSearch={value => this.handleSearch(value)}
                            style={{ width: 200 ,margin: 5}}
                        />
                        <Button onClick={() => this.sortOrder('price')} style={{margin:'0 15px'}}>价格排序</Button>
                        <Button onClick={() => this.sortOrder('hot')} >热度排序</Button>
                    </p>
                    <Table scroll={{x: 1500, y: 800}} bordered components={components} dataSource={this.state.data} columns={columns} style={styles.tableStyle}/>
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

