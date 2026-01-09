/*
 * 复来智投 (FulaiZhitou) VIP 破解脚本
 * 功能：解锁指数宝 VIP，查看全部指数榜单，解锁详情页智能诊断和评分
 * 
 * [Rewrite]
 * ^https:\/\/api\.fulaizhitou\.com\/tools\/user\/center url script-response-body fulaizhitou_crack.js
 * ^https:\/\/api\.fulaizhitou\.com\/tools\/code\/xgx url script-response-body fulaizhitou_crack.js
 * ^https:\/\/api\.fulaizhitou\.com\/tools\/code\/charts url script-response-body fulaizhitou_crack.js
 * 
 * [MITM]
 * hostname = api.fulaizhitou.com
 */

const url = $request.url;
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 1. VIP 用户状态 (user/center)
        if (url.indexOf('tools/user/center') !== -1) {
            if (obj.hasOwnProperty('vip')) obj.vip = 1;
            if (obj.hasOwnProperty('vipType')) obj.vipType = 1;
            if (obj.hasOwnProperty('oldEndTime')) obj.oldEndTime = "2099-12-31";
            obj.showPop = false;
            console.log("✅ 复来智投: 用户状态已激活");
        }

        // 2. 智能诊断 (xgx)
        else if (url.indexOf('tools/code/xgx') !== -1) {
            // 构造假数据
            obj.code = 10000; // 成功状态码
            obj.data = {
                "desc": "尊贵的VIP用户，该指数当前估值合理，基本面稳健。技术面上方空间打开，建议保持关注。(破解生成的模拟建议)",
                "advise": "持有/买入",
                "score": 88
            };
            console.log("✅ 复来智投: 智能诊断已解锁");
        }

        // 3. 智能评分雷达图 (charts)
        else if (url.indexOf('tools/code/charts') !== -1) {
            obj.code = 10000;
            // 猜测的雷达图结构，通常包含 value (数据) 和 indicator (维度)
            obj.data = {
                "indicator": [
                    { "name": "盈利能力", "max": 100 },
                    { "name": "成长能力", "max": 100 },
                    { "name": "运营能力", "max": 100 },
                    { "name": "偿债能力", "max": 100 },
                    { "name": "现金流", "max": 100 }
                ],
                "series": [{
                    "value": [85, 92, 78, 95, 88],
                    "name": "智能评分"
                }],
                "score": 90
            };
            // 备用结构：有些API直接返回数组，视前端实现而定
            // 如果上述结构不生效，可以尝试更简单的 data: [85, 90, 80, 70, 95]

            console.log("✅ 复来智投: 智能评分已解锁");
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("❌ 复来智投脚本错误: " + e);
        $done({});
    }
} else {
    $done({});
}
