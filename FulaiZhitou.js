/*
 * 复来智投 (FulaiZhitou) VIP 破解脚本
 * 功能：解锁指数宝 VIP，查看全部指数榜单
 * 
 * [Rewrite]
 * ^https:\/\/api\.fulaizhitou\.com\/tools\/user\/center url script-response-body fulaizhitou_crack.js
 * 
 * [MITM]
 * hostname = api.fulaizhitou.com
 */
const url = $request.url;
const body = $response.body;
if (body) {
    let obj = JSON.parse(body);
    // 核心逻辑: 修改 VIP 状态
    // 这个接口决定了前端是否显示模糊遮罩
    
    // 1. 将 VIP 标志置为 1 (启用)
    if (obj.hasOwnProperty('vip')) {
        obj.vip = 1;
    }
    
    // 2. 设置 VIP 类型 (以防区分普通/高级会员)
    if (obj.hasOwnProperty('vipType')) {
        obj.vipType = 1; 
    }
    
    // 3. 设置一个遥远的过期时间
    if (obj.hasOwnProperty('oldEndTime')) {
        obj.oldEndTime = "2099-12-31"; 
    }
    
    // 4. 去除可能存在的弹窗干扰
    obj.showPop = false; 
    console.log("✅ 复来智投: VIP 权益已激活");
    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
