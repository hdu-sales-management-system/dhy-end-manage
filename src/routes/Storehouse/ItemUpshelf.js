import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input, Tooltip, Icon, InputNumber, Switch, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';
import { itemUpshelf } from '@/network/depot'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const { TextArea } = Input

class ItemUpshelf extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      const resp = await itemUpshelf(values)
      this.props.onClose()
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
// 礼品名
// 封面
// 分类
// 礼品介绍
// 上架时间
// 售卖价格
// 热度
// 打折状态
// 折扣
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
            rules: [{
              required: true, message: '请输入封面地址！',
            }, {
              type: 'url', message: '请输入正确的封面地址！',
            }]
          })(
            <Input />
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
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <InputNumber />
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
            rules: [{ required: true, message: '请输入折扣' }],
          })(
            <InputNumber />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button type="danger" htmlType="reset">取消</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedItemUpshelf = Form.create()(ItemUpshelf)

export default WrappedItemUpshelf