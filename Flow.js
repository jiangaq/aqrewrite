/*************************************

项目名称：视频&图片编辑套装
下载地址：https://t.cn/A6Rkno6Y
更新日期：2024-09-16
脚本作者：chxm1023
电报频道：https://t.me/chxm1023

**************************************
  
[rewrite_local]
^https?:\/\/.*\.vlognow\.me\/.*-pay\/api\/v\d\/(user\/subscriptions|public\/iap\/receipt\/status) url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/Flow.js

[mitm]
hostname = *.vlognow.me

*************************************/


var chxm1023 = JSON.parse($response.body);

chxm1023 = {
  "msg" : "success",
  "data" : [
    {
      "status" : 1,
      "is_free_trial" : false,
      "active" : true,
      "product_identifier" : "Product_Auto_Renew_Annual_2022_05_13",
      "enanled_auto_renew" : true,
      "is_gift_subscription" : false,
      "platform" : "iOS",
      "billing_date_ms" : 1725844149000,
      "original_purchase_date_ms" : 1725844149000,
      "start_date_ms" : 1725844149000,
      "expires_date_ms" : 4092599349000,
      "group_identifier" : "20936308",
      "origin_transaction_id" : "490001234567890"
    }
  ],
  "code" : 1
};

$done({body : JSON.stringify(chxm1023)});
