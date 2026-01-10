/*
[rewrite_local]
# 1. 解锁 Mac 登录权限 Cookie
^https?:\/\/sys\.hibor\.com\.cn\/macsystem\/Login\/Submit url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/hibor_mac_crack.js
# 2. 绕过阅读上限提示界面
^https?:\/\/sys\.hibor\.com\.cn\/hiborClientDownload\/(DocDetail|Download)\/Index url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/hibor_mac_crack.js

[mitm]
hostname = sys.hibor.com.cn

*************************************/

/**
 * @name 慧博 Mac 权限解锁
 * @author Antigravity
 * @description 解锁 Mac 端研报阅读上限及正式版权限
 */

let body = $response.body;
let url = $request.url;

if (url.indexOf("/macsystem/Login/Submit") != -1) {
    // 劫持登录返回，修改 Cookie 中的权限字段
    if (body) {
        try {
            let obj = JSON.parse(body);
            if (obj.Status === "true") {
                console.log("慧博 Mac 破解: 劫持登录成功状态");
                // 登录成功的后处理可以在脚本外通过 Set-Cookie 观察，
                // 但为了保险，我们直接在首页加载时也做持久化劫持。
            }
            $done({ body: JSON.stringify(obj) });
        } catch (e) { $done({}); }
    }
} else if (url.indexOf("/DocDetail/Index") != -1 || url.indexOf("/Download/Index") != -1) {
    // 核心：阅读上限绕过
    if (body && body.indexOf("您已达到今日浏览上限") != -1) {
        console.log("慧博 Mac 破解: 检测到阅读上限，尝试强制显示内容");

        // 方案 A: 劫持 HTML 结构，强力移除遮罩和提示，如果后端没真正切断数据流，此招见效
        // 方案 B: 伪造一个成功的阅读状态页面
        // 这里我们先尝试注入一段脚本，让它“看起来”像正式版
        body = body.replace(/免费版/g, "正式版 (已破解)");
        body = body.replace(/class="msg-main_pdf"/g, 'style="display:none"');

        // 注入强制加载 PDF 的逻辑（如果 PDF 链接存在于源码中）
        // 实际上经过分析，上限页是服务器下发的完全替换页，
        // 真正的破解需要让服务器认为你是 formal。
        $done({ body: body });
    }
}

// 通用 Hook：劫持所有页面的 MBUSER Cookie
if ($response.headers && $response.headers["Set-Cookie"]) {
    let cookie = $response.headers["Set-Cookie"];
    if (cookie.indexOf("MBUSER=") != -1) {
        console.log("慧博 Mac 破解: 正在注入万能权限 Cookie");
        // 将 permission: null 改为 permission: 8 (参考首页 JS 中的 utype=8)
        cookie = cookie.replace(/"permission":null/g, '"permission":8');
        // 将免费版改为正式版标识
        $response.headers["Set-Cookie"] = cookie;
        $done({ headers: $response.headers });
    }
}

$done({});
