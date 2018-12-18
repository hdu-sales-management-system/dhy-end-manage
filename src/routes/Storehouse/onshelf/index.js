import React from 'react'
import {Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Modal, Form, InputNumber, Input} from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb/index'
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
        visible: false,
        data: [],
        count: 2,
        editingKey: '',
        itemUpshelf: {},
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns = [
        {
            title: '礼品名',
            dataIndex: 'name',
            width: '15%',
        },
        {
            title: '进货时间',
            dataIndex: 'updated_at',
            width:'15%'
        },
        {
            title: '进货价格',
            dataIndex: 'purchase_price',
            width:'10%'
        },
        {
          title: '上架库存',
          dataIndex: 'saleCount',
          width: '10%',
          render: (value, record) => (value + '/' + record.totalCount)
        }, {
          title: '未上架库存',
          dataIndex: 'stockCount',
          width: '10%',
          render: (value, record) => (value + '/' + record.totalCount)
        },
        {
            title: '供货商',
            dataIndex: 'supplier',
            width:'10%'
        },
        {
          title: '商标码',
          dataIndex: 'bar_code',
          width: '10%'
        },
    ]
    
    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        })
    }

    handelItemUpshelf(record) {
      this.setState({visible: true, itemUpshelf: record})
    }
    
    async getRemoteData(params) {
        this.setState({
            loading: true
        })
        const res = await getDepots({state: 'onshelf', ...params})
        console.log(params)
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
    handleOk() {

    }
    handelClose() {
      this.setState({
        visible: false,
      })
    }
    
    handleSearch(value) {
      this.getRemoteData({
        q: value
      })
    }

    render() {
        let {sortedInfo, filteredInfo} = this.state
        sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        return (
            <div>
           
                <CustomBreadcrumb arr={[ '仓库']}/>
                <Card bordered={false} title='仓库目录' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
                    <p>

                        <Search
                            placeholder="input search text"
                            onSearch={value => this.handleSearch(value)}
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

