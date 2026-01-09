/*
 * 芝士财富 (Cheese Fortune) VIP 破解脚本
 * 
 * [Rewrite]
 * ^https:\/\/stock\.cheesefortune\.com\/api\/v2\/user\/vipType url script-response-body cheesefortune_crack.js
 * 
 * [MITM]
 * hostname = stock.cheesefortune.com
 */

var body = $response.body;
var url = $request.url;

if (body) {
    try {
        var obj = JSON.parse(body);
        if (obj.datas) {
            // vipTime: 会员到期时间戳 (毫秒)
            // 设置为 2099-12-31 23:59:59 (4102415999000)
            obj.datas.vipTime = 4102415999000;

            // vipType: 会员类型
            // 0: 普通用户, 1: VIP (具体数值可能需要测试，通常非0即VIP)
            obj.datas.vipType = 1;

            // userType: 用户类型
            obj.datas.userType = 1;

            console.log("🧀 芝士财富: VIP 权益已激活");
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("❌ 芝士财富脚本错误: " + e);
        $done({});
    }
} else {
    $done({});
}
