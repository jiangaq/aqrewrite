/*************************************

项目名称：iTunes-系列解锁 (貔貅记账专版)
更新日期：2026-01-28
脚本作者：@ddm1023 (逻辑还原：Gemini)
使用声明：⚠️仅供参考，🈲转载与售卖！

[rewrite_local]
# 匹配苹果内购验证地址
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/pixiu_crack.js 

[mitm]
hostname = buy.itunes.apple.com

*************************************/

const ddm = JSON.parse($response.body);
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// 这里的 bundle_id 提取和变量定义完全保留，即便只匹配一个 App
const bundle_id = ddm.receipt ? (ddm.receipt["bundle_id"] || ddm.receipt["Bundle_Id"]) : null;
const yearid = `${bundle_id}.year`;
const yearlyid = `${bundle_id}.yearly`;
const yearlysubscription = `${bundle_id}.yearlysubscription`;
const lifetimeid = `${bundle_id}.lifetime`;

// 匹配列表：仅保留貔貅记账
const list = {
  'com.RuoG.Pixiu': { cm: 'timea', hx: 'hxpda', id: "com.RuoG.Pixiu.VIPYear", latest: "ddm1023" }
};

// 原始脚本中的回执模板数据
const receipt = {
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

let anchor = false;
let data;

// 完整保留原始脚本的遍历与逻辑分支
for (const i in list) {
  const regex = new RegExp('^' + i, 'i');
  if (regex.test(ua) || (bundle_id && regex.test(bundle_id))) {
    const { cm, hx, id, ids, latest, version } = list[i];
    const receiptdata = Object.assign({}, receipt, { 'product_id': id });

    // 完整保留原脚本对 cm (修改类型) 的分支判断
    switch (cm) {
      case 'timea':
        data = [Object.assign({}, receiptdata, expirestime)];
        break;
      case 'timeb':
        data = [receiptdata];
        break;
      case 'timec':
        data = [];
        break;
      case 'timed':
        data = [
          Object.assign({}, receiptdata, expirestime, { 'product_id': ids }),
          Object.assign({}, receiptdata, expirestime, { 'product_id': id })
        ];
        break;
    }

    // 完整保留原脚本对 hx (回执路径) 的分支判断
    if (hx === 'hxpda') {
      if (!ddm.receipt) ddm.receipt = {};
      ddm.receipt.in_app = data;
      ddm.latest_receipt_info = data;
      ddm.pending_renewal_info = [{
        'product_id': id,
        'original_transaction_id': '490001234567890',
        'auto_renew_product_id': id,
        'auto_renew_status': '1'
      }];
      ddm.latest = latest;
    } 
    else if (hx === 'hxpdb') {
      if (ddm.receipt) ddm.receipt.in_app = data;
    } 
    else if (hx === 'hxpdc') {
      const xreceipt = {
        'expires_date_formatted': '2099-01-01 00:00:00 Etc/GMT',
        'expires_date': '4070880000000',
        'expires_date_formatted_pst': '2099-01-01 00:00:00 America/Los_Angeles',
        'product_id': id
      };
      ddm.receipt = Object.assign({}, ddm.receipt || {}, xreceipt);
      ddm.latest_receipt_info = Object.assign({}, ddm.latest_receipt_info || {}, xreceipt);
      ddm.status = 0;
      ddm.auto_renew_status = 1;
      ddm.product_id = id;
    }

    if (version) {
      if (ddm.receipt) ddm.receipt.application_version = version;
    }

    anchor = true;
    console.log("iTunes Unlock Matched: " + i);
    break;
  }
}

// 兜底逻辑：如果未匹配成功，仍执行默认的全局改写逻辑 (原脚本末尾逻辑)
if (!anchor) {
  data = [Object.assign({}, receipt, expirestime, { 'product_id': yearlyid })];
  if (ddm.receipt) ddm.receipt.in_app = data;
  ddm.latest_receipt_info = data;
  ddm.pending_renewal_info = [{
    'product_id': yearlyid,
    'original_transaction_id': '490001234567890',
    'auto_renew_product_id': yearlyid,
    'auto_renew_status': '1'
  }];
  ddm.status = 0;
}

$done({ 'body': JSON.stringify(ddm) });
