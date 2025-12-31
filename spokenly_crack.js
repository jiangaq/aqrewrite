/*
 *
 *
脚本功能：Spokenly Pro 解锁 (无限额度+Pro标识)
软件版本：2.15.2
脚本作者：CrackMaster
更新时间：2025-12-31
使用声明：仅供学习与交流，请在下载使用24小时内删除！
*******************************
[rewrite_local]
# > Spokenly Pro 解锁
^https?:\/\/api\.spokenly\.app\/api\/chromex\/spokenly\/(config|device\/check-free-limit) url script-response-body https://raw.githubusercontent.com/YOUR_REPO/spokenly_crack.js
^https?:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts) url script-response-body https://raw.githubusercontent.com/YOUR_REPO/spokenly_crack.js

[mitm]
hostname = api.spokenly.app, api.revenuecat.com
*
*
*/

let obj = JSON.parse($response.body);
const url = $request.url;

try {
    // 1. Spokenly Config (开启完整流式传输功能)
    if (url.indexOf('spokenly/config') !== -1) {
        if (obj.streaming) {
            obj.streaming.streamingEnabled = true;
            obj.streaming.intervalMs = 50;
        }
    }
    // 2. Spokenly Limit Check (锁死剩余额度为100%)
    else if (url.indexOf('check-free-limit') !== -1) {
        obj.limit_reached = false;
        obj.usage_remaining_percent = 100.0;
    }
    // 3. RevenueCat (Pro 订阅伪造)
    else if (url.indexOf('revenuecat') !== -1 && obj.subscriber) {
        const pro_data = {
            "expires_date": "2099-12-31T00:00:00Z",
            "grace_period_expires_date": null,
            "product_identifier": "app.spokenly.pro.yearly",
            "purchase_date": "2023-01-01T00:00:00Z"
        };

        const sub_data = {
            "expires_date": "2099-12-31T00:00:00Z",
            "original_purchase_date": "2023-01-01T00:00:00Z",
            "period_type": "normal",
            "purchase_date": "2023-01-01T00:00:00Z",
            "store": "app_store",
            "unsubscribe_detected_at": null
        };

        // 注入 Entitlements (权限)
        obj.subscriber.entitlements = obj.subscriber.entitlements || {};
        obj.subscriber.entitlements["pro"] = pro_data;
        obj.subscriber.entitlements["premium"] = pro_data; // 防御性注入

        // 注入 Subscriptions (订阅信息)
        obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
        obj.subscriber.subscriptions["app.spokenly.pro.yearly"] = sub_data;

        // 修正基础账户信息
        obj.subscriber.original_purchase_date = "2023-01-01T00:00:00Z";
        obj.subscriber.original_application_version = "1.0";
    }
} catch (e) {
    console.log("Spokenly crack script error:", e);
}

$done({ body: JSON.stringify(obj) });
