<template>
    <el-container style="width: 100%; top: 0px; bottom: 0px; border: 0px; padding: 0px">
      <el-header>
        <el-row>
          <el-col :span="12">
            <div style="text-align: left">
              <img src="../assets/logo1.png"  /> 
              <span style="font-size: 28px; color: #ffffff; text-align: left">
                &nbsp;&nbsp; | &nbsp; 学习与反馈平台V2.0
              </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right; font-size: 24px; color: #ffffff">
              <i class="el-icon-star-on"></i>
              <span> {{ userNameShow }} </span>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        
        <div>
          <div style="font-size: 18px; text-align: left">更多意见与问题反馈</div>
          <div style="margin-top:5px">
            <el-row>
              <el-col :span="12">
                <div style="text-align: left">
                  <el-date-picker
                    v-model="selectDateValue"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions1"
                    @change="selectDateValueChange()">
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="text-align: right">
                  <span>
                    <el-button type="primary" size="medium" icon="el-icon-refresh" 
                      @click="refreshTable" :disabled="refreshButtonDisable">刷新</el-button>
                    <el-button type="primary" size="medium" icon="el-icon-document" 
                      @click="exportTable" :disabled="refreshButtonDisable">导出</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div style="margin-top:5px">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="日期" width="100">
            </el-table-column>
            <el-table-column prop="id" label="问题编号" width="80">
            </el-table-column>
            <el-table-column prop="chip" label="机芯" width="70">
            </el-table-column>
            <el-table-column prop="model" label="机型" width="70">
            </el-table-column>
            <el-table-column prop="mac" label="MAC" width="120">
            </el-table-column>
            <el-table-column prop="activeid" label="激活ID" width="100">
            </el-table-column>
            <el-table-column prop="category" label="问题类型" width="100">
            </el-table-column>
            <el-table-column prop="desc" label="问题描述">
            </el-table-column>
            <el-table-column prop="picList" label="图片" width="150">
              <template slot-scope="scope">
                <span v-for="item in scope.row.picList" style="margin-right: 3px;">
                <el-popover 
                  placement="right"
                  title=""
                  trigger="hover" >
                  <img :src="item" style="max-width: 800px; max-height: 600px" />
                  <img slot="reference" :src="item" :alt="item" style="width: 50px; height: 50px">
                </el-popover>
                </span>
                
              </template>
            </el-table-column>
            <el-table-column prop="contact" label="联系方式" width="150" :render-header="contactRenderHeader">
            </el-table-column>
            <el-table-column prop="hasExport" label="已导出" width="70">
            </el-table-column>
          </el-table>
        </div>

        <div style="margin-top:5px">
          <el-row>
            <el-col :span="24">
              <div style="text-align: right">

                  <el-pagination 
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizeSelector"
                    :page-size="currentpageSize"
                    :total="pageTotal"
                    >
                  </el-pagination>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-dialog title="学习与反馈平台v2.0" :visible.sync="dialogLoginVisible"> 
          <el-form :model="form">
            <el-form-item label="账户" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="userLogin">登 录</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
</template>

<script>

import API from '../api/api_feedback';
//import phonefilter from './phonefilter';



