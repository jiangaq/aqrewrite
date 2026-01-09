/******************************

脚本功能：滴答清单+解锁VIP
软件版本：6.3.80

*******************************

[rewrite_local]

^https:\/\/(ticktick|dida365)\.com\/api\/v2\/user\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/ddqd.js

[mitm] 

hostname = dida365.com, ticktick.com

*******************************/

var body = $response.body;

// 增加判断：只有当 body 存在且看起来像 JSON 时才解析
if (body && body.startsWith('{')) {
    try {
        var obj = JSON.parse(body);
        // ... 原有的修改逻辑 ...
        obj.proEndDate = "2099-01-01T00:00:00.000+0000";
        obj.pro = true;
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("JSON 解析失败: " + e);
        $done({}); // 解析失败则直接跳过，不修改
    }
} else {
    console.log("响应内容不是 JSON，跳过处理");
    $done({}); // 不是 JSON 则直接返回原数据
}
