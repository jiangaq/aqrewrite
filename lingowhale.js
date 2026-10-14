/******************************

脚本功能：语鲸 Lingowhale - 解锁 Pro 会员
适用版本：2.0.0
更新时间：2026-10-14
使用声明：⚠️ 此脚本仅供学习与技术交流，请勿用于商业用途！⚠️

******************************

[rewrite_local]

^https:\/\/api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/status url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/lingowhale.js
^https:\/\/api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/plans url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/lingowhale.js

[mitm]

hostname = api-public.lingowhale.com

*******************************/

var url = $request.url;
var body = $response.body;

if (!body) {
  $done({});
  return;
}

var obj;
try {
  obj = JSON.parse(body);
} catch (e) {
  $done({ body: body });
  return;
}

if (obj.code !== 0) {
  $done({ body: body });
  return;
}

// 接口 1：membership/status
if (url.indexOf("/membership/status") !== -1) {
  var m = obj.data.membership;
  m.current_plan     = "pro";
  m.plan_status      = "active";
  m.auto_renewal     = true;
  m.plan_start_time  = Math.floor(Date.now() / 1000);
  m.plan_expire_time = 9999999999;
  m.plan_id          = "69ea15cd50c847af2a8101a1";

  var q = obj.data.quota;
  q.article_key_points_limit = -1;
  q.tts_limit                = -1;
  q.channel_sub_limit        = 1000;
  q.channel_create_limit     = 50;
  q.article_breakdown_limit  = -1;
  q.export_limit             = -1;
  q.daily_voice_limit        = -1;
  q.custom_brief_limit       = 5;

  obj.data.can_claim_trial = false;
}

// 接口 2：membership/plans
else if (url.indexOf("/membership/plans") !== -1) {
  obj.data.trial_available = true;
}

$done({ body: JSON.stringify(obj) });
