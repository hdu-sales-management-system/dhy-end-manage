import React from 'react'
import {Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix,Modal, Form, InputNumber, Input} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'


/*const columns4 = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: name => `${name.first} ${name.last}`,
        width: '10%',
    }, {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
        ],
        width: '10%',
    }, {
        title: 'Email',
        dataIndex: 'email',
        width:'20%',
    }

    ]*/



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
        data4: [],
        pagination: {
            pageSize: 8
        },
        data7: [{
            key: '0',
            name: 'Edward King 0',
            age: '32',
            address: 'London, Park Lane no. 0',
        }, {
            key: '1',
            name: 'Edward King 1',
            age: '32',
            address: 'London, Park Lane no. 1',
        }],
        count: 2,
        data8,
        editingKey: '',
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns7 = [
        {
            title: '礼品名',
            dataIndex: 'name',
            width: '15%',
            editable: true,
        },
        {
            title: '分类',
            dataIndex: 'category',
            filters: [
                {text: '类别1', value: '类别1'},
                {text: '类别2', value: '类别2'},
            ],
            editable: true,
            width:'15%'
        },
        {
            title: '库存',
            dataIndex: 'store_num',
            editable: true,
            width:'10%'
        },
        {
            title: '进货时间',
            dataIndex: 'purchase_date',
            editable: true,
            width:'15%'
        },
        {
            title: '进货价格',
            dataIndex: 'purchase_price',
            editable: true,
            width:'10%'
        },
        {
            title: '状态',
            dataIndex: 'status',
            editable: true,
            width:'10%'
        },

        {
            title: '上架',
            dataIndex: 'operation',
            width:'15%',
            render: (text, record) => {
                return (
                    this.state.data7.length > 0 ?
                        <Popconfirm title="上架?" onConfirm={() => this.onDelete(record.key)}>
                            <a>上架</a>
                        </Popconfirm> : null
                )
            }
        }
    ]
    /*columns8 = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'age',
            dataIndex: 'age',
            width: '15%',
            editable: true,
        },
        {
            title: 'address',
            dataIndex: 'address',
            width: '40%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return (
                    <div>
                        {editable ? (
                            <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a

                            onClick={() => this.save(form, record.key)}
                            style={{marginRight: 8}}
                        >
                            Save
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="Sure to cancel?"
                      onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                        ) : (
                            <a onClick={() => this.edit(record.key)}>Edit</a>
                        )}
                    </div>
                );
            },
        },
    ]*/

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

    getRemoteData(params) {
        this.setState({
            loading: true
        })
        axios.get('https://randomuser.me/api', {
            params: {
                results: 10,
                size: 200,
                ...params
            }
        }).then(res => {
            const pagination = {...this.state.pagination};
            pagination.total = 200
            this.setState({
                loading: false,
                data4: res.data.results,
                pagination
            })
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
        const arr = this.state.data7.slice()
        this.setState({
            data7: arr.filter(item => item.key !== key)
        })
    }
    handleAdd = () => {
        const {data7, count} = this.state //本来想用data7的length来代替count，但是删除行后，length会-1
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            data7: [...data7, newData],
            count: count + 1
        })
    }
    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        this.setState({editingKey: key});
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data7];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({data7: newData, editingKey: ''});
            } else {
                newData.push(data8);
                this.setState({data7: newData, editingKey: ''});
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
        const columns3 = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                filters: [
                    {text: 'Joe', value: 'Joe'},
                    {text: 'Jim', value: 'Jim'},
                ],
                filteredValue: filteredInfo.name || null,
                onFilter: (value, record) => record.name.includes(value),
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            }, {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                sorter: (a, b) => a.age - b.age,
                sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            }, {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                filters: [
                    {text: 'London', value: 'London'},
                    {text: 'New York', value: 'New York'},
                ],
                filteredValue: filteredInfo.address || null,
                onFilter: (value, record) => record.address.includes(value),
                sorter: (a, b) => a.address.length - b.address.length,
                sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
            }]
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        /*const columns8 = this.columns8.map((col) => {
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
        });*/
        /*const cardContent = `<ul class="card-ul">
            <li>当有大量结构化的数据需要展现时</li>
            <li>标当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时</li>
          </ul>`*/
        return (
            <div>
                <CustomBreadcrumb arr={['仓库']}/>
                {/*<TypingCard id='howUse' source={cardContent} height={178}/>*/}
                {/*<Card bordered={false} title='商品目录' style={{marginBottom: 10, minHeight: 762}} id='remoteLoading'>
                    <Table rowKey={record => record.login.uuid}
                           loading={this.state.loading}
                           dataSource={this.state.data4}
                           pagination={this.state.pagination}
                           onChange={this.handleTableChange} style={styles.tableStyle}/>
                           columns={columns4}
                </Card>*/}
                {/*<Card bordered={false} title='可展开' style={{marginBottom: 10, minHeight: 440}} id='unfold'>
                    <Table dataSource={data5} columns={columns5} style={styles.tableStyle}
                           expandedRowRender={record => <p style={{margin: 0}}>{record.description}</p>}/>
                </Card>*/}
                {/*<Card bordered={false} title='固定头和列' style={{marginBottom: 10, minHeight: 440}} id='fixed'>
                    <Table dataSource={data6} columns={columns6} style={styles.tableStyle}
                           scroll={{x: 1500, y: 500}}/>
                </Card>*/}
                <Card bordered={false} title='仓库目录' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
                    <p>
                        <Button onClick={this.handleAdd}>添加行</Button>
                    </p>
                    <Table bordered dataSource={this.state.data7} columns={this.columns7} style={styles.tableStyle}/>
                </Card>
                {/*<BackTop visibilityHeight={200} style={{right: 50}}/>
                <Affix style={styles.affixBox}>
                    <Anchor offsetTop={50} affix={false}>
                        <Anchor.Link href='#howUse' title='何时使用'/>
                        <Anchor.Link href='#basicUsage' title='基本用法'/>
                        <Anchor.Link href='#select' title='可选择'/>
                        <Anchor.Link href='#filterOrSort' title='排序和筛选'/>
                        <Anchor.Link href='#remoteLoading' title='远程加载数据'/>
                        <Anchor.Link href='#unfold' title='可展开'/>
                        <Anchor.Link href='#fixed' title='固定头和列'/>
                        <Anchor.Link href='#editTable' title='可编辑的表格'/>
                    </Anchor>
                </Affix>*/}
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

