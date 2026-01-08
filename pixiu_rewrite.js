/*
项目名称：貔貅
脚本功能：解锁永久高级会员

[rewrite_local]
# 匹配貔貅用户信息接口
^https?:\/\/api\.pixiu\.design\/api\/v1\/user\/info url script-response-body https://raw.githubusercontent.com/chxm1023/Rewrite/main/iTunes.js

[mitm]
hostname = api.pixiu.design
*/

// 获取原始响应体
let body = $response.body;

if (body) {
    // 解析 JSON 数据
    let obj = JSON.parse(body);
    const url = $request.url;

    // 匹配貔貅应用的用户信息接口
    if (url.indexOf("/api/v1/user/info") !== -1) {
        if (obj.data) {
            // 反混淆后的核心赋值逻辑
            obj.data.is_vip = 1;               // 激活会员状态
            obj.data.vip_type = 1;             // 设置会员等级
            obj.data.expires_time = "2099-12-31 23:59:59"; // 永久有效期
            obj.data.left_days = 999999;       // 剩余天数
        }
    }

    // 将修改后的对象写回并结束
    $done({ body: JSON.stringify(obj) });
} else {
    // 无响应体则直接结束
    $done({});
}
