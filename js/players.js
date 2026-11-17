/* ============================================================
   players.js  -  ONE player for every video link on the site.
   DSVBPlayer.mount(element, url, {title, description, autoplay, compact})
     YouTube        -> your custom player (branding hidden, own controls)
     Google Drive   -> embed player
     Vimeo          -> embed player
     .mp4/.webm...  -> your native player
     anything else  -> "Watch externally" button
   DSVBPlayer.destroy(element) cleans a mounted player up.
   Generated from your youtube_player / native_video_player / embed_video_player templates.
   ============================================================ */
(function () {
  "use strict";
  var uid = 0, mounted = new WeakMap();

  var YT_CSS = "\n#ytp-__ID__ *,#ytp-__ID__ *::before,#ytp-__ID__ *::after{box-sizing:border-box;margin:0;padding:0;}\n#ytp-__ID__ .mcpPage{width:100%;display:flex;flex-direction:column;align-items:center;padding:0 16px 40px;margin-top:-18px;}\n#ytp-__ID__ .mcpHeader{width:100%;max-width:860px;margin-bottom:12px;padding:0 2px;}\n#ytp-__ID__ .mcpTitle{font-size:21px;font-weight:700;color:#2563eb;line-height:1.3;margin-bottom:2px;letter-spacing:-.2px;}\n#ytp-__ID__ .mcpDesc{font-size:14px;color:#555;line-height:1.65;}\n#ytp-__ID__ .mcpWrap{width:100%;max-width:860px;}\n#vc-__ID__{position:relative!important;width:100%!important;aspect-ratio:16/9!important;background:#000!important;border-radius:14px!important;overflow:hidden!important;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 12px 48px rgba(0,0,0,.18)!important;}\n#vc-__ID__:fullscreen,#vc-__ID__:-webkit-full-screen,#vc-__ID__:-moz-full-screen{border-radius:0!important;aspect-ratio:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;}\n#vc-__ID__:fullscreen #vi-__ID__,#vc-__ID__:-webkit-full-screen #vi-__ID__,#vc-__ID__:-moz-full-screen #vi-__ID__{position:relative!important;inset:auto!important;width:min(100vw,calc(100vh*16/9))!important;height:min(100vh,calc(100vw*9/16))!important;overflow:hidden!important;}\n#vc-__ID__.pfs{position:fixed!important;inset:0!important;z-index:9999!important;background:#000!important;border-radius:0!important;aspect-ratio:unset!important;max-width:none!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;}\n#vc-__ID__.pfs #vi-__ID__{position:relative!important;inset:auto!important;overflow:hidden!important;width:min(100vw,calc(100vh*16/9))!important;height:min(100vh,calc(100vw*9/16))!important;}\nbody.pfs-open{overflow:hidden!important;}\n#rotHint-__ID__{position:absolute;bottom:76px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:40px;padding:10px 18px 10px 14px;opacity:0;pointer-events:none;z-index:36;transition:opacity .5s;white-space:nowrap;}\n#rotHint-__ID__.show{opacity:1;}\n#rotHint-__ID__ svg{width:26px;height:26px;flex-shrink:0;animation:ytpPhoneRot-__ID__ 2.4s ease-in-out infinite;}\n#rotHint-__ID__ span{font-size:12px;color:rgba(255,255,255,.8);font-weight:500;}\n@keyframes ytpPhoneRot-__ID__{0%,15%{transform:rotate(0deg);}50%,70%{transform:rotate(90deg);}90%,100%{transform:rotate(0deg);}}\n@media(orientation:landscape){#rotHint-__ID__{display:none!important;}}\n#vi-__ID__{position:absolute!important;inset:0!important;overflow:hidden!important;}\n#yt-__ID__{position:absolute!important;top:-100px!important;left:0!important;width:100%!important;height:calc(100% + 160px)!important;border:none!important;display:block!important;pointer-events:none!important;}\n#vi-__ID__.c1 #yt-__ID__{height:calc(100% + 220px)!important;}\n#ytp-__ID__ .mg-t{position:absolute;left:0;right:0;top:0;height:70px;background:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);pointer-events:none;z-index:10;}\n#ytp-__ID__ .mg-b{position:absolute;left:0;right:0;bottom:0;height:100px;background:linear-gradient(to top,rgba(0,0,0,.85),transparent);pointer-events:none;z-index:10;}\n#ytp-__ID__ .mg-c{position:absolute;right:0;bottom:0;width:130px;height:55px;background:linear-gradient(to top left,rgba(0,0,0,.95) 28%,transparent 72%);pointer-events:none;z-index:11;}\n#co-__ID__{position:absolute!important;inset:0!important;z-index:20!important;cursor:pointer!important;}\n#spinW-__ID__{position:absolute!important;inset:0!important;z-index:44!important;background:rgba(0,0,0,.75)!important;opacity:1!important;pointer-events:auto!important;transition:opacity .22s!important;}\n#spinW-__ID__.off{opacity:0!important;pointer-events:none!important;}\n#ytp-__ID__ .spin-pos{position:absolute;top:calc(50% - 20px);left:50%;transform:translate(-50%,-50%);}\n#ytp-__ID__ .ring{width:36px;height:36px;border:2.5px solid rgba(255,255,255,.08);border-top-color:#f2c054;border-radius:50%;animation:ytpSpin-__ID__ .72s linear infinite;box-shadow:0 0 12px rgba(242,192,84,.15);}\n@keyframes ytpSpin-__ID__{to{transform:rotate(360deg);}}\n#csb-__ID__{position:absolute!important;top:calc(50% - 20px)!important;left:50%!important;transform:translate(-50%,-50%)!important;z-index:25!important;cursor:pointer!important;opacity:0!important;pointer-events:none!important;}\n@keyframes ytpCsbFl-__ID__{0%,60%{opacity:1;}100%{opacity:0;}}\n#ytp-__ID__ .csb-r{width:72px;height:72px;border-radius:50%;background:rgba(0,0,0,.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,.18);box-shadow:0 8px 32px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;}\n#ytp-__ID__ .csb-r svg{width:26px;height:26px;fill:#fff;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));}\n#endOv-__ID__{position:absolute;inset:0;z-index:27;background:rgba(0,0,0,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;pointer-events:none;transition:opacity .3s;}\n#endOv-__ID__.show{opacity:1;pointer-events:auto;}\n#endOv-__ID__ p{font-size:14px;color:rgba(255,255,255,.7);font-weight:500;}\n#ytp-__ID__ .replay-btn{background:#f2c054;color:#000;border:none;padding:12px 28px;border-radius:12px;font-family:inherit;font-weight:700;font-size:14px;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s,box-shadow .15s;box-shadow:0 4px 16px rgba(242,192,84,.3);}\n#ytp-__ID__ .replay-btn:hover{background:#e6a93a;box-shadow:0 6px 20px rgba(242,192,84,.4);}\n#ytp-__ID__ .replay-btn svg{width:16px;height:16px;fill:#000;}\n#errOv-__ID__{position:absolute;inset:0;z-index:48;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;opacity:0;pointer-events:none;transition:opacity .3s;padding:24px;text-align:center;}\n#errOv-__ID__.show{opacity:1;pointer-events:auto;}\n#ytp-__ID__ .eico{font-size:36px;}\n#ytp-__ID__ .etit{font-size:16px;font-weight:600;color:#fff;}\n#ytp-__ID__ .edes{font-size:12px;color:rgba(255,255,255,.65);max-width:300px;line-height:1.7;}\n#cb-__ID__{position:absolute!important;left:0!important;right:0!important;bottom:0!important;padding:56px 14px 12px!important;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.6) 50%,transparent 100%)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important;z-index:30!important;transition:opacity .3s!important;}\n#cb-__ID__.hide{opacity:0!important;pointer-events:none!important;}\n#ytp-__ID__ .time-row{display:flex;justify-content:flex-end;padding:0 2px 5px;}\n#ytp-__ID__ .td{font-family:'Courier New',Courier,monospace;font-size:10px;color:rgba(255,255,255,.45);white-space:nowrap;letter-spacing:.3px;}\n#pb-__ID__{width:100%;height:20px;display:flex;align-items:center;cursor:pointer;margin-bottom:6px;}\n#ytp-__ID__ .pt{position:relative;width:100%;height:3px;background:rgba(255,255,255,.12);border-radius:99px;transition:height .15s;}\n#pb-__ID__:hover .pt,#pb-__ID__:active .pt{height:5px;}\n#ytp-__ID__ .pbf{position:absolute;inset:0;border-radius:99px;background:rgba(255,255,255,.2);width:0;}\n#ytp-__ID__ .pf{position:absolute;inset:0;border-radius:99px;background:linear-gradient(to right,#e6a93a,#f2c054);width:0;box-shadow:0 0 8px rgba(242,192,84,.3);}\n#ytp-__ID__ .pth{position:absolute;top:50%;left:0;transform:translate(-50%,-50%) scale(0);width:14px;height:14px;background:#f2c054;border-radius:50%;box-shadow:0 2px 8px rgba(242,192,84,.5);transition:transform .15s;}\n#pb-__ID__:hover .pth,#pb-__ID__:active .pth{transform:translate(-50%,-50%) scale(1);}\n#ytp-__ID__ .br{display:flex;align-items:center;gap:2px;min-width:0;}\n#ytp-__ID__ .btn{background:none!important;border:none!important;color:rgba(255,255,255,.8)!important;width:38px!important;height:38px!important;border-radius:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;flex-shrink:0!important;transition:background .14s,color .14s,transform .1s!important;-webkit-tap-highlight-color:transparent!important;padding:0!important;}\n#ytp-__ID__ .btn:hover{background:rgba(255,255,255,.08)!important;color:#fff!important;}\n#ytp-__ID__ .btn:active{transform:scale(.84)!important;}\n#ytp-__ID__ .btn svg{width:17px!important;height:17px!important;display:block!important;}\n#ytp-__ID__ .sp{flex:1;min-width:4px;}\n#ytp-__ID__ .vw{display:flex;align-items:center;gap:4px;flex-shrink:0;}\n#ytp-__ID__ .vs{-webkit-appearance:none!important;appearance:none!important;width:62px!important;height:3px!important;border-radius:99px!important;outline:none!important;cursor:pointer!important;}\n#ytp-__ID__ .vs::-webkit-slider-thumb{-webkit-appearance:none!important;width:12px!important;height:12px!important;background:#fff!important;border-radius:50%!important;box-shadow:0 1px 4px rgba(0,0,0,.4)!important;}\n#ytp-__ID__ .vs::-moz-range-thumb{width:12px!important;height:12px!important;background:#fff!important;border-radius:50%!important;border:none!important;}\n#ytp-__ID__ .spd-wrap,#ytp-__ID__ .q-wrap{position:relative;flex-shrink:0;}\n#ytp-__ID__ .pop-btn{font-family:'Courier New',Courier,monospace!important;font-size:10px!important;letter-spacing:.3px!important;width:auto!important;padding:0 8px!important;color:rgba(255,255,255,.6)!important;white-space:nowrap!important;background:none!important;border:none!important;height:38px!important;border-radius:10px!important;cursor:pointer!important;transition:background .14s,color .14s!important;-webkit-tap-highlight-color:transparent!important;}\n#ytp-__ID__ .pop-btn:hover,#ytp-__ID__ .pop-btn:active{background:rgba(255,255,255,.08)!important;color:#fff!important;}\n#ytp-__ID__ .pop-menu{position:absolute!important;bottom:calc(100% + 12px)!important;right:50%!important;transform:translateX(50%) translateY(6px)!important;background:rgba(10,10,10,.96)!important;backdrop-filter:blur(24px)!important;-webkit-backdrop-filter:blur(24px)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important;padding:6px!important;min-width:84px!important;opacity:0!important;pointer-events:none!important;transition:opacity .15s,transform .15s!important;z-index:50!important;box-shadow:0 16px 48px rgba(0,0,0,.6)!important;}\n#ytp-__ID__ .pop-menu.open{opacity:1!important;pointer-events:auto!important;transform:translateX(50%) translateY(0)!important;}\n#ytp-__ID__ .pop-opt{display:block!important;width:100%!important;background:none!important;border:none!important;color:rgba(255,255,255,.55)!important;padding:8px 12px!important;border-radius:8px!important;font-family:'Courier New',Courier,monospace!important;font-size:10px!important;text-align:center!important;cursor:pointer!important;transition:background .12s,color .12s!important;white-space:nowrap!important;-webkit-tap-highlight-color:transparent!important;letter-spacing:.3px!important;}\n#ytp-__ID__ .pop-opt:hover,#ytp-__ID__ .pop-opt:active{background:rgba(255,255,255,.08)!important;color:#fff!important;}\n#ytp-__ID__ .pop-opt.active{color:#f2c054!important;font-weight:600!important;}\n#ytp-__ID__ .mcpBelow{width:100%;max-width:860px;margin-top:24px;padding:0 2px;}\n@media(max-width:440px){#ytp-__ID__ .vs{display:none!important;}}\n@media(max-width:600px){#ytp-__ID__ .mcpPage{padding:16px 10px 24px;}#ytp-__ID__ .mcpTitle{font-size:18px;}#cb-__ID__{padding:32px 10px 8px!important;}#ytp-__ID__ .time-row{padding:0 2px 3px!important;}#pb-__ID__{margin-bottom:4px!important;}}\n#vc-__ID__.is-short{aspect-ratio:9/16!important;max-width:280px!important;margin:0 auto!important;}\n#vc-__ID__.is-short #yt-__ID__{top:0!important;height:100%!important;}\n#vc-__ID__.is-short:fullscreen,#vc-__ID__.is-short.pfs{aspect-ratio:unset!important;max-width:none!important;margin:0!important;}\n#vc-__ID__.is-short:fullscreen #vi-__ID__,#vc-__ID__.is-short.pfs #vi-__ID__{width:min(100vw,calc(100vh*9/16))!important;height:min(100vh,calc(100vw*16/9))!important;}\n#ytp-__ID__ .fs-title{display:none;position:absolute;top:14px;left:14px;z-index:29;max-width:60%;color:#fff;font-size:13px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .3s;pointer-events:none;}\n#ytp-__ID__ .fs-title.hide{opacity:0;}\n#ytp-__ID__.fs-active .fs-title{display:block;}\n";
  var YT_CSS_COMPACT = "#ytp-__ID__ .mcpPage{padding:0!important;margin-top:0!important;}\n#ytp-__ID__ .mcpHeader,#ytp-__ID__ .mcpBelow{display:none!important;}\n#cb-__ID__{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;padding-top:24px!important;}\n";
  var YT_HTML = "\n\n<div class=\"mcpPage\">\n  <div class=\"mcpHeader\">\n    <h2 class=\"mcpTitle\" id=\"mcpTitle-__ID__\"></h2>\n    <p  class=\"mcpDesc\" id=\"mcpDesc-__ID__\"></p>\n  </div>\n  <div class=\"mcpWrap\">\n    <div id=\"vc-__ID__\"__SHORT__>\n      <div id=\"spinW-__ID__\"><div class=\"spin-pos\"><div class=\"ring\"></div></div></div>\n      <div id=\"rotHint-__ID__\">\n        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#f2c054\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"7\" y=\"2\" width=\"10\" height=\"18\" rx=\"2\"/><circle cx=\"12\" cy=\"17.5\" r=\".8\" fill=\"#f2c054\" stroke=\"none\"/><path d=\"M17 7.5c1.5 1 2.5 2.7 2.5 4.5s-1 3.5-2.5 4.5\"/><path d=\"M19.5 5.5C22 7.2 23.5 9.9 23.5 12s-1.5 4.8-4 6.5\"/></svg>\n        <span>Rotate for landscape view</span>\n      </div>\n      <div id=\"vi-__ID__\">\n        <div id=\"yt-__ID__\"></div>\n        <div class=\"mg-t\"></div><div class=\"mg-b\"></div><div class=\"mg-c\"></div>\n        __FSTITLE__\n        <div id=\"co-__ID__\"></div>\n        <div id=\"csb-__ID__\"><div class=\"csb-r\"><svg id=\"csbI-__ID__\" viewBox=\"0 0 24 24\"><polygon points=\"5,3 19,12 5,21\"/></svg></div></div>\n        <div id=\"endOv-__ID__\"><p>Video ended</p><button id=\"replayBtn-__ID__\" class=\"replay-btn\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 5V3l-4 3 4 3V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z\"/></svg>Replay</button></div>\n        <div id=\"errOv-__ID__\"><div class=\"eico\">⚠</div><div class=\"etit\" id=\"errTitle-__ID__\">Cannot play video</div><div class=\"edes\" id=\"errDesc-__ID__\">An error occurred.</div></div>\n        <div id=\"cb-__ID__\" class=\"hide\">\n          <div class=\"time-row\"><span id=\"tdEl-__ID__\" class=\"td\">0:00 / 0:00</span></div>\n          <div id=\"pb-__ID__\"><div class=\"pt\"><div class=\"pbf\" id=\"pbf-__ID__\"></div><div class=\"pf\" id=\"pf-__ID__\"></div><div class=\"pth\" id=\"pth-__ID__\"></div></div></div>\n          <div class=\"br\">\n            <button class=\"btn\" id=\"rwBtn-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"1 4 1 10 7 10\"/><path d=\"M3.51 15a9 9 0 1 0 .49-3.75\"/></svg></button>\n            <button class=\"btn\" id=\"ppBtn-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\" id=\"ppIco-__ID__\"><polygon points=\"5,3 19,12 5,21\"/></svg></button>\n            <button class=\"btn\" id=\"fwBtn-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"23 4 23 10 17 10\"/><path d=\"M20.49 15a9 9 0 1 1-.49-3.75\"/></svg></button>\n            <div class=\"sp\"></div>\n            <div class=\"q-wrap\"><button class=\"pop-btn\" id=\"qBtn-__ID__\">Auto</button><div class=\"pop-menu\" id=\"qMenu-__ID__\"><button class=\"pop-opt active\" data-q=\"auto\">Auto</button></div></div>\n            <div class=\"spd-wrap\"><button class=\"pop-btn\" id=\"spdBtn-__ID__\">1x</button><div class=\"pop-menu\" id=\"spdMenu-__ID__\"><button class=\"pop-opt\" data-rate=\"2\">2x</button><button class=\"pop-opt\" data-rate=\"1.75\">1.75x</button><button class=\"pop-opt\" data-rate=\"1.5\">1.5x</button><button class=\"pop-opt\" data-rate=\"1.25\">1.25x</button><button class=\"pop-opt active\" data-rate=\"1\">1x</button><button class=\"pop-opt\" data-rate=\"0.75\">0.75x</button><button class=\"pop-opt\" data-rate=\"0.5\">0.5x</button></div></div>\n            <div class=\"vw\"><button class=\"btn\" id=\"mutBtn-__ID__\"><svg viewBox=\"0 0 24 24\" id=\"volIco-__ID__\"><polygon points=\"11,5 6,9 2,9 2,15 6,15 11,19\" fill=\"currentColor\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/></svg></button><input id=\"volSld-__ID__\" class=\"vs\" type=\"range\" min=\"0\" max=\"100\" value=\"100\"></div>\n            <button class=\"btn\" id=\"fsBtn-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" id=\"fsIco-__ID__\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"/></svg></button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"mcpBelow\"></div>";
  var YT_FSTITLE = "<div id=\"fsTitle-__ID__\" class=\"fs-title\"></div>";
  var NV_CSS = "\n#nvp-__ID__ *,#nvp-__ID__ *::before,#nvp-__ID__ *::after{box-sizing:border-box;margin:0;padding:0;}\n#nvp-__ID__.nvp-wrap{width:100%;position:relative;aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 12px 48px rgba(0,0,0,.18);}\n#nvp-__ID__ video{width:100%;height:100%;display:block;object-fit:contain;background:#000;}\n#nvp-__ID__ .nvp-co{position:absolute;inset:0;cursor:pointer;z-index:5;}\n#nvp-__ID__ .nvp-spin{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border:2.5px solid rgba(255,255,255,.08);border-top-color:#f2c054;border-radius:50%;animation:nvpspin .72s linear infinite;opacity:0;pointer-events:none;transition:opacity .2s;z-index:6;}\n#nvp-__ID__ .nvp-spin.show{opacity:1;}\n@keyframes nvpspin{to{transform:translate(-50%,-50%) rotate(360deg);}}\n#nvp-__ID__ .nvp-cb{position:absolute;left:0;right:0;bottom:0;padding:56px 10px 10px;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.6) 50%,transparent 100%);z-index:10;transition:opacity .3s;}\n#nvp-__ID__ .nvp-cb.hide{opacity:0;pointer-events:none;}\n#nvp-__ID__ .nvp-time-row{display:flex;justify-content:flex-end;padding:0 2px 5px;}\n#nvp-__ID__ .nvp-td{font-family:'Courier New',Courier,monospace;font-size:10px;color:rgba(255,255,255,.45);white-space:nowrap;}\n#nvp-__ID__ .nvp-pb{width:100%;height:20px;display:flex;align-items:center;cursor:pointer;margin-bottom:6px;}\n#nvp-__ID__ .nvp-pt{position:relative;width:100%;height:3px;background:rgba(255,255,255,.12);border-radius:99px;}\n#nvp-__ID__ .nvp-pf{position:absolute;inset:0;border-radius:99px;background:linear-gradient(to right,#e6a93a,#f2c054);width:0;}\n#nvp-__ID__ .nvp-pth{position:absolute;top:50%;left:0;transform:translate(-50%,-50%) scale(0);width:14px;height:14px;background:#f2c054;border-radius:50%;transition:transform .15s;}\n#nvp-__ID__ .nvp-pb:hover .nvp-pth{transform:translate(-50%,-50%) scale(1);}\n#nvp-__ID__ .nvp-br{display:flex;align-items:center;gap:1px;flex-wrap:nowrap;}\n#nvp-__ID__ .nvp-btn{background:none;border:none;color:rgba(255,255,255,.8);width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .14s,color .14s;padding:0;}\n#nvp-__ID__ .nvp-btn:hover{background:rgba(255,255,255,.08);color:#fff;}\n#nvp-__ID__ .nvp-btn svg{width:15px;height:15px;}\n#nvp-__ID__ .nvp-sp{flex:1;min-width:4px;}\n#nvp-__ID__ .nvp-vs{-webkit-appearance:none;appearance:none;width:40px;height:3px;border-radius:99px;outline:none;cursor:pointer;background:rgba(255,255,255,.15);flex-shrink:0;}\n#nvp-__ID__ .nvp-vs::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;background:#fff;border-radius:50%;}\n#nvp-__ID__ .nvp-spd-wrap{position:relative;flex-shrink:0;}\n#nvp-__ID__ .nvp-pop-btn{font-family:'Courier New',Courier,monospace;font-size:9px;width:auto;padding:0 5px;color:rgba(255,255,255,.6);background:none;border:none;height:32px;border-radius:10px;cursor:pointer;flex-shrink:0;}\n#nvp-__ID__ .nvp-pop-btn:hover{background:rgba(255,255,255,.08);color:#fff;}\n#nvp-__ID__ .nvp-pop-menu{position:absolute;bottom:calc(100% + 12px);right:50%;transform:translateX(50%);background:rgba(10,10,10,.96);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:6px;min-width:60px;opacity:0;pointer-events:none;transition:opacity .15s;z-index:20;}\n#nvp-__ID__ .nvp-pop-menu.open{opacity:1;pointer-events:auto;}\n#nvp-__ID__ .nvp-pop-opt{display:block;width:100%;background:none;border:none;color:rgba(255,255,255,.55);padding:6px 10px;border-radius:8px;font-family:'Courier New',Courier,monospace;font-size:9px;text-align:center;cursor:pointer;}\n#nvp-__ID__ .nvp-pop-opt:hover{background:rgba(255,255,255,.08);color:#fff;}\n#nvp-__ID__ .nvp-pop-opt.active{color:#f2c054;font-weight:600;}\n#nvp-__ID__ .nvp-title-overlay{display:none;position:absolute;top:14px;left:14px;z-index:11;max-width:60%;color:#fff;font-size:13px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .3s;pointer-events:none;}\n#nvp-__ID__ .nvp-title-overlay.hide{opacity:0;}\n#nvp-__ID__:fullscreen .nvp-title-overlay,#nvp-__ID__:-webkit-full-screen .nvp-title-overlay,#nvp-__ID__:-moz-full-screen .nvp-title-overlay{display:block;}\n#nvp-__ID__.fs-active .nvp-title-overlay{display:block;}\n";
  var NV_HTML = "\n\n<video id=\"nvp-vid-__ID__\" preload=\"metadata\">\n  <source src=\"__SRC__\">\n  Your browser does not support inline video playback.\n</video>\n<div class=\"nvp-co\" id=\"nvp-co-__ID__\"></div>\n<div class=\"nvp-spin\" id=\"nvp-spin-__ID__\"></div>\n__NTITLE__\n\n<div class=\"nvp-cb\" id=\"nvp-cb-__ID__\">\n  <div class=\"nvp-time-row\"><span class=\"nvp-td\" id=\"nvp-td-__ID__\">0:00 / 0:00</span></div>\n  <div class=\"nvp-pb\" id=\"nvp-pb-__ID__\"><div class=\"nvp-pt\"><div class=\"nvp-pf\" id=\"nvp-pf-__ID__\"></div><div class=\"nvp-pth\" id=\"nvp-pth-__ID__\"></div></div></div>\n  <div class=\"nvp-br\">\n    <button type=\"button\" class=\"nvp-btn\" id=\"nvp-pp-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\" id=\"nvp-ppico-__ID__\"><polygon points=\"5,3 19,12 5,21\"/></svg></button>\n    <div class=\"nvp-sp\"></div>\n    <div class=\"nvp-spd-wrap\">\n      <button type=\"button\" class=\"nvp-pop-btn\" id=\"nvp-spdbtn-__ID__\">1x</button>\n      <div class=\"nvp-pop-menu\" id=\"nvp-spdmenu-__ID__\">\n        <button type=\"button\" class=\"nvp-pop-opt\" data-rate=\"2\">2x</button>\n        <button type=\"button\" class=\"nvp-pop-opt\" data-rate=\"1.5\">1.5x</button>\n        <button type=\"button\" class=\"nvp-pop-opt active\" data-rate=\"1\">1x</button>\n        <button type=\"button\" class=\"nvp-pop-opt\" data-rate=\"0.75\">0.75x</button>\n        <button type=\"button\" class=\"nvp-pop-opt\" data-rate=\"0.5\">0.5x</button>\n      </div>\n    </div>\n    <input id=\"nvp-vol-__ID__\" class=\"nvp-vs\" type=\"range\" min=\"0\" max=\"100\" value=\"100\">\n    <button type=\"button\" class=\"nvp-btn\" id=\"nvp-fs-__ID__\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"/></svg></button>\n  </div>";
  var NV_TITLE = "<div class=\"nvp-title-overlay\" id=\"nvp-title-__ID__\">__TITLETEXT__</div>";

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fill(str, id) { return str.split("__ID__").join(id); }

  /* ---------- YouTube (your custom player) ---------- */
  function ytInit(ID, CFG) {


document.getElementById('mcpTitle-'+ID+'').textContent=CFG.title;
var de=document.getElementById('mcpDesc-'+ID+'');
if(CFG.description){de.textContent=CFG.description;}else{de.style.display='none';}
var fsTitle=document.getElementById('fsTitle-'+ID+'');
if(fsTitle){fsTitle.textContent=CFG.title;}

var vc=document.getElementById('vc-'+ID+''),vi=document.getElementById('vi-'+ID+''),co=document.getElementById('co-'+ID+''),cb=document.getElementById('cb-'+ID+'');
var ppBtn=document.getElementById('ppBtn-'+ID+''),ppIco=document.getElementById('ppIco-'+ID+'');
var rwBtn=document.getElementById('rwBtn-'+ID+''),fwBtn=document.getElementById('fwBtn-'+ID+'');
var mutBtn=document.getElementById('mutBtn-'+ID+''),volIco=document.getElementById('volIco-'+ID+''),volSld=document.getElementById('volSld-'+ID+'');
var fsBtn=document.getElementById('fsBtn-'+ID+''),fsIco=document.getElementById('fsIco-'+ID+'');
var spdBtn=document.getElementById('spdBtn-'+ID+''),spdMenu=document.getElementById('spdMenu-'+ID+'');
var qBtn=document.getElementById('qBtn-'+ID+''),qMenu=document.getElementById('qMenu-'+ID+'');
var pb=document.getElementById('pb-'+ID+''),pf=document.getElementById('pf-'+ID+''),pbf=document.getElementById('pbf-'+ID+''),pth=document.getElementById('pth-'+ID+'');
var tdEl=document.getElementById('tdEl-'+ID+''),csb=document.getElementById('csb-'+ID+''),csbI=document.getElementById('csbI-'+ID+'');
var spinW=document.getElementById('spinW-'+ID+''),endOv=document.getElementById('endOv-'+ID+''),replayBtn=document.getElementById('replayBtn-'+ID+'');
var errOv=document.getElementById('errOv-'+ID+''),errTitle=document.getElementById('errTitle-'+ID+''),errDesc=document.getElementById('errDesc-'+ID+'');
var rotHint=document.getElementById('rotHint-'+ID+'');
var DEAD=false,offs=[];function DL(t,f,o){document.addEventListener(t,f,o);offs.push(function(){document.removeEventListener(t,f,o);});}function WL(t,f,o){window.addEventListener(t,f,o);offs.push(function(){window.removeEventListener(t,f,o);});}
var player=null,playing=false,progT=null,hideT=null,csbT=null,rotT=null;
var dragging=false,inPseudoFs=false,retried=false,controlsLevel=0;
var currentQuality='auto',qMenuReady=false;
var spdOpts=spdMenu.querySelectorAll('.pop-opt');
var ql={'highres':'8K','hd2160':'4K','hd1440':'1440p','hd1080':'1080p','hd720':'720p','large':'480p','medium':'360p','small':'240p','tiny':'144p'};
var IPLAY='<polygon points="5,3 19,12 5,21"/>',IPAUSE='<rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/>';

function setVolFill(v){volSld.style.background='linear-gradient(to right,rgba(255,255,255,.85) '+v+'%,rgba(255,255,255,.15) '+v+'%)';}
setVolFill(100);
function csbOn(ico){csbI.innerHTML=ico;clearTimeout(csbT);csb.style.animation='none';csb.style.transition='none';csb.style.opacity='1';csb.style.pointerEvents='auto';}
function csbFl(ico){csbI.innerHTML=ico;clearTimeout(csbT);csb.style.transition='none';csb.style.animation='none';void csb.offsetWidth;csb.style.opacity='1';csb.style.pointerEvents='none';csb.style.animation='ytpCsbFl-'+ID+' .72s forwards';csbT=setTimeout(function(){csb.style.animation='none';csb.style.transition='opacity .22s';csb.style.opacity='0';},750);}
function csbOff(){clearTimeout(csbT);csb.style.animation='none';csb.style.transition='opacity .22s';csb.style.opacity='0';csb.style.pointerEvents='none';}
var spinHideT=null;
function spinHide(){clearTimeout(spinHideT);spinHideT=setTimeout(function(){spinW.style.transition='opacity .22s';spinW.classList.add('off');},450);}
function spinShow(){clearTimeout(spinHideT);spinW.style.transition='none';spinW.classList.remove('off');}

// --- Shared, queued YouTube IFrame API loader -----------------------------
// window.onYouTubeIframeAPIReady only ever fires ONCE, globally, the first
// time the API finishes loading - it is NOT re-fired for later players.
// The previous version of this file re-assigned that callback on every
// single mount, assuming it would fire again for a second/third video -
// it never does once the API is already loaded, which is exactly why
// every video after the first one silently never called makePlayer() and
// sat with a spinner forever. This queue fixes that: every instance
// registers a callback; if the API is already ready, it fires immediately;
// otherwise it waits in a shared queue that the real one-time callback
// drains once, for everyone.
if (!window.__ytApiState) {
  window.__ytApiState = { loaded: false, loading: false, callbacks: [] };
}
function ytApiReady(cb) {
  if (window.__ytApiState.loaded && window.YT && window.YT.Player) { cb(); return; }
  window.__ytApiState.callbacks.push(cb);
  if (!window.__ytApiState.loading) {
    window.__ytApiState.loading = true;
    window.onYouTubeIframeAPIReady = function () {
      window.__ytApiState.loaded = true;
      var cbs = window.__ytApiState.callbacks.slice();
      window.__ytApiState.callbacks = [];
      cbs.forEach(function (fn) { fn(); });
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
}
// ---------------------------------------------------------------------------

function makePlayer(){if(DEAD)return;
  var mountId = 'yt-'+ID+'';
  player=new YT.Player(mountId,{videoId:CFG.videoId,width:'100%',height:'100%',
    playerVars:{autoplay:CFG.autoPlay?1:0,controls:controlsLevel,disablekb:1,fs:0,modestbranding:1,rel:0,showinfo:0,iv_load_policy:3,cc_load_policy:0,playsinline:1,enablejsapi:1,origin:window.location.origin},
    events:{
      onReady:function(e){syncVol();showCtrl();if(CFG.autoPlay){e.target.playVideo();setTimeout(function(){if(!playing){spinHide();csbOn(IPLAY);}},3000);}else{csbOn(IPLAY);spinHide();}},
      onStateChange:function(e){
        var S=YT.PlayerState;
        if(e.data===S.PLAYING){playing=true;spinHide();endOv.classList.remove('show');setPP(true);csbFl(IPLAY);startProg();hideCtrlSoon();if(!qMenuReady){qMenuReady=true;setTimeout(buildQMenu,1000);}}
        else if(e.data===S.PAUSED){playing=false;setPP(false);stopProg();showCtrl();csbOn(IPLAY);}
        else if(e.data===S.BUFFERING){spinShow();csbOff();}
        else if(e.data===S.ENDED){playing=false;spinHide();setPP(false);stopProg();showCtrl();endOv.classList.add('show');csbOff();}
      },
      onPlaybackQualityChange:function(){if(currentQuality==='auto'){var o=qMenu.querySelectorAll('.pop-opt');for(var i=0;i<o.length;i++)o[i].classList.toggle('active',o[i].dataset.q==='auto');}},
      onError:function(e){
        spinHide();csbOff();
        if((e.data===150||e.data===151||e.data===153||e.data===163)&&!retried&&controlsLevel===0){retried=true;controlsLevel=1;vi.classList.add('c1');if(player){player.destroy();player=null;}var d=document.createElement('div');d.id=mountId;vi.insertBefore(d,vi.firstChild);makePlayer();return;}
        var m={2:'Invalid video ID.',5:'HTML5 player error.',100:'Video is private or deleted.',101:'Owner disabled external playback.',150:'Owner disabled external playback.',153:'Owner disabled external playback.',163:'Owner disabled external playback.'};
        errTitle.textContent='Cannot play video';errDesc.textContent=m[e.data]||'Error code: '+e.data;errOv.classList.add('show');cb.classList.add('hide');
      }
    }
  });
}
function togglePlay(){if(!player)return;playing?player.pauseVideo():player.playVideo();}
function setPP(p){ppIco.innerHTML=p?IPAUSE:IPLAY;}
function startProg(){stopProg();progT=setInterval(tick,400);}
function stopProg(){clearInterval(progT);progT=null;}
function tick(){
  if(!vc.isConnected){stopProg();try{if(player)player.destroy();}catch(e){}player=null;return;}
  if(!player||!player.getDuration)return;var c=player.getCurrentTime()||0,d=player.getDuration()||0;if(!d)return;var p=(c/d)*100;pf.style.width=p+'%';pth.style.left=p+'%';pbf.style.width=(player.getVideoLoadedFraction()*100)+'%';tdEl.textContent=fmt(c)+' / '+fmt(d);
}
function fmt(s){if(!s||isNaN(s))return'0:00';var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=String(Math.floor(s%60)).padStart(2,'0');return h?(h+':'+String(m).padStart(2,'0')+':'+ss):(m+':'+ss);}
function seekAt(e){if(!player)return;var r=pb.getBoundingClientRect(),cx=e.touches?e.touches[0].clientX:e.clientX,p=Math.max(0,Math.min(1,(cx-r.left)/r.width)),d=player.getDuration();if(!d)return;player.seekTo(p*d,true);pf.style.width=(p*100)+'%';pth.style.left=(p*100)+'%';}
pb.addEventListener('mousedown',function(e){dragging=true;seekAt(e);});
pb.addEventListener('touchstart',function(e){dragging=true;seekAt(e);},{passive:true});
DL('mousemove',function(e){if(dragging)seekAt(e);});
DL('mouseup',function(){dragging=false;});
DL('touchmove',function(e){if(dragging)seekAt(e);},{passive:true});
DL('touchend',function(){dragging=false;});
function syncVol(){if(!player)return;var v=player.getVolume(),m=player.isMuted();setVolIcon(m?0:v);setVolFill(m?0:v);volSld.value=m?0:v;}
function setVolIcon(v){var b='<polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/>';if(v<=0)volIco.innerHTML=b+'<line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>';else if(v<50)volIco.innerHTML=b+'<path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none"/>';else volIco.innerHTML=b+'<path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" fill="none"/>';}
mutBtn.addEventListener('click',function(e){e.stopPropagation();if(!player)return;player.isMuted()?player.unMute():player.mute();setTimeout(syncVol,50);showCtrl();});
volSld.addEventListener('input',function(e){e.stopPropagation();if(!player)return;var v=+e.target.value;player.setVolume(v);v===0?player.mute():player.unMute();setVolIcon(v);setVolFill(v);showCtrl();});
function buildQMenu(){if(!player)return;var lv=player.getAvailableQualityLevels();if(!lv||!lv.length)return;qMenu.innerHTML='';var ao=document.createElement('button');ao.className='pop-opt'+(currentQuality==='auto'?' active':'');ao.dataset.q='auto';ao.textContent='Auto';ao.addEventListener('click',function(e){e.stopPropagation();setQuality('auto');qMenu.classList.remove('open');showCtrl();});qMenu.appendChild(ao);for(var i=0;i<lv.length;i++){var q=lv[i];if(q==='auto'||q==='unknown')continue;(function(qq){var o=document.createElement('button');o.className='pop-opt'+(currentQuality===qq?' active':'');o.dataset.q=qq;o.textContent=ql[qq]||qq;o.addEventListener('click',function(e){e.stopPropagation();setQuality(qq);qMenu.classList.remove('open');showCtrl();});qMenu.appendChild(o);})(q);}}
function setQuality(q){currentQuality=q;if(!player)return;player.setPlaybackQuality(q==='auto'?'default':q);qBtn.textContent=q==='auto'?'Auto':(ql[q]||q);var o=qMenu.querySelectorAll('.pop-opt');for(var i=0;i<o.length;i++)o[i].classList.toggle('active',o[i].dataset.q===q);}
qBtn.addEventListener('click',function(e){e.stopPropagation();qMenu.classList.toggle('open');spdMenu.classList.remove('open');showCtrl();});
spdBtn.addEventListener('click',function(e){e.stopPropagation();spdMenu.classList.toggle('open');qMenu.classList.remove('open');showCtrl();});
for(var _i=0;_i<spdOpts.length;_i++){spdOpts[_i].addEventListener('click',(function(b){return function(e){e.stopPropagation();var r=parseFloat(b.dataset.rate);if(player)player.setPlaybackRate(r);spdBtn.textContent=(r===1?'1':r)+'x';for(var j=0;j<spdOpts.length;j++)spdOpts[j].classList.toggle('active',spdOpts[j]===b);spdMenu.classList.remove('open');showCtrl();};})(spdOpts[_i]));}
DL('click',function(){spdMenu.classList.remove('open');qMenu.classList.remove('open');});
function showCtrl(){cb.classList.remove('hide');if(fsTitle)fsTitle.classList.remove('hide');clearTimeout(hideT);}
function hideCtrlSoon(){clearTimeout(hideT);hideT=setTimeout(function(){if(!dragging){cb.classList.add('hide');if(fsTitle)fsTitle.classList.add('hide');}},2800);}
vc.addEventListener('mousemove',function(){showCtrl();if(playing)hideCtrlSoon();});
vc.addEventListener('mouseleave',function(){if(playing&&!dragging)cb.classList.add('hide');});
function makeTap(el,fn,stopProp){var tapping=false,lastFire=0;el.addEventListener('touchstart',function(){tapping=true;},{passive:true});el.addEventListener('touchmove',function(){tapping=false;},{passive:true});el.addEventListener('touchend',function(e){if(!tapping)return;tapping=false;var now=Date.now();if(now-lastFire<200)return;lastFire=now;if(stopProp)e.stopPropagation();fn(e);},{passive:true});el.addEventListener('click',function(e){if('ontouchstart' in window)return;var now=Date.now();if(now-lastFire<200)return;lastFire=now;if(stopProp)e.stopPropagation();fn(e);});}
vc.addEventListener('touchstart',function(){showCtrl();if(playing)hideCtrlSoon();if(inPseudoFs&&isPortrait())showRotHint();},{passive:true});
var lastTap=0;
makeTap(co,function(){var n=Date.now();if(n-lastTap<280){lastTap=0;toggleFs();return;}lastTap=n;togglePlay();showCtrl();},false);
makeTap(csb,function(){togglePlay();showCtrl();},true);
ppBtn.addEventListener('click',function(e){e.stopPropagation();togglePlay();showCtrl();});
rwBtn.addEventListener('click',function(e){e.stopPropagation();if(player){player.seekTo(Math.max(0,player.getCurrentTime()-10),true);tick();}showCtrl();});
fwBtn.addEventListener('click',function(e){e.stopPropagation();if(player){player.seekTo(player.getCurrentTime()+10,true);tick();}showCtrl();});
fsBtn.addEventListener('click',function(e){e.stopPropagation();toggleFs();});
replayBtn.addEventListener('click',function(){endOv.classList.remove('show');if(player){player.seekTo(0);player.playVideo();}});
function isPortrait(){return window.innerWidth<window.innerHeight;}
function showRotHint(){if(!isPortrait())return;rotHint.classList.add('show');clearTimeout(rotT);rotT=setTimeout(function(){rotHint.classList.remove('show');},5000);}
function hideRotHint(){rotHint.classList.remove('show');clearTimeout(rotT);}
WL('resize',function(){if(inPseudoFs&&!isPortrait())hideRotHint();});
function setFsIcon(on){fsIco.innerHTML=on?'<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>':'<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';}
var ytpWrap=document.getElementById('ytp-'+ID+'');
function setFsActive(on){ if(ytpWrap) ytpWrap.classList.toggle('fs-active', on); }
function enterPseudoFs(){inPseudoFs=true;vc.classList.add('pfs');document.body.classList.add('pfs-open');setFsIcon(true);setFsActive(true);showCtrl();if(isPortrait())setTimeout(showRotHint,600);}
function exitPseudoFs(){inPseudoFs=false;vc.classList.remove('pfs');document.body.classList.remove('pfs-open');setFsIcon(false);setFsActive(false);hideRotHint();}
function unlockOri(){try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(e){}}
function toggleFs(){var na=document.fullscreenElement||document.webkitFullscreenElement;if(na){unlockOri();hideRotHint();(document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen).call(document);return;}if(inPseudoFs){exitPseudoFs();return;}var rq=vc.requestFullscreen||vc.webkitRequestFullscreen||vc.mozRequestFullScreen;if(!rq){enterPseudoFs();return;}rq.call(vc).then(function(){setFsIcon(true);if(screen.orientation&&screen.orientation.lock){screen.orientation.lock('landscape').catch(function(){if(isPortrait())setTimeout(showRotHint,600);});}else{if(isPortrait())setTimeout(showRotHint,600);}}).catch(function(){enterPseudoFs();});}
function onFsChange(){var n=!!(document.fullscreenElement||document.webkitFullscreenElement);if(n&&document.fullscreenElement!==vc&&document.webkitFullscreenElement!==vc)return;if(!n){unlockOri();hideRotHint();if(inPseudoFs)exitPseudoFs();}setFsIcon(n||inPseudoFs);setFsActive(n||inPseudoFs);if(n)showCtrl();}
['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'].forEach(function(ev){DL(ev,onFsChange);});

document.getElementById('ytp-'+ID+'').addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(b&&b.type==='submit')e.preventDefault();},true);
ytApiReady(makePlayer);

return {destroy:function(){DEAD=true;try{stopProg();}catch(e){}[hideT,csbT,rotT,spinHideT].forEach(function(t){clearTimeout(t);});try{if(player)player.destroy();}catch(e){}player=null;offs.forEach(function(f){try{f();}catch(e){}});document.body.classList.remove('pfs-open');}};

  }
  function mountYouTube(el, c, o) {
    var ID = "p" + (++uid);
    var css = fill(YT_CSS + (o.compact ? YT_CSS_COMPACT : ""), ID);
    var html = fill(YT_HTML, ID).replace("__SHORT__", c.isShort ? ' class="is-short"' : "")
      .replace("__FSTITLE__", o.title ? fill(YT_FSTITLE, ID) : "");
    el.innerHTML = '<div id="ytp-' + ID + '" class="ytp-wrap"><style>' + css + "</style>" + html + "</div>";
    return ytInit(ID, { videoId: c.id, title: o.title || "", description: o.description || "", autoPlay: !!o.autoplay });
  }

  /* ---------- Native <video> (your native player) ---------- */
  function nvpInit(ID, OPTS) {

  var vid=document.getElementById('nvp-vid-'+ID+'');
  var co=document.getElementById('nvp-co-'+ID+'');
  var spin=document.getElementById('nvp-spin-'+ID+'');
  var cb=document.getElementById('nvp-cb-'+ID+'');
  var titleOv=document.getElementById('nvp-title-'+ID+'');
  var pp=document.getElementById('nvp-pp-'+ID+''),ppico=document.getElementById('nvp-ppico-'+ID+'');
  var pb=document.getElementById('nvp-pb-'+ID+''),pf=document.getElementById('nvp-pf-'+ID+''),pth=document.getElementById('nvp-pth-'+ID+'');
  var td=document.getElementById('nvp-td-'+ID+'');
  var vol=document.getElementById('nvp-vol-'+ID+'');
  var fsBtn=document.getElementById('nvp-fs-'+ID+'');
  var spdBtn=document.getElementById('nvp-spdbtn-'+ID+''),spdMenu=document.getElementById('nvp-spdmenu-'+ID+'');
  var IPLAY='<polygon points="5,3 19,12 5,21"/>',IPAUSE='<rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/>';
  var offs=[];function DL(t,f,o){document.addEventListener(t,f,o);offs.push(function(){document.removeEventListener(t,f,o);});}
  var hideT=null;
  var spinHideT=null;

  function fmt(s){if(!s||isNaN(s)||!isFinite(s))return'0:00';var m=Math.floor(s/60),ss=String(Math.floor(s%60)).padStart(2,'0');return m+':'+ss;}
  function showCtrl(){cb.classList.remove('hide');if(titleOv)titleOv.classList.remove('hide');clearTimeout(hideT);}
  function hideCtrlSoon(){clearTimeout(hideT);hideT=setTimeout(function(){if(!vid.paused){cb.classList.add('hide');if(titleOv)titleOv.classList.add('hide');}},2800);}
  function togglePlay(){vid.paused?vid.play():vid.pause();}

  co.addEventListener('click',function(){togglePlay();showCtrl();});
  vid.addEventListener('play',function(){ppico.innerHTML=IPAUSE;showCtrl();hideCtrlSoon();});
  vid.addEventListener('pause',function(){ppico.innerHTML=IPLAY;showCtrl();});
  // A short delay before hiding the spinner - waiting for the actual frame
  // to be visible rather than reacting the instant 'playing' fires, which
  // can arrive a beat before real pixels are on screen (was showing a
  // flash of the browser's own native buffering indicator underneath ours).
  vid.addEventListener('waiting',function(){clearTimeout(spinHideT);spin.classList.add('show');});
  vid.addEventListener('playing',function(){clearTimeout(spinHideT);spinHideT=setTimeout(function(){spin.classList.remove('show');},150);});

  var isDraggingThisPlayer = false;

    vid.addEventListener('loadedmetadata',function(){
    if (vid.duration && isFinite(vid.duration)) {
      td.textContent = fmt(vid.currentTime) + ' / ' + fmt(vid.duration);
    }
  });
  vid.addEventListener('seeked',function(){ spin.classList.remove('show'); });

  vid.addEventListener('timeupdate',function(){
    if(!vid.duration||!isFinite(vid.duration))return;
    if(isDraggingThisPlayer)return; // don't fight the user's own drag with a stale playback position
    var p=(vid.currentTime/vid.duration)*100;
    pf.style.width=p+'%';pth.style.left=p+'%';
    td.textContent=fmt(vid.currentTime)+' / '+fmt(vid.duration);
  });

  // Seeking is only meaningful once real metadata (a finite duration) has
  // loaded - fixes the bug where seeking on a freshly-expanded uploaded
  // video silently no-op'd back to the start, because vid.duration was
  // still NaN at that point.
  function seekAt(e){
    if(!vid.duration||!isFinite(vid.duration))return;
    var r=pb.getBoundingClientRect();
    var cx=e.touches?e.touches[0].clientX:e.clientX;
    var p=Math.max(0,Math.min(1,(cx-r.left)/r.width));
    vid.currentTime=p*vid.duration;
  }
  pb.addEventListener('mousedown',function(e){spin.classList.add('show');seekAt(e);});
  pb.addEventListener('touchstart',function(e){spin.classList.add('show');seekAt(e);},{passive:true});

  // IMPORTANT: document-level mousemove/mouseup listeners are attached
  // ONCE, globally, shared across every native video player instance on
  // the page - NOT per-instance. The previous version attached a fresh
  // pair of these on every single template mount (every expand/collapse
  // cycle via Alpine's x-if), and never removed them - a real, growing
  // listener leak that very likely explains the reported freeze after
  // interacting with several videos in one session.
  if (!window.__nvpDragState) {
    window.__nvpDragState = { active: null };
    document.addEventListener('mousemove', function(e) {
      if (window.__nvpDragState.active) window.__nvpDragState.active(e);
    });
    document.addEventListener('mouseup', function() {
      window.__nvpDragState.active = null;
    });
    document.addEventListener('touchmove', function(e) {
      if (window.__nvpDragState.active) window.__nvpDragState.active(e);
    }, {passive: true});
    document.addEventListener('touchend', function() {
      window.__nvpDragState.active = null;
    });
  }
  pb.addEventListener('mousedown', function() { isDraggingThisPlayer = true; window.__nvpDragState.active = seekAt; });
  pb.addEventListener('touchstart', function() { isDraggingThisPlayer = true; window.__nvpDragState.active = seekAt; }, {passive: true});

  DL('mouseup', function() { isDraggingThisPlayer = false; });
  DL('touchend', function() { isDraggingThisPlayer = false; });

  vol.addEventListener('input',function(){vid.volume=vol.value/100;});

  spdBtn.addEventListener('click',function(e){e.stopPropagation();spdMenu.classList.toggle('open');});
  var spdOpts=spdMenu.querySelectorAll('.nvp-pop-opt');
  spdOpts.forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var r=parseFloat(b.dataset.rate);
      vid.playbackRate=r;
      spdBtn.textContent=(r===1?'1':r)+'x';
      spdOpts.forEach(function(o){o.classList.toggle('active',o===b);});
      spdMenu.classList.remove('open');
    });
  });
  DL('click',function(){spdMenu.classList.remove('open');});

  fsBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var wrap=document.getElementById('nvp-'+ID+'');
    if(document.fullscreenElement){document.exitFullscreen();}
    else if(wrap.requestFullscreen){wrap.requestFullscreen();}
  });

  // Drives the title overlay's visibility via a JS class rather than
  // relying solely on CSS's :fullscreen pseudo-class matching - more
  // reliable, and this component previously had NO fullscreenchange
  // listener at all (fsBtn could only trigger fullscreen, never actually
  // confirm it happened or detect an Esc-key exit).
  function updateFsClass(){
    var wrap=document.getElementById('nvp-'+ID+'');
    if(!wrap)return;
    var isFs=document.fullscreenElement===wrap||document.webkitFullscreenElement===wrap;
    wrap.classList.toggle('fs-active',isFs);
    if(isFs)showCtrl();
  }
  DL('fullscreenchange',updateFsClass);
  DL('webkitfullscreenchange',updateFsClass);

  document.getElementById('nvp-'+ID+'').addEventListener('mousemove',function(){showCtrl();if(!vid.paused)hideCtrlSoon();});

  // Autoplay the moment this player is actually mounted (i.e. the moment
  // the person clicked the collapsed tile) - a single click should both
  // expand AND start playing, not require a second click on the internal
  // play button.
  if(OPTS.autoplay!==false){var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){});}

