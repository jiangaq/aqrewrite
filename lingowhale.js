/*
 * 脚本功能：语鲸 Lingowhale - 解锁 Pro 会员
 * 适用版本：2.0.0
 * 更新时间：2026-10-14
 * 使用声明：⚠️ 此脚本仅供学习与技术交流，请勿用于商业用途！⚠️
 *
 * [rewrite_local]
 * ^https?:\/\/api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/status url script-response-body https://raw.githubusercontent.com/yourname/scripts/main/lingowhale.js
 * ^https?:\/\/api-public\.lingowhale\.com\/api\/lingowhale\/v1\/membership\/plans url script-response-body https://raw.githubusercontent.com/yourname/scripts/main/lingowhale.js
 *
 * [mitm]
 * hostname = api-public.lingowhale.com
 */

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

// 只处理成功响应
if (obj.code !== 0) {
  $done({ body: body });
  return;
}

// ─── 接口 1：membership/status ────────────────────────────────────────────────
if (url.indexOf("/membership/status") !== -1) {

  // 伪造会员身份为 Pro
  var membership = obj.data.membership;
  membership.current_plan       = "pro";
  membership.plan_status        = "active";
  membership.auto_renewal       = true;
  membership.plan_start_time    = Math.floor(Date.now() / 1000);
  membership.plan_expire_time   = 9999999999; // 远期时间戳
  membership.plan_id            = "69ea15cd50c847af2a8101a1"; // Pro 月付 plan_id

  // 将所有配额替换为 Pro 套餐对应值（-1 = 无限制）
  var quota = obj.data.quota;
  quota.article_key_points_limit  = -1;
  quota.tts_limit                 = -1;
  quota.channel_sub_limit         = 1000;
  quota.channel_create_limit      = 50;
  quota.article_breakdown_limit   = -1;
  quota.export_limit              = -1;
  quota.daily_voice_limit         = -1;
  quota.custom_brief_limit        = 5;

  // 关闭试用入口（已是 Pro，不需要试用）
  obj.data.can_claim_trial = false;

  console.log("[语鲸] membership/status 已伪造为 Pro");
}

// ─── 接口 2：membership/plans ─────────────────────────────────────────────────
else if (url.indexOf("/membership/plans") !== -1) {

  // 开启免费试用入口
  obj.data.trial_available = true;

  console.log("[语鲸] membership/plans 已修改，试用入口已开启");
}

$done({ body: JSON.stringify(obj) });
