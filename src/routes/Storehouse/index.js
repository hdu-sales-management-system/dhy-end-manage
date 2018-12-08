import React from 'react'
import {Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix,Modal, Form, InputNumber, Input} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'
import {getDepots} from '@/network/depot'


const Search = Input.Search;

class TableDemo extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        loading: false,
        pagination: {
            pageSize: 8
        },
        data: [],
        count: 2,
        editingKey: '',
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns = [
        {
            title: '礼品名',
            dataIndex: 'name',
            width: '15%',
            editable: true,
        },
        {
            title: '库存',
            dataIndex: 'count',
            editable: true,
            width:'10%'
        },
        {
            title: '进货时间',
            dataIndex: 'updated_at',
            editable: false,
            width:'15%'
        },
        {
            title: '进货价格',
            dataIndex: 'purchase_price',
            editable: true,
            width:'10%'
        },
        {
            title: '供货商',
            dataIndex: 'supplier',
            editable: true,
            width:'10%'
        },
        {
          title: '商标码',
          dataIndex: 'bar_code',
          editable: true,
          width: '10%'
        },
        {
            title: '上架',
            dataIndex: 'operation',
            width:'15%',
            render: (text, record) => {
                return (
                    this.state.data.length > 0 ?
                        <Popconfirm title="上架?" onConfirm={() => this.handelUpToShelf(record.key)}>
                            <a>上架</a>
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
    handelUpToShelf(key) {
      console.log(key)
    }
    async getRemoteData(params) {
        this.setState({
            loading: true
        })
        const res = await getDepots(params)
        const pagination = {...this.state.pagination};
        pagination.total = 200
        this.setState({
            loading: false,
            data: res.data,
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

    render() {
        let {sortedInfo, filteredInfo} = this.state
        sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        return (
            <div>
           
                <Card bordered={false} title='仓库目录' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
                    <p>

                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            style={{ width: 200 ,margin: 5}}
                        />
                    </p>
                    <Table bordered dataSource={this.state.data} columns={this.columns} style={styles.tableStyle}/>
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

