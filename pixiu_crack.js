/*************************************

项目名称：貔貅记账 (Pixiu) 
更新日期：2026-01-28

*************************************/

// 1. 获取原始响应体
let ddm = JSON.parse($response.body);
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
const bundle_id = ddm.receipt ? (ddm.receipt["bundle_id"] || ddm.receipt["Bundle_Id"]) : null;

// 2. 匹配列表 (仅保留貔貅记账)
const list = {
  'com.RuoG.Pixiu': { cm: 'timea', hx: 'hxpda', id: "com.RuoG.Pixiu.VIPYear", latest: "ddm1023" }
};

// 3. 预设会员回执模板
const receiptTemplate = {
  'quantity': '1',
  'purchase_date_ms': '1681222442000',
  'is_in_intro_offer_period': 'false',
  'transaction_id': '490001234567890',
  'is_trial_period': 'false',
  'original_transaction_id': '490001234567890',
  'purchase_date': '2023-04-11 14:14:02 Etc/GMT',
  'original_purchase_date_pst': '2023-04-11 07:14:02 America/Los_Angeles',
  'in_app_ownership_type': 'PURCHASED',
  'original_purchase_date_ms': '1681222442000',
  'web_order_line_item_id': '490001234567890',
  'purchase_date_pst': '2023-04-11 07:14:02 America/Los_Angeles',
  'original_purchase_date': '2023-04-11 14:14:02 Etc/GMT'
};

const expirestime = {
  'expires_date': '2099-01-01 00:00:00 Etc/GMT',
  'expires_date_pst': '2099-01-01 00:00:00 America/Los_Angeles',
  'expires_date_ms': '4070880000000'
};

// 4. 执行匹配与修改
let isMatched = false;

for (const key in list) {
  const regex = new RegExp('^' + key, 'i');
  
  if (regex.test(ua) || (bundle_id && regex.test(bundle_id))) {
    const item = list[key];
    // 对应 cm: 'timea' 的逻辑 -> 带有过期时间的年度订阅
    const data = [Object.assign({}, receiptTemplate, expirestime, { 'product_id': item.id })];

    // 对应 hx: 'hxpda' 的逻辑 -> 注入到所有关键验证路径
    if (!ddm.receipt) ddm.receipt = {};
    ddm.receipt.in_app = data;
    ddm.latest_receipt_info = data;
    ddm.pending_renewal_info = [{
      'product_id': item.id,
      'original_transaction_id': '490001234567890',
      'auto_renew_product_id': item.id,
      'auto_renew_status': '1'
    }];
    ddm.status = 0;
    
    isMatched = true;
    console.log("iTunes Unlock: [貔貅记账] 匹配成功");
    break;
  }
}

// 5. 最终返回结果
$done({ 'body': JSON.stringify(ddm) });
