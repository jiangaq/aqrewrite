/*
 *
 *
脚本功能：Spokenly Pro 解锁 (Refined)
软件版本：2.15.2
脚本作者：CrackMaster
更新时间：2025-12-31
使用声明：仅供学习与交流，请在下载使用24小时内删除！
*******************************
[rewrite_local]
# 清理 ETag (防止 304 缓存)
^https?:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts) url script-request-header https://raw.githubusercontent.com/YOUR_REPO/spokenly_crack.js

# 修改响应 Body
^https?:\/\/api\.spokenly\.app\/api\/chromex\/spokenly\/(config|device\/check-free-limit) url script-response-body https://raw.githubusercontent.com/YOUR_REPO/spokenly_crack.js
^https?:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts) url script-response-body https://raw.githubusercontent.com/YOUR_REPO/spokenly_crack.js

[mitm]
hostname = api.spokenly.app, api.revenuecat.com
*
*
*/

const url = $request.url;

// 1. 请求头处理 (Request Header) - 清理缓存标记
if (typeof $response === "undefined") {
    // 删除 ETag，强制服务器返回最新完整数据，确保 script-response-body 能触发
    delete $request.headers["x-revenuecat-etag"];
    delete $request.headers["X-RevenueCat-ETag"];
    delete $request.headers["if-none-match"];
    $done({ headers: $request.headers });
}
// 2. 响应体处理 (Response Body)
else if ($response.body) {
    // 过滤 SR 测试数据
    if ($response.body === "hello" || $response.body === "") {
        console.log("⚠️ 检测到模拟测试数据");
        $done({});
    } else {
        try {
            let obj = JSON.parse($response.body);

            // === Spokenly Config ===
            if (url.indexOf('spokenly/config') !== -1) {
                if (obj.streaming) {
                    obj.streaming.streamingEnabled = true;
                    obj.streaming.intervalMs = 50;
                }
            }
            // === Spokenly Limit ===
            else if (url.indexOf('check-free-limit') !== -1) {
                obj.limit_reached = false;
                obj.usage_remaining_percent = 100.0;
            }
            // === RevenueCat ===
            else if (url.indexOf('revenuecat') !== -1 && obj.subscriber) {
                const data = {
                    "expires_date": "2099-12-31T12:00:00Z",
                    "original_purchase_date": "2023-09-01T11:00:00Z",
                    "purchase_date": "2023-09-01T11:00:00Z",
                    "ownership_type": "PURCHASED",
                    "store": "app_store"
                };

                // 常见 ID 列表 (如果您确定了 UA 也可以像示例脚本那样用 UA 判断)
                // 这里我们依然采用地毯式注入，因为 Spokenly 的 ID 未知
                const ids = ["pro", "premium", "vip", "plus", "subscription", "all_access", "spokenly_pro", "full_access"];
                const prod_id = "app.spokenly.pro.yearly"; // 这是一个强猜测

                obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
                obj.subscriber.entitlements = obj.subscriber.entitlements || {};

                // 注入 Subscriptions
                obj.subscriber.subscriptions[prod_id] = data;

                // 注入 Entitlements
                for (let id of ids) {
                    obj.subscriber.entitlements[id] = JSON.parse(JSON.stringify(data));
                    obj.subscriber.entitlements[id].product_identifier = prod_id;
                }

                // 强制其他字段
                obj.subscriber.original_purchase_date = "2023-09-01T11:00:00Z";
            }

            $done({ body: JSON.stringify(obj) });
        } catch (e) {
            console.log("Script error: " + e);
            $done({});
        }
    }
} else {
    $done({});
}
