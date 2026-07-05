// QX标准单脚本订阅模板：语鲸 App 绕过验证

/*
hostname = api-public.lingowhale.com

api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/yujing_vip.js
*/

let body = $response.body;

if (body) {
    let obj = JSON.parse(body);

    // 1. 修改会员状态为 Pro
    if (obj.data && obj.data.membership) {
        obj.data.membership.current_plan = "pro"; 
        obj.data.membership.plan_id = "pro_yearly"; 
        obj.data.membership.plan_status = "active";
        obj.data.membership.auto_renewal = true;
        obj.data.membership.plan_start_time = 1719792000; 
        obj.data.membership.plan_expire_time = 4097308800; // 2100年
    }

    // 2. 解锁无限额度
    if (obj.data && obj.data.quota) {
        let q = obj.data.quota;
        q.channel_sub_limit = 9999;
        q.channel_create_limit = 9999;
        q.article_key_points_limit = 9999;
        q.article_breakdown_limit = 9999;
        q.tts_limit = 999999;
        q.export_limit = 9999;
        q.daily_voice_limit = 9999;
        
        q.channel_sub_used = 0;
        q.channel_create_used = 0;
        q.article_key_points_used = 0;
        q.article_breakdown_used = 0;
        q.tts_used = 0;
        q.export_used = 0;
        q.daily_voice_used = 0;
    }

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
