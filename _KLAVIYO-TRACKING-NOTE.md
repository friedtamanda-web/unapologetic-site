# REQUIRED ON EVERY PAGE — Klaviyo onsite tracking (account Twvzce)

Every .html page on theunapologeticleader.com MUST include this snippet in the <head>.
It powers Klaviyo tracking + renders all embeds (<div class="klaviyo-form-XXXX"></div>) and popups.
When you add a NEW page, paste this before </head>. After any rebuild, confirm it's on every page.

<!-- Klaviyo onsite (account Twvzce) -->
<script async type="text/javascript" src="https://static.klaviyo.com/onsite/js/Twvzce/klaviyo.js?company_id=Twvzce"></script>
<script type="text/javascript">
!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
</script>

Quick check from terminal:  grep -L 'company_id=Twvzce' *.html   (lists any page MISSING it — should be empty)
