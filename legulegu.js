/*
乐股乐股 (legulegu.com) 去广告及解除图表倒计时脚本
适用平台：Quantumult X
作者：Antigravity
[rewrite_local]
# 拦截倒计时遮罩及网页广告
^https?:\/\/legulegu\.com\/stockdata\/middle-avg-indicator url script-response-body https://raw.githubusercontent.com/user/repo/main/legulegu.js
[mitm]
hostname = legulegu.com, *.legulegu.com
*/
let body = $response.body;
if (body) {
    // 1. 注入 CSS 隐藏广告元素和倒计时遮罩
    const css = `
        .lg-top-ad, 
        .lg-ad-side, 
        .adsbygoogle, 
        .count-down, 
        .ad-individual-20s, 
        .count-down-ad-container, 
        .lg-wxgzh-side-bar, 
        .lg-wechat-container,
        #count-down-1,
        #ad-individual-20s-1
        { display: none !important; }
        .indicator-chart { z-index: 10 !important; }
    `;
    
    // 将 CSS 注入到 <head> 标签中
    body = body.replace(/<\/head>/, `<style>${css}</style></head>`);
    
    // 2. 移除阻碍交互的 JS 逻辑（如果需要）
    // 这里的遮罩主要是靠 z-index 和定时器控制，CSS 隐藏通常已足够。
    // 如果网页有强制检测，可以进一步处理脚本。
}
$done({ body });
