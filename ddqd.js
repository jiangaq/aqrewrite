/******************************

脚本功能：滴答清单+解锁VIP
软件版本：6.3.80

*******************************

[rewrite_local]

^https:\/\/(ticktick|dida365)\.com\/api\/v2\/user\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/ddqd.js

[mitm] 

hostname = dida365.com, ticktick.com

*******************************/

// 获取原始响应体
var body = $response.body; 

// 将字符串解析为 JSON 对象
var obj = JSON.parse(body); 

// 修改关键属性
obj.proEndDate = "2099-01-01T00:00:00.000+0000"; // 设置会员到期时间为 2099 年
obj.needSubscribe = false;                      // 设置不需要订阅
obj.pro = true;                                 // 开启 Pro 权限开关

// 将修改后的对象转回字符串
body = JSON.stringify(obj); 

// 结束脚本并返回修改后的数据
$done(body);
