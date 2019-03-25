<template>
    <el-container style="border: 1px solid">
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
              11111
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
                    <el-button type="primary" size="medium" icon="el-icon-refresh">刷新</el-button>
                    <el-button type="primary" size="medium" icon="el-icon-document" @click="exportTable">导出</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div style="margin-top:5px">
          <el-table :data="tableData" height="500" border style="width: 100%">
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
                <el-popover
                  placement="right"
                  title=""
                  trigger="hover" >
                  <img :src="scope.row.picList" style="max-width: 800px; max-height: 600px" />
                  <img slot="reference" :src="scope.row.picList" :alt="scope.row.picList" style="width: 50px; height: 50px">
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="contact" label="联系方式"  width="150">
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

export default {
  name: 'Home',
  data () {
    return {
      alldata: [],
      alltotal: 0,
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
      this.dialogLoginVisible = true;
    },
    startupGetData() {
      
    },

    selectDateValueChange() {
      console.log(this.selectDateValue);
      this.getFeedbackData(this.selectDateValue[0], this.selectDateValue[1]);
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
            // 更新页码条
            _this.pageTotal = result.total;
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

    exportTable() {
      console.log("exportTable");
      var date_1 = this.selectDateValue[0];
      var date_2 = this.selectDateValue[1];
      let params = {
        date1: date_1,
        date2: date_2,
        pageSize: "1",
        pageNum: "1"
      };
      this.downloadUrl("http://localhost:3010/help/exportFeedbackV2?date1=" + date_1 + "&date2=" + date_2 + "&pageSize=1&pageNum=1");
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
        if (startIdx + i < this.alltotal)
        {
          var newData = new Object;
          newData.id = this.alldata[startIdx + i].id;
          newData.chip = this.alldata[startIdx + i].chip;
          newData.model = this.alldata[startIdx + i].model;
          newData.mac = this.alldata[startIdx + i].mac;
          newData.activeid = this.alldata[startIdx + i].activeid;
          newData.category = this.alldata[startIdx + i].category;
          newData.contact = this.alldata[startIdx + i].contact;
          var arr = this.alldata[startIdx + i].optTime.split(" ");
          newData.date = arr[0];
          if (this.alldata[startIdx + i].hasExport == 0)
            newData.hasExport = "否";
          else
            newData.hasExport = "是";

          var contentText;
          var titleNull = false, contentNull = false;
          if (this.alldata[startIdx + i].title == null || this.alldata[startIdx + i].title == "")
            titleNull = true;
          if (this.alldata[startIdx + i].content == null || this.alldata[startIdx + i].content == "")
            contentNull = true;
          if (titleNull && contentNull)
            contentText = "";
          else if (titleNull)
            contentText = this.alldata[startIdx + i].content;
          else if (contentNull)
            contentText = this.alldata[startIdx + i].title;
          else
            contentText = this.alldata[startIdx + i].title + " - " + this.alldata[startIdx + i].content;
          newData.desc = contentText;

          if (this.alldata[startIdx + i].picurl != null  &&  this.alldata[startIdx + i].picurl != "")
            newData.picList = this.alldata[startIdx + i].picurl;
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
          if (result.total > 0) {
            _this.dialogLoginVisible = false;
          } else {

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
      
    }

  }
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
</style>
