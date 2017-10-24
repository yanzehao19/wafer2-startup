// pages/order/order.js
var Zan = require('../../template/contract.js');
Page(Object.assign({}, Zan.Tab, {
	  data: {
	    tab1: {
	      list: [{
	        id: 0,
	        title: '全部'
	      }, {
	        id: 1,
	        title: '待付款'
	      }, {
	        id: 2,
	        title: '待发货'
	      }, {
	        id: 3,
	        title: '待收货'
	      }, {
	        id: 4,
	        title: '待评价'
	      }],
	      selectedId: 0,
	      scroll: false,
	    },
	  },
	  handleZanTabChange(e) {
		    var componentId = e.componentId;
		    var selectedId = e.selectedId;
		    this.setData({
		      `${componentId}.selectedId`: selectedId
		    });
		  },
		  
		  
		  wx.login({
		      success: function(res) {
		        if (res.code) {
		          //发起网络请求
		          wx.request({
		            url: 'https://yourwebsit/onLogin',
		            method: 'POST',
		            data: {
		              code: res.code
		            },
		            success: function(res) {
		                var openid = res.data.openid;
		            },
		            fail: function(err) {
		                console.log(err)
		            }
		          })
		        } else {
		          console.log('获取用户登录态失败！' + res.errMsg)
		        }
		      }
		    });
		  var code = req.param("code");
	        request({
	            url: "https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code",
	            method: 'GET'
	        }, function(err, response, body) {
	            if (!err && response.statusCode == 200) {
	                res.json(JSON.parse(body));
	            }
	        });

	        wx.request({
                url: 'https://yourwebsit/service/getPay', 
                method: 'POST',
                data: {
                  bookingNo:bookingNo,  /*订单号*/
                  total_fee:total_fee,   /*订单金额*/
                  openid:openid
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    wx.requestPayment({
                      'timeStamp':timeStamp,
                      'nonceStr': nonceStr,
                      'package': 'prepay_id='+res.data.prepay_id,
                      'signType': 'MD5',
                      'paySign': res.data._paySignjs,
                      'success':function(res){
                          console.log(res);
                      },
                      'fail':function(res){
                          console.log('fail:'+JSON.stringify(res));
                      }
                    })
                },
                fail: function(err) {
                    console.log(err)
                }
            })

            var bookingNo = req.param("bookingNo");
	        var total_fee = req.param("total_fee");
	        var openid = req.param("openid");
	        var body = "费用说明";
	        var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	        var formData = "<xml>";
	        formData += "<appid>appid</appid>"; //appid
	        formData += "<attach>test</attach>";
	        formData += "<body>" + body + "</body>";
	        formData += "<mch_id>mch_id</mch_id>"; //商户号
	        formData += "<nonce_str>nonce_str</nonce_str>";
	        formData += "<notify_url>notify_url</notify_url>";
	        formData += "<openid>" + openid + "</openid>";
	        formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
	        formData += "<spbill_create_ip>spbill_create_ip</spbill_create_ip>";
	        formData += "<total_fee>" + total_fee + "</total_fee>";
	        formData += "<trade_type>JSAPI</trade_type>";
	        formData += "<sign>" + paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, spbill_create_ip, total_fee, 'JSAPI') + "</sign>";
	        formData += "</xml>";
	        request({
	            url: url,
	            method: 'POST',
	            body: formData
	        }, function(err, response, body) {
	            if(!err && response.statusCode == 200) {
	                var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
	                var tmp = prepay_id.split('[');
	                var tmp1 = tmp[2].split(']');
	                //签名
	                var _paySignjs = paysignjs(appid, mch_id, 'prepay_id=' + tmp1[0], 'MD5',timeStamp);
	                var o = {
	                    prepay_id: tmp1[0],
	                    _paySignjs: _paySignjs
	                }
	                res.send(o);
	            }
	        });

	        function paysignjs(appid, nonceStr, package, signType, timeStamp) {
	            var ret = {
	                appId: appid,
	                nonceStr: nonceStr,
	                package: package,
	                signType: signType,
	                timeStamp: timeStamp
	            };
	            var string = raw1(ret);
	            string = string + '&key='+key;
	            console.log(string);
	            var crypto = require('crypto');
	            return crypto.createHash('md5').update(string, 'utf8').digest('hex');
	        };

	        function raw1(args) {
	            var keys = Object.keys(args);
	            keys = keys.sort()
	            var newArgs = {};
	            keys.forEach(function(key) {
	                newArgs[key] = args[key];
	            });

	            var string = '';
	            for(var k in newArgs) {
	                string += '&' + k + '=' + newArgs[k];
	            }
	            string = string.substr(1);
	            return string;
	        };

	        function paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
	            var ret = {
	                appid: appid,
	                attach: attach,
	                body: body,
	                mch_id: mch_id,
	                nonce_str: nonce_str,
	                notify_url: notify_url,
	                openid: openid,
	                out_trade_no: out_trade_no,
	                spbill_create_ip: spbill_create_ip,
	                total_fee: total_fee,
	                trade_type: trade_type
	            };
	            var string = raw(ret);
	            string = string + '&key='+key;
	            var crypto = require('crypto');
	            return crypto.createHash('md5').update(string, 'utf8').digest('hex');
	        };

	        function raw(args) {
	            var keys = Object.keys(args);
	            keys = keys.sort()
	            var newArgs = {};
	            keys.forEach(function(key) {
	                newArgs[key.toLowerCase()] = args[key];
	            });

	            var string = '';
	            for(var k in newArgs) {
	                string += '&' + k + '=' + newArgs[k];
	            }
	            string = string.substr(1);
	            return string;
	        };

	        function getXMLNodeValue(node_name, xml) {
	            var tmp = xml.split("<" + node_name + ">");
	            var _tmp = tmp[1].split("</" + node_name + ">");
	            return _tmp[0];
	        }


		  
		  
		}));