return {destroy:function(){try{vid.pause();vid.removeAttribute('src');vid.load();}catch(e){}clearTimeout(hideT);clearTimeout(spinHideT);offs.forEach(function(f){try{f();}catch(e){}});}};

  }
  function mountNative(el, c, o) {
    var ID = "p" + (++uid);
    var html = fill(NV_HTML, ID).replace("__SRC__", esc(c.url))
      .replace("__NTITLE__", o.title ? fill(NV_TITLE, ID).replace("__TITLETEXT__", esc(o.title)) : "");
    el.innerHTML = '<div id="nvp-' + ID + '" class="nvp-wrap"><style>' + fill(NV_CSS, ID) + "</style>" + html + "</div>";
    return nvpInit(ID, { autoplay: o.autoplay !== false });
  }

  /* ---------- Drive / Vimeo (embed player) ---------- */
  function mountEmbed(el, src, original) {
    el.innerHTML =
      '<div style="width:100%;position:relative;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 12px 48px rgba(0,0,0,.18)">' +
      '<div style="width:100%;aspect-ratio:16/9;background:#000"><iframe src="' + esc(src) + '" style="width:100%;height:100%;border:none;display:block" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>' +
      '<div style="background:rgba(127,127,127,.14);padding:8px 12px;font-size:12px;opacity:.85">Trouble viewing this? ' +
      '<a href="' + esc(original) + '" target="_blank" rel="noopener noreferrer" style="font-weight:600;color:#3b82f6;text-decoration:none">Click here to open directly \u2192</a></div></div>';
    return { destroy: function () {} };
  }
  function mountExternal(el, url) {
    el.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 18px;border-radius:12px;background:#3b82f6;color:#fff;font-weight:700;text-decoration:none;font-size:14px">Watch externally \u2192</a>';
    return { destroy: function () {} };
  }

  /* ---------- what kind of link is this? ---------- */
  function classify(url) {
    url = String(url || "").trim();
    var m;
    if (/(youtube\.com|youtube-nocookie\.com|youtu\.be)/i.test(url)) {
      m = url.match(/youtu\.be\/([\w-]{11})/) || url.match(/[?&]v=([\w-]{11})/) || url.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return { type: "youtube", id: m[1], isShort: /\/shorts\//.test(url), url: url };
      return { type: "external", url: url };
    }
    m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || (/drive\.google\.com/.test(url) && url.match(/[?&]id=([\w-]+)/));
    if (m) return { type: "drive", embed: "https://drive.google.com/file/d/" + m[1] + "/preview", url: url };
    if (/vimeo\.com/i.test(url)) {
      m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\w]+))?/);
      if (m) {
        var h = (url.match(/[?&]h=([\w]+)/) || [])[1] || m[2];
        return { type: "vimeo", embed: "https://player.vimeo.com/video/" + m[1] + (h ? "?h=" + h : ""), url: url };
      }
    }
    if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url)) return { type: "direct", url: url };
    return { type: "external", url: url };
  }

  function destroy(el) {
    var h = mounted.get(el);
    if (h && h.destroy) { try { h.destroy(); } catch (e) {} }
    mounted.delete(el);
    if (el) el.innerHTML = "";
  }
  function mount(el, url, opts) {
    opts = opts || {};
    destroy(el);
    var c = classify(url), h;
    if (c.type === "youtube") h = mountYouTube(el, c, opts);
    else if (c.type === "drive" || c.type === "vimeo") h = mountEmbed(el, c.embed, c.url);
    else if (c.type === "direct") h = mountNative(el, c, opts);
    else h = mountExternal(el, c.url);
    mounted.set(el, h);
    return h;
  }

  window.DSVBPlayer = { mount: mount, destroy: destroy, classify: classify };
})();
