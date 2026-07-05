// QX标准单脚本订阅模板：语鲸 App 绕过验证

/*
hostname = api-public.lingowhale.com

api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
api-public\.lingowhale\.com\/api\/lingowhale\/v1\/user_subscribe\/upsert url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
api-public\.lingowhale\.com\/api\/lingowhale\/v1\/user_subscribe\/list url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
*/

let url = $request.url;
let body = $response.body;

if (body) {
    let obj = JSON.parse(body);

    // 1. 拦截状态接口：解锁前端 Pro 界面与 9999 本地额度
    if (url.indexOf("/v1/membership/status") !== -1) {
        if (obj.data && obj.data.membership) {
            obj.data.membership.current_plan = "pro"; 
            obj.data.membership.plan_id = "pro_yearly"; 
            obj.data.membership.plan_status = "active";
            obj.data.membership.auto_renewal = true;
            obj.data.membership.plan_start_time = 1719792000; 
            obj.data.membership.plan_expire_time = 4097308800; 
        }
        if (obj.data && obj.data.quota) {
            let q = obj.data.quota;
            q.channel_sub_limit = 9999; q.channel_create_limit = 9999;
            q.article_key_points_limit = 9999; q.article_breakdown_limit = 9999;
            q.tts_limit = 999999; q.export_limit = 9999; q.daily_voice_limit = 9999;
            q.channel_sub_used = 0; q.channel_create_used = 0; q.article_key_points_used = 0;
            q.article_breakdown_used = 0; q.tts_used = 0; q.export_used = 0; q.daily_voice_used = 0;
        }
    }

    // 2. 拦截添加订阅接口：放行 40301 报错阻断
    if (url.indexOf("/v1/user_subscribe/upsert") !== -1) {
        if (obj.data) {
            obj.data.membership_limit_info = null; 
            if (!obj.data.subscribe_id) {
                obj.data.subscribe_id = "sub_mock_666666"; 
            }
        }
        obj.code = 0;
        obj.msg = "";
    }

    // 3. 拦截订阅列表接口：防止服务器返回的数据把我们新增的订阅冲掉
    if (url.indexOf("/v1/user_subscribe/list") !== -1) {
        // 如果服务器返回的列表存在，但因为超额被云端截断了
        if (obj.data && Array.isArray(obj.data.list)) {
            // 检查服务器返回的列表长度。如果它为空，或者少于你本地想要的，我们直接在前端模拟追加数据
            // 为了防止列表直接为空，我们可以向里面 push 一个高级 Pro 独占的模拟频道数据
            if (obj.data.list.length > 0) {
                // 克隆列表里已有的第一个频道的格式，伪造一个无限制订阅
                let mockItem = JSON.parse(JSON.stringify(obj.data.list[0]));
                mockItem.subscribe_id = "sub_mock_666666";
                mockItem.channel_id = "channel_mock_8888";
                mockItem.title = "✨ 已解锁高级专属频道";
                // 将伪造的频道追加进列表，骗过前端渲染
                obj.data.list.push(mockItem);
            }
        }
        obj.code = 0;
        obj.msg = "";
    }

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
