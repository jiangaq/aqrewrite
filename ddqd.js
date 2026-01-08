/******************************

脚本功能：滴答清单+解锁VIP
软件版本：6.3.80

*******************************

[rewrite_local]

^https:\/\/(ticktick|dida365)\.com\/api\/v2\/user\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/ddqd.js

[mitm] 

hostname = dida365.com
var _0xf36b=["\x62\x6F\x64\x79","\x70\x61\x72\x73\x65","\x70\x72\x6F\x45\x6E\x64\x44\x61\x74\x65","\x32\x30\x39\x39\x2D\x30\x31\x2D\x30\x31\x54\x30\x30\x3A\x30\x30\x3A\x30\x30\x2E\x30\x30\x30\x2B\x30\x30\x30\x30","\x6E\x65\x65\x64\x53\x75\x62\x73\x63\x72\x69\x62\x65","\x70\x72\x6F","\x73\x74\x72\x69\x6E\x67\x69\x66\x79"];var body=$response[_0xf36b[0]];var obj=JSON[_0xf36b[1]](body);obj[_0xf36b[2]]= _0xf36b[3];obj[_0xf36b[4]]= false;obj[_0xf36b[5]]= true;body= JSON[_0xf36b[6]](obj);$done(body)
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

