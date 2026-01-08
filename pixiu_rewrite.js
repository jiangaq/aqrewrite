/*
项目名称：貔貅
脚本功能：解锁永久高级会员

[rewrite_local]
# 匹配貔貅私有接口 & iTunes收据验证
^https?:\/\/api\.pixiu\.design\/api\/v1\/user\/info url script-response-body https://raw.githubusercontent.com/chxm1023/Rewrite/main/iTunes.js
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/chxm1023/Rewrite/main/iTunes.js

[mitm]
hostname = api.pixiu.design, buy.itunes.apple.com
*/

// --- 1. 配置区域：提取自原脚本的 list 对象中关于 Pixiu 的定义 ---
// bundle_id 为 com.pixiu.design
const pixiu_config = {
  "name": "vip", 
  "id": "com.pixiu.design.lifetime" // 永久会员ID
};

// --- 2. 主逻辑区域 ---
let body = $response.body;
if (!body) $done({});

let obj = JSON.parse(body);
const url = $request.url;
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// A. 处理 Pixiu 的私有用户信息接口
if (url.indexOf("/api/v1/user/info") !== -1) {
    if (obj.data) {
        obj.data.is_vip = 1;
        obj.data.vip_type = 1;
        obj.data.expires_time = "2099-12-31 23:59:59";
        obj.data.left_days = 999999;
    }
}

// B. 处理 iTunes 收据验证 (即你提到的 bundle_id 匹配部分)
if (url.indexOf("/verifyReceipt") !== -1) {
    // 检查收据中的 bundle_id 是否为貔貅
    const bundle_id = obj.receipt ? (obj.receipt.bundle_id || obj.receipt.Bundle_Id) : null;

    if (bundle_id === "com.pixiu.design") {
        // 定义各种订阅 ID 模板
        const yearid = `${bundle_id}.year`;
        const yearlyid = `${bundle_id}.yearly`;
        const yearlysubscription = `${bundle_id}.yearlysubscription`;
        const lifetimeid = pixiu_config.id; // 即 com.pixiu.design.lifetime

        // 构造标准的收据响应格式
        obj.pending_renewal_info = [{
            "product_id": lifetimeid,
            "original_transaction_id": "888888888888888",
            "auto_renew_status": "0"
        }];

        obj.receipt.in_app = [{
            "quantity": "1",
            "product_id": lifetimeid,
            "transaction_id": "888888888888888",
            "original_transaction_id": "888888888888888",
            "purchase_date": "2023-01-01 00:00:00 Etc/GMT",
            "purchase_date_ms": "1672531200000",
            "original_purchase_date": "2023-01-01 00:00:00 Etc/GMT",
            "original_purchase_date_ms": "1672531200000",
            "expires_date": "2099-12-31 23:59:59 Etc/GMT",
            "expires_date_ms": "4102415999000"
        }];

        // 兼容不同的字段名
        obj.latest_receipt_info = obj.receipt.in_app;
    }
}

$done({ body: JSON.stringify(obj) });
