import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form, 
  Input, 
  Icon, 
  InputNumber, 
  Switch, 
  Select, 
  Button, 
  AutoComplete, 
  Upload
} from 'antd';
import { itemUpshelf } from '@/network/depot'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const { TextArea } = Input

class ItemUpshelf extends Component {

  coverUrl = ''
  imgIds = []
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  componentDidMount() {
    this.props.form.setFieldsValue({
      title: this.props.item.name
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      delete values.cover
      delete values.detail
      delete values.carouse
      values.cover = this.coverUrl
      const resp = await itemUpshelf({
        id: this.props.item.id,
        present: values,
        images: this.imgIds,
      })
      this.props.onClose(this.props.item.id)
    });
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  handleCoverSucc = (resp) => {
    console.log(resp)
    this.coverUrl = resp.url
  }

  handleImgSucc = (data) => {
    this.imgIds.push(data.id)
  }

  render() {
    const { getFieldDecorator,setFieldsValue } = this.props.form;
    const { item } = this.props
    const { autoCompleteResult } = this.state;
    const formItemLayout = {
      labelCol: {
        md: { span: 6 },
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        md: { span: 12 },
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        md: {
          span: 8,
          offset: 8,
        },
        xs: {
          span: 16,
          offset: 4,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
      
          <FormItem
            {...formItemLayout}
            label = "礼品名"
          >
            {getFieldDecorator('title', {
              rules: [{
                type: 'string', message: '请输入正确的礼品名',
              }, {
                required: true, message: '请输入礼品名',
              }],
            })(
              <Input />
            )}
          </FormItem>
      
        <FormItem
          {...formItemLayout}
          label="封面"
        >
           {getFieldDecorator('cover', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="cover"
              listType="picture-card"
              onSuccess={this.handleCoverSucc}
              action="http://localhost:7001/upload/cover"
            >
              上传图片
            </Upload>
          )}
        </FormItem>
                <FormItem
          {...formItemLayout}
          label="轮播图"
        >
           {getFieldDecorator('carouse', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload 
              multiple
              name="cover"
              listType="picture-card"
              onSuccess={this.handleImgSucc}
              action="http://localhost:7001/upload/carouse"
            >
              上传图片
            </Upload>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="详情"
        >
           {getFieldDecorator('detail', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload 
              multiple
              name="cover"
              listType="picture-card"
              onSuccess={this.handleImgSucc}
              action="http://localhost:7001/upload/detail"
            >
              上传图片
            </Upload>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="分类"
        >
          {getFieldDecorator('categorystr', {
            rules: [{
              required: true, message: '请选择礼品分类！',
            }, {
              type: 'string', message: '请输入正确的分类！',
            }],
          })(
            <Select
              placeholder="礼品分类"
              onChange={this.handleSelectChange}
            >
              <Option value="digital">电子</Option>
              <Option value="toy">玩具</Option>
              <Option value="cosmetic">化妆品</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='礼品描述'
        >
          {
            getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入礼品的详细描述！', whitespace: true }],
          })(
            <TextArea />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="售卖价格"
        >
          {getFieldDecorator('price', {
            rules: [{ required: true, message: '请输入礼品售卖价格!' }],
          })(
            <InputNumber />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上架数量"
        >
          {getFieldDecorator('saleCount', {
            rules: [
            { required: true, message: '请输入上架数量!' },
          ],
          })(
            <InputNumber max={item.stockCount} />
          )}
        </FormItem>
          <FormItem
            {...formItemLayout}
            label="打折状态"
          >
            {getFieldDecorator('off', {
              rules: [{ required: true, message: '请选择是否打折！' }],
            })(
              <Switch />
            )}
          </FormItem>
        <FormItem
          {...formItemLayout}
          label="折扣"
        >
          {getFieldDecorator('offcost', {
            rules: [{ required: false, message: '请输入折扣' }],
          })(
            <InputNumber />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button style={{marginRight: 40 }} type="primary" htmlType="submit">提交</Button>
          <Button type="danger" htmlType="reset">取消</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedItemUpshelf = Form.create()(ItemUpshelf)

export default WrappedItemUpshelf