export default {
  name: 'Home',

  data () {
    return {
      alldata: [],
      alltotal: 0,
      filterdata: [],
      filtertotal: 0,

      userNameShow: '',
      hasLogin: false,

      refreshButtonDisable: true,
      exportButtonDisable: true,

      selectDateValue: '',
      pickerOptions1: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

      currentPage: 1,
      pageTotal: 1000,
      pageSizeSelector: [10, 20, 50, 100, 150],
      currentpageSize: 10,
      filterType: "all",                                // 表示电话过滤器 all=所有,exist表示有电话的,none表示无电话的

      tableData : [],

      dialogLoginVisible: false,
      form: {
        username: '',
        password: ''
      },
      formLabelWidth: '100px'
    }
  },

  beforeCreate() {
  },

  created() {
    console.log("created()");
  },

  mounted() {
    console.log("mounted()");
    //this.dialogLoginVisible = true;
    let _this = this;

    setTimeout(function() {
      _this.checkLogin();
      _this.startupGetData();
    }, 2000);
  },
  methods: {

    checkLogin() {
      console.log("checkLogin()");
      let _this = this;
      if (!this.hasLogin)       // 没有登录的话，弹出登录框
      {
        // 检查是否登录
        let params = {};
        API.checkLogin(params).then(
          function (result) {
            console.log(result);
            if (result.isLogined == "true") {
              _this.userNameShow = result.userName;
              console.log(_this.userNameShow);
              _this.hasLogin = true;
              _this.dialogLoginVisible = false;
            }
            else {
              _this.dialogLoginVisible = true;
              setTimeout(function() {
                _this.checkLogin();
              }, 2000);
            }
          }, 
          function (err) {
            console.log(err);
            _this.dialogLoginVisible = true;
            setTimeout(function() {
              _this.checkLogin();
            }, 2000);
          }
        ).catch(
          function (error) {
            console.log(error);
            _this.dialogLoginVisible = true;
            setTimeout(function() {
              _this.checkLogin();
            }, 2000);
          }
        );
      }
    },

    startupGetData() {
      
    },

    selectDateValueChange() {
      if (this.hasLogin) {
        console.log(this.selectDateValue);
        this.refreshButtonDisable = false;
        this.exportButtonDisable = false;
        this.getFeedbackData(this.selectDateValue[0], this.selectDateValue[1]);
      } else {
        console.log("not login");
      }
    },

    getFeedbackData(date_1, date_2) {
      let _this = this;
      let params = {
        date1: date_1,
        date2: date_2,
        pageSize: "1",
        pageNum: "1"
      };
      API.fetchFeedbackDataV2(params).then(
        function (result) {
          console.log(result);
          if (result && result.data) {
            _this.alltotal = result.total;
            _this.alldata = result.data;
            _this.doFilterData();                       // 过滤电话号码
            // 更新页码条
            _this.pageTotal = _this.filtertotal;
            _this.currentPage = 1;
            // 更新数据显示
            _this.refreshTableShow();
          }
        }, 
        function (err) {
          console.log(err);
        }
      ).catch(
        function (error) {
          console.log(error);
        }
      );
    },

    downloadUrl(url) {
      let iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      iframe.onload = function () {
        document.body.removeChild(iframe);
      }
      document.body.appendChild(iframe);
    },

    refreshTable() {
      this.selectDateValueChange();
    },

    exportTable() {
      console.log("exportTable");
      if (!this.hasLogin) {
        console.log("not login");
        return;
      }
      var date_1 = this.selectDateValue[0];
      var date_2 = this.selectDateValue[1];
      var filter = this.filterType;
      let params = {
        date1: date_1,
        date2: date_2,
        pageSize: "1",
        pageNum: "1"
      };
      var base;
      if (process.env.NODE_ENV === 'development')
        base = 'http://localhost:3010';
      else
        base = 'https://webx.coocaa.com/hfdplatform';
      this.downloadUrl(base + "/help/exportFeedbackV2?date1=" + date_1 + "&date2=" + date_2 + "&pageSize=1&pageNum=1&filter=" + filter);
    },

    doFilterData() {        // 根据是否有电话号码,过滤数据
      var j;
      var checkfunction;
      this.filterdata = [];
      this.filtertotal = 0;

      //filterType: "all",                                // 表示电话过滤器 all=所有,exist表示有电话的,none表示无电话的
      if (this.filterType == "exist") {
        checkfunction = function(contact) {
          if (contact != null && contact != "")
            return true;
          else
            return false;
        };
      } 
      else if (this.filterType == "none") {
        checkfunction = function(contact) {
          if (contact == null || contact == "")
            return true;
          else
            return false;
        };
      }
      else {
        checkfunction = function(contact) {
          return true;
        }
      }

      for (var i in this.alldata) 
      {
        if (checkfunction(this.alldata[i].contact))
        {
          j =  this.filtertotal;
          this.filtertotal ++;
          var curdata = new Object;
          curdata.id = this.alldata[i].id;
          curdata.chip = this.alldata[i].chip;
          curdata.model = this.alldata[i].model;
          curdata.mac = this.alldata[i].mac;
          curdata.activeid = this.alldata[i].activeid;
          curdata.category = this.alldata[i].category;
          curdata.title = this.alldata[i].title;
          curdata.content = this.alldata[i].content;
          curdata.contact = this.alldata[i].contact;
          curdata.picurl = this.alldata[i].picurl;
          curdata.optTime = this.alldata[i].optTime;
          curdata.hasExport = this.alldata[i].hasExport;
          this.filterdata[j] = curdata;
        }
      }
    },

    refreshTableShow() {
      console.log("refreshTableShow");
      this.tableData = [];
      var curPage = this.currentPage;
      if (curPage > 0)
        curPage--;
      for (var i = 0; i < this.currentpageSize ; i++) 
      {
        var startIdx = this.currentpageSize * curPage;
        if (startIdx + i < this.filtertotal)
        {
          var newData = new Object;
          newData.id = this.filterdata[startIdx + i].id;
          newData.chip = this.filterdata[startIdx + i].chip;
          newData.model = this.filterdata[startIdx + i].model;
          newData.mac = this.filterdata[startIdx + i].mac;
          newData.activeid = this.filterdata[startIdx + i].activeid;
          newData.category = this.filterdata[startIdx + i].category;
          newData.contact = this.filterdata[startIdx + i].contact;
          var arr = this.filterdata[startIdx + i].optTime.split(" ");
          newData.date = arr[0];
          if (this.filterdata[startIdx + i].hasExport == 0)
            newData.hasExport = "否";
          else
            newData.hasExport = "是";

          var contentText;
          var titleNull = false, contentNull = false;
          if (this.filterdata[startIdx + i].title == null || this.filterdata[startIdx + i].title == "")
            titleNull = true;
          if (this.filterdata[startIdx + i].content == null || this.filterdata[startIdx + i].content == "")
            contentNull = true;
          if (titleNull && contentNull)
            contentText = "";
          else if (titleNull)
            contentText = this.filterdata[startIdx + i].content;
          else if (contentNull)
            contentText = this.filterdata[startIdx + i].title;
          else
            contentText = this.filterdata[startIdx + i].title + " - " + this.filterdata[startIdx + i].content;
          newData.desc = contentText;

          if (this.filterdata[startIdx + i].picurl != null  &&  this.filterdata[startIdx + i].picurl != "")
          {
            var arr2 = this.filterdata[startIdx + i].picurl.split(";");
            newData.picList = arr2;
          }
          else {
            newData.picList = new Array();
          }
          this.tableData[i] = newData;
          /*
          tableData : [
        {
          picList: '<a href="xxxx/hhhh,jpg">图片1</a>',
        } 
      ],*/

      /*
      DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `picurl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=374 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      
      */
        }
      }
    }, 
    handleSizeChange(val) {
      console.log("handleSizeChange(): " + val);
      this.currentpageSize = val;
      this.refreshTableShow();
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange(): " + val);
      this.currentPage = val;
      this.refreshTableShow();
    },

    userLogin() {
      console.log("userLogin()");
      let _this = this;
      if (this.form.username == "" || this.form.password == "")
        return;
      let params = {
        username: this.form.username,
        password: this.form.password
      };
      API.login(params).then(
        function (result) {
          console.log(result);
          if (result.errcode == 0) {          // 存在并有效用户
            _this.userNameShow = result.userName;
            console.log(_this.userNameShow);
            _this.hasLogin = true;
            _this.dialogLoginVisible = false;
          }
          else {

          }
        }, 
        function (err) {
          console.log(err);
        }
      ).catch(
        function (error) {
          console.log(error);
        }
      );
      
    }, 

    phoneFilterChangeMethod(type) {
      console.log(" phoneFilterChange() type = " + type);
      this.filterType = type;
      this.doFilterData();
      this.pageTotal = this.filtertotal;
      // 更新数据显示
      this.refreshTableShow();
    },

    contactRenderHeader(h, {column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'span',
          [ 
            h('span', column.label),
            h('phonefilter', {
              props: {phoneFilterChangeMethod: this.phoneFilterChangeMethod}
            })
          ]
        );
       }
  }
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    background-color: #373d41;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    color: #333;
    text-align: center;
  }
</style>
