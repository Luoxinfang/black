var express = require('express');
var router = express.Router();
var baiduApi = require('baidu-aip-sdk')

var AipOcrClient = baiduApi.ocr

/* GET users listing. */
router.post('/base64', function (req, res, next) {
  console.log(req.body)
  var backJson = {
    code: 200,
    data: ''
  }
  var image = req.body.image
  if (!image) {
    backJson.code = 400
    res.json(backJson)
  } else {
    function findObj (rs, key) {
      if (!rs) {
        return '--'
      }
      for (var i = 0, l = rs.length; i < l; i++) {
        var obj = rs[i]
        if (obj['word_name'] === key) {
          return obj.word || '--'
        }
      }
    }

    var client = new AipOcrClient(10873910, 'MEmamWlWBsfOI9qENpdczxTw', 'H3skvIYrTm9t1V8Rxhc767sy5a1Qw8BB')
    // 调用通用票据识别
    var templateId = 'c6f61fd309c8da2d6a41fa0ffb9cdc02'
    client.custom(image, templateId).then(function (result) {
      var rs = result.data.ret
      console.log(result)
      backJson.data = {
        license: findObj(rs, '车牌号'),
        billingDate: findObj(rs, '开票日期'),
        travelDate1: findObj(rs, '通行日期起'),
        travelDate2: findObj(rs, '通行日期止'),
        invoiceCode: findObj(rs, '发票代码'),
        invoiceNumber: findObj(rs, '发票号码'),
        buyName: findObj(rs, '购方名称'),
        saleName: findObj(rs, '销方名称'),
        notTax: findObj(rs, '未税金额'),
        income: findObj(rs, '进项税额'),
        total: findObj(rs, '价税合计'),
        taxRate: findObj(rs, '税率')
      }

      res.json(backJson)
    }).catch(function (err) {
      // 如果发生网络错误
      console.log(err)
      res.json(backJson)
    })
  }
});

module.exports = router;
