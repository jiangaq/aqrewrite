/*
[rewrite_local]
^https?:\/\/mp\.hibor\.com\.cn\/Mobile\/(GetJsonHandler|getTuHander)\.ashx url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/hibor_crack.js

[mitm]
hostname = mp.hibor.com.cn

*************************************/

let body = $response.body;
if (!body) $done({});

try {
    let obj = JSON.parse(body);
    let url = $request.url;

    // 1. 劫持基础账户权限 (action=upperpart)
    if (url.indexOf("action=upperpart") != -1) {
        if (obj.data) {
            obj.data.version = "formal";
            obj.data.chinaVersion = "正式版";
            obj.data.dayNum = "999";
            obj.data.jfNum = "99999";
            console.log("慧博破解: 已解锁正式版账户");
        }
    }
    // 2. 劫持研报购买状态 (action=isGoumai)
    else if (url.indexOf("action=isGoumai") != -1) {
        if (obj.data) {
            obj.data.isGoumai = "true";
            console.log("慧博破解: 已解锁研报购买状态");
        }
    }
    // 3. 劫持全功能模块限制 (getTuHander.ashx)
    else if (url.indexOf("getTuHander.ashx") != -1) {
        if (obj.data && obj.data.list) {
            obj.data.list.forEach(item => {
                item.isdaoqi = "true";
                item.isshengji = "false";
                item.isshow = 1;
                item.isshow_in = "true";
            });
            console.log("慧博破解: 已解锁全功能模块到期限制");
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.log("慧博破解脚本运行出错: " + e);
    $done({});
}
