/*
乐股乐股 (legulegu.com) 去广告及解除图表倒计时脚本
适用平台：Quantumult X

[rewrite_local]
# 拦截倒计时遮罩及网页广告
^https?:\/\/legulegu\.com\/stockdata\/middle-avg-indicator url script-response-body https://raw.githubusercontent.com/jiangaq/aqrewrite/refs/heads/main/legulegu.js
[mitm]
hostname = legulegu.com, *.legulegu.com
*/


let body = $response.body;
if (body) {
    // 1. 注入 CSS 隐藏广告元素和倒计时遮罩
    const css = `
        /* 隐藏所有页面的倒计时文字和遮罩层 */
        .count-down, 
        .ad-individual-20s, 
        .count-down-ad-container,
        [id^="count-down-"],
        [id^="ad-individual-20s-"],
        
        /* 隐藏侧边栏、浮窗、关注公众号 */
        .lg-wxgzh-side-bar, 
        .lg-wechat-container,
        .lg-top-ad, 
        .lg-ad-side, 
        .lg-container-ad,
        
        /* 隐藏第三方广告位 */
        .adsbygoogle,
        ins.adsbygoogle,
        iframe[src*="googleads"],
        iframe[src*="pos.baidu.com"]
        { display: none !important; }
        
        /* 确保图表容器可见并溢出正常 */
        .indicator-chart,
        .echarts-element,
        [class*="echarts-element-"] { 
            z-index: 10 !important; 
            overflow: visible !important;
        }
    `;
    // 将 CSS 注入到 <head> 标签中
    body = body.replace(/<\/head>/, `<style>${css}</style></head>`);
    // 2. 移除阻碍交互的 JS 逻辑（如果需要）
    // 这里的遮罩主要是靠 z-index 和定时器控制，CSS 隐藏通常已足够。
    // 如果网页有强制检测，可以进一步处理脚本。
}
$done({ body });
