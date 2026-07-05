// QX标准单脚本订阅模板：语鲸 App 绕过验证

/*
hostname = api-public.lingowhale.com

api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
api-public\.lingowhale\.com\/api\/lingowhale\/v1\/user_subscribe\/upsert url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
*/

let url = $request.url;
let body = $response.body;

if (body) {
    let obj = JSON.parse(body);

    // 1. 如果是获取会员状态的接口
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

    // 2. 如果是添加/更新订阅的接口 (解除 40301 限制)
    if (url.indexOf("/v1/user_subscribe/upsert") !== -1) {
        if (obj.data) {
            // 强行把报错信息清空或改为 null，让前端以为服务器允许通过
            obj.data.membership_limit_info = null; 
            // 模拟生成一个虚拟的订阅ID，防止前端因为没有 ID 报错
            if (!obj.data.subscribe_id) {
                obj.data.subscribe_id = "sub_mock_666666";
            }
        }
        obj.code = 0;
        obj.msg = "";
    }

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
