let body = $response.body;

if (body) {
    let obj = JSON.parse(body);

    // 1. 破解会员方案与状态
    if (obj.data && obj.data.membership) {
        obj.data.membership.current_plan = "pro"; 
        obj.data.membership.plan_id = "pro_yearly"; 
        obj.data.membership.plan_status = "active";
        obj.data.membership.auto_renewal = true;
        obj.data.membership.plan_start_time = 1719792000; 
        obj.data.membership.plan_expire_time = 4097308800; // 2100年
    }

    // 2. 解锁各项使用额度 (Limit调大，Used清零)
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

    // 【Debug 通知代码】执行成功时向系统发送弹窗通知
    $notify("语鲸 App 绕过脚本", "🚀 重写执行成功", "已成功将数据修改为：Pro 会员 + 9999 额度");

    // 3. 将修改后的数据返回给 App
    $done({ body: JSON.stringify(obj) });
} else {
    // 如果响应体为空，也弹窗提示
    $notify("语鲸 App 绕过脚本", "⚠️ 警告", "抓取到了请求，但 Response Body 为空！");
    $done({});
}
