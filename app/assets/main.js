/* 校门口烤肠摊 — 经典脚本，ES2017，无外部依赖 */
(function () {
'use strict';

/* ============ 配置 ============ */
var PRICE1 = 3, PRICE2 = 5, COST = 1;
var SAUCE_COL = {'番茄':'#D8342A','蜂蜜芥末':'#E7C43A','甜辣':'#F06A2B'};
var SPICE_COL = {'孜然':'#8A6A3A','葱花':'#4FA83D','辣椒':'#C0180C'};
var LEVELS = [
  {name:'教学关·开张大吉', time:90, goal:{money:10}, slots:3, pat:75, spawn:[8,11], bands:['嫩'], sauces:['番茄'], spices:[], two:.15, runner:0, feat:[], tutorial:true,
   news:['王姐手把手教你摆摊','赚到 $10 就能收摊！']},
  {name:'油锅要伺候', time:90, goal:{money:10}, slots:3, pat:60, spawn:[7,10], bands:['嫩','脆'], bandW:[.55,.45], sauces:['番茄'], spices:['孜然'], two:.2, runner:0, feat:['oil'],
   news:['新口感「脆」：两面过第二条刻度','油低于红线会粘锅，记得加油','新小料：孜然']},
  {name:'口味多起来', time:90, goal:{money:18}, slots:3, pat:65, spawn:[6,9], bands:['嫩','脆'], bandW:[.4,.6], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:0, feat:['oil'],
   news:['新酱料：芥末酱','新小料：辣椒']},
  {name:'攒人气', time:90, goal:{hearts:9}, slots:3, pat:51, spawn:[5.5,8], bands:['嫩','脆'], bandW:[.4,.6], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:0, feat:['oil'],
   news:['做对又够快，就能拿爱心']},
  {name:'有人逃单！', time:120, goal:{money:20}, slots:3, pat:47, spawn:[5.2,7.8], bands:['嫩','脆'], bandW:[.4,.6], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:.18, feat:['oil'],
   news:['没听到「叮咚」就是逃单','趁他没走远，点他喊站住！','喊错了扣爱心']},
  {name:'微焦党来了', time:120, goal:{money:30}, slots:4, pat:45, spawn:[4.8,7.2], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.35, runner:.2, bandRule:{band:'微焦', within:3, max:.2}, feat:['oil'],
   news:['新口感「微焦」：过第三条刻度','锅位变成 4 个']},
  {name:'自己串签', time:120, goal:{hearts:12}, slots:4, pat:43, spawn:[4.6,7], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.5, runner:.3, bandRule:{band:'微焦', within:0, max:.25}, feat:['oil','skewer'],
   news:['要自己串签了']},
  {name:'放学高峰', time:150, goal:{money:30}, slots:4, pat:40, spawn:[3.8,5.8], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.45, runner:.32, feat:['oil','skewer'],
   news:['放学高峰：客人又多又急']},
  {name:'锅底要铲', time:150, goal:{money:40}, slots:4, pat:39, spawn:[4,6], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.4, runner:.35, feat:['oil','skewer','scrape'],
   news:['锅会结锅巴，铲掉才能用','新酱料：甜辣酱']},
  {name:'校门口之王', time:180, goal:{money:50,hearts:12}, slots:4, pat:39, spawn:[3.5,5.6], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.45, runner:.38, feat:['oil','skewer','scrape'],
   news:['最终关：钱和爱心都要达标']},
  {name:'无尽模式', endless:true, time:0, goal:{}, slots:4, pat:44, spawn:[5,7.5], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.35, runner:.25, feat:['oil'],
   news:['不限时，客人越来越多','做错、跑单都扣口碑','扣光就收摊']}
];
var ENDLESS = 10, ENDLESS_HEARTS = 5, START_HEARTS = 3;   // 开局爱心；扣到 0 当场收摊
var MAXQ = 3;
// 粘锅手感（测试版）：true = 油少时翻面要多点几下、烤得更快、有焦斑；false = 旧版手感
var STICKY_V2 = true;
var OIL_STICKY = STICKY_V2 ? 30 : 25, OIL_DRY = 10;
function oilState() {
  if (!has('oil')) return 0;
  if (STICKY_V2 && R.oil < OIL_DRY) return 2;      // 干锅
  return R.oil < OIL_STICKY ? 1 : 0;              // 粘锅
}
var PAT_SCALE = 1.25;   // 全局顾客耐心倍数：嫌客人太急就调大
var UPGRADES = [
  {id:'boxc', name:'第三个打包盒', desc:'多一个盒子', cost:[40], max:1},
  {id:'fire', name:'可调火力烤肠锅', desc:'火力可调小中大', cost:[35], max:1},
  {id:'nonstick', name:'不粘锅涂层', desc:'耗油慢 40%', cost:[25], max:1},
  {id:'horn', name:'吆喝小喇叭', desc:'客人耐心 +25%', cost:[30], max:1},
  {id:'smart', name:'智能番茄涂抹机', desc:'点盒里的烤肠，自动按要求涂番茄酱', cost:[30], max:1},
  {id:'spicer', name:'智能撒料机', desc:'点盒里的烤肠，自动按要求撒孜然、辣椒', cost:[50], max:1},
  {id:'cam', name:'门口监控', desc:'会提示逃单的人', cost:[40], max:1}
];
// 第三项是内设性格，不在界面上显示：easy 随和（做错少收 $1），picky 挑剔（做错少收 $2）
// 一次性道具：花钱买，每局都能用，用掉就没了
var ITEMS = [
  {id:'candy', icon:'🍭', name:'棒棒糖', desc:'页面上所有客人耐心回满', short:'耐心回满', cost:5},
  {id:'hourglass', icon:'⏳', name:'沙漏', desc:'本关 +30 秒', short:'时间 +30 秒', cost:5},
  {id:'flower', icon:'🙋', name:'烤肠课代表', bar:'课代表', desc:'瞬间做完所有单', short:'瞬间做完所有单', cost:20}
];
var PEOPLE = [['🧒','一年级·豆豆','easy'],['👦','三年级·小胖','easy'],['👧','二年级·朵朵','easy'],['🧑‍🎓','六年级·学霸','picky'],['👦','四年级·皮皮','easy'],['👧','五年级·班长','picky'],['👩','家长·王阿姨','picky'],['👨','家长·李叔叔','easy'],['🧔','体育老师','picky'],['👵','接孙子的奶奶','easy']];
var PENALTY = {easy:1, picky:2};

/* ============ 存档 ============ */
var G = {cleared:0, bank:0, up:{boxb:0,boxc:0,smart:0,spicer:0,fire:0,slot:0,nonstick:0,horn:0,cam:0}, items:{flower:0,candy:0,hourglass:0}};
try { var sv = JSON.parse(localStorage.getItem('sausage-stall') || 'null'); if (sv && sv.up) { var up0 = G.up, items0 = G.items; G = Object.assign(G, sv); G.up = Object.assign(up0, sv.up); G.items = Object.assign(items0, sv.items || {}); } } catch (e) {}
// 大号烤肠锅已下架：买过的把钱退回存款
if (G.up.slot > 0) { G.bank += [0, 20, 60][Math.min(2, G.up.slot)]; G.up.slot = 0; try { localStorage.setItem('sausage-stall', JSON.stringify(G)); } catch (e) {} }
// 测试用：网址带 #unlock 打开时解锁全部关卡（含无尽模式）；小红书里没有地址栏，玩家碰不到
// 测试用：网址带 #resetitems 打开时，升级和道具全部清零（关卡进度和存款保留）
if (location.hash.indexOf('resetitems') >= 0) {
  Object.keys(G.up).forEach(function (k) { G.up[k] = 0; });
  Object.keys(G.items).forEach(function (k) { G.items[k] = 0; });
  try { localStorage.setItem('sausage-stall', JSON.stringify(G)); } catch (e) {}
}
if (location.hash === '#unlock') { G.cleared = Math.max(G.cleared || 0, 10); try { localStorage.setItem('sausage-stall', JSON.stringify(G)); } catch (e) {} }
function save() { try { localStorage.setItem('sausage-stall', JSON.stringify(G)); } catch (e) {} }

/* ============ 工具 ============ */
function $(id) { return document.getElementById(id); }
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function has(f) { return !!R && R.L.feat.indexOf(f) >= 0; }
function setHTML(id, html) { var el = $(id); if (el._h !== html) { el._h = html; el.innerHTML = html; } }
function mix(c1, c2, t) {
  var a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  var r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
  var g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
  var bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return 'rgb(' + r + ',' + g + ',' + bl + ')';
}
var STOPS = [[0,'#E9A3A0'],[40,'#DE7556'],[70,'#C0502E'],[88,'#8A3B1C'],[100,'#4A2213'],[130,'#141010']];
function col(v) {
  v = Math.max(0, Math.min(130, v));
  for (var i = 1; i < STOPS.length; i++) {
    if (v <= STOPS[i][0]) return mix(STOPS[i-1][1], STOPS[i][1], (v - STOPS[i-1][0]) / (STOPS[i][0] - STOPS[i-1][0]));
  }
  return '#141010';
}
function judge(s) {
  var lo = Math.min(s.a, s.b), hi = Math.max(s.a, s.b), avg = (s.a + s.b) / 2;
  if (hi > 100) return 'burnt';
  if (lo < 40) return 'raw';
  if (hi - lo > 30) return 'uneven';
  return avg < 70 ? '嫩' : avg < 88 ? '脆' : '微焦';
}
var JUDGE_TEXT = {raw:'生', uneven:'阴阳面', burnt:'焦', '嫩':'嫩', '脆':'脆', '微焦':'微焦'};
var BAND_VAL = {'嫩':62, '脆':80, '微焦':94, raw:22, uneven:56, burnt:116};
var SHORT = {'番茄':'番茄酱', '蜂蜜芥末':'芥末酱', '甜辣':'甜辣酱'};
function fmtT(t) { var s = Math.floor(t); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function goalText(g) { var a = []; if (g.money != null) a.push('净赚 $' + g.money); if (g.hearts != null) a.push(g.hearts + ' 颗爱心'); return a.join(' + '); }

var audio = null;
var SFX_VOL = .4;   // 音效音量（原 .12，被背景音乐盖住）
var sfxOut = null;   // 音效总线：过一个压缩器，响度更大又不破音
function ding(freq, dur, vol, type, delay) {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    audio = audio || new AC();
    if (!sfxOut) {
      sfxOut = audio.createDynamicsCompressor ? audio.createDynamicsCompressor() : audio.createGain();
      if (sfxOut.threshold) { sfxOut.threshold.value = -18; sfxOut.knee.value = 6; sfxOut.ratio.value = 6; sfxOut.attack.value = .002; sfxOut.release.value = .15; }
      sfxOut.connect(audio.destination);
    }
    var t0 = audio.currentTime + (delay || 0);
    var o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; o.type = type || 'triangle';
    g.gain.setValueAtTime(0, audio.currentTime);
    g.gain.setValueAtTime((vol || SFX_VOL) * sfxVol(), t0);
    g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
    o.connect(g); g.connect(sfxOut); o.start(t0); o.stop(t0 + dur + .02);
  } catch (e) {}
}
// 收款到账音：像收款音箱那样亮亮的「叮—咚」，方波 + 三角波叠在一起，所有关卡都用最大音量
function payChime() {
  ding(1318, .16, 1, 'triangle'); ding(1318, .12, .35, 'square');
  ding(1760, .32, 1, 'triangle', .12); ding(1760, .22, .35, 'square', .12);
  ding(2637, .25, .25, 'sine', .12);
}
function log(text, kind) {
  var el = document.createElement('span'); el.className = 'm ' + (kind || ''); el.textContent = text;
  var L = $('log'); L.insertBefore(el, L.firstChild);
  while (L.children.length > 3) L.removeChild(L.lastChild);
}

/* ============ 背景音乐（WebAudio 解码 bgm-data.js 里的 mp3，首次触摸后才能播放） ============ */
var bgmBuf = null, bgmSrc = null, bgmLoading = false, bgmGain = null;
function musicVol() { var v = G.vol && G.vol.m != null ? G.vol.m : 100; return v / 100; }
function sfxVol() { if (G.sfx === false) return 0; var v = G.vol && G.vol.s != null ? G.vol.s : 100; return v / 100; }
function setVol(k, v) {
  G.vol = G.vol || {m:100, s:100}; G.vol[k] = v; save();
  if (k === 'm' && bgmGain) bgmGain.gain.value = .2 * musicVol();
}
var BUILD_V = (function () { var m = document.querySelector('script[src*="main.js"]'); m = m && /v=([^&]+)/.exec(m.getAttribute('src')); return m ? m[1] : '1'; })();
function musicOn() { return G.music !== false; }
function audioCtx() {
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  audio = audio || new AC(); return audio;
}
// 手机浏览器要求「用户点过屏幕」才能出声：音乐开着但没在播时，每次点屏幕都再试一次；顺便唤醒音效
function kickAudio() {
  try { if (audio && audio.state === 'suspended') audio.resume(); } catch (e) {}
  if (musicOn() && !document.hidden && !bgmSrc) syncMusic();
}
['pointerup', 'touchend', 'click'].forEach(function (ev) { document.addEventListener(ev, kickAudio, true); });
// 音乐数据约 1MB，不放在首屏：第一次要播放时才插入 bgm-data.js，加载完再解码
var bgmScript = null;
function loadBgm(ctx) {
  if (bgmLoading) return;
  if (!window.BGM_MP3_B64) {
    if (!bgmScript) {
      bgmScript = document.createElement('script');
      bgmScript.src = './assets/bgm-data.js?v=' + BUILD_V;
      bgmScript.onload = function () { syncMusic(); };
      bgmScript.onerror = function () { bgmScript = null; };
      document.body.appendChild(bgmScript);
    }
    return;
  }
  bgmLoading = true;
  try {
    var bin = atob(window.BGM_MP3_B64), buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    var done = function (b) { bgmBuf = b; bgmLoading = false; syncMusic(); };
    var fail = function () { bgmLoading = false; };
    var pr = ctx.decodeAudioData(buf.buffer, done, fail);
    if (pr && pr.catch) pr.catch(fail);
  } catch (e) { bgmLoading = false; }
}
function syncMusic() {
  var ctx = audioCtx(); if (!ctx) return;
  if (musicOn() && !document.hidden) {
    try {
      if (ctx.state === 'suspended') ctx.resume();
      if (!bgmBuf) { loadBgm(ctx); return; }
      if (bgmSrc) return;
      var g = ctx.createGain(); g.gain.value = .2 * musicVol(); g.connect(ctx.destination); bgmGain = g;
      bgmSrc = ctx.createBufferSource(); bgmSrc.buffer = bgmBuf; bgmSrc.loop = true;
      bgmSrc.connect(g); bgmSrc.start(0);
    } catch (e) {}
  } else if (bgmSrc) {
    try { bgmSrc.stop(0); bgmSrc.disconnect(); } catch (e) {}
    bgmSrc = null;
  }
}

/* ============ 教学关脚本 ============ */
var TUT = [
  {text:'快放学啦！我是王姐，跟我学卖烤肠～', btn:'好嘞', hand:'[data-act=tutnext]'},
  {text:'点空锅位，放一根肠（$1）。', spot:'place0', wait:'place', hand:'[data-act=place][data-i="0"]'},
  {text:'朝下那面在烤，进度条变绿就熟了……', spot:'slot0',
   until:function () { var s = R.slots[0].s; return s && s[s.down] >= 42; }},
  {text:'熟了！点烤肠翻个面。', spot:'flip0', wait:'flip', hand:'[data-act=flip][data-i="0"]'},
  {text:'等这面也变绿，烤到头会焦哦。', spot:'slot0',
   until:function () { var s = R.slots[0].s; return s && judge(s) === '嫩'; }},
  {text:'嫩嫩的了！看看各种火候：', btn:'懂了', hand:'[data-act=tutnext]', freeze:true, extra:lessonHTML},
  {text:'按住烤肠，拖进打包盒。', spot:'pick0', wait:'pick', drag:['[data-act=flip][data-i="0"]', '[data-box="0"]']},
  {text:'客人来了！他要一根「嫩」的，加番茄酱。', spot:'t1', btn:'看懂了', hand:'[data-act=tutnext]', enter:function () { spawnScripted(); }},
  {text:'把番茄酱拖到盒里的烤肠上。', spot:'tool-番茄 item00', wait:'topping', drag:['[data-tool="sauce"]', '[data-item="0-0"]']},
  {text:'点「装盒」盖上盒子。', spot:'pack0', wait:'pack', hand:'[data-act=pack][data-i="0"]'},
  {text:'把盒子拖给豆豆！', spot:'bag0 t1', wait:'serve', drag:['[data-bag="0"]', '[data-tag="t1"]']},
  {text:'听到「叮咚」才是付了钱，小心有人逃单！', spot:'speaker', btn:'懂了', hand:'[data-act=tutnext]',
   until:function () { return R.pay.length > 0; }, untilShowsBtn:true},
  {text:'王阿姨要两根：一根「嫩」不加酱，一根「脆」加番茄酱，装一盒。', spot:'t2', btn:'看懂了', hand:'[data-act=tutnext]', enter:function () { spawnScripted2(); }},
  {text:'放两根。一根「嫩」就拖进盒；另一根烤到两面变黄（「脆」）再拖。记得翻面！', free:{place:1, flip:1, pick:1}, handFn:cookHand, twoBands:true,
   until:function () { return boxHas('嫩') && boxHas('脆'); }},
  {text:'只给「脆」的那根加番茄酱。', spot:'tool-番茄 crisp', wait:'topping', crispSauce:true,
   dragFn:function () { return ['[data-tool="sauce"]', '[data-item="0-' + bandIndex('脆') + '"]']; },
   until:function () { var it = R.boxes[0].items; return it.length === 2 && it[bandIndex('脆')].sauce === '番茄' && !it[bandIndex('嫩')].sauce; }},
  {text:'全对！点「装盒」。', spot:'pack0', wait:'pack', hand:'[data-act=pack][data-i="0"]'},
  {text:'拖给王阿姨！', spot:'bag0 t2', wait:'serve', drag:['[data-bag="0"]', '[data-tag="t2"]']},
  {text:'做得好！根数、火候、酱、小料全对，客人耐心还剩三分之一以上，就能拿爱心。', btn:'记住了', hand:'[data-act=tutnext]'},
  {text:'做错会少给钱、扣爱心，爱心扣光就收摊。', btn:'知道了', hand:'[data-act=tutnext]'},
  {text:'忙不过来就关火。点旋钮关火。', spot:'fire', wait:'fire', hand:'[data-act=fire]'},
  {text:'再点旋钮点火，要预热一会儿才能烤。摊子交给你了！', btn:'开始营业', hand:'[data-act=tutnext]'}
];
// 火候小课堂：四根示意烤肠，各带「上 / 下」两条进度条
function lessonHTML() {
  var rows = [
    {a:55, b:60, tag:'嫩', note:'两面都过第 1 条刻度'},
    {a:78, b:80, tag:'脆', note:'两面都过第 2 条刻度'},
    {a:93, b:94, tag:'微焦', note:'过第 3 条，到头就焦了'},
    {a:95, b:45, tag:'阴阳面', note:'一面烤太久，两面差太多', bad:true}
  ];
  return '<div class="lesson">' + rows.map(function (r) {
    function m(v) {
      return '<div class="meter"><i style="width:' + Math.min(100, v) + '%;background:' + zoneCol(v) + '"></i>' +
        [40, 70, 88].map(function (x) { return '<span class="tk" style="left:' + x + '%"></span>'; }).join('') + '</div>';
    }
    return '<div class="lrow' + (r.bad ? ' bad' : '') + '">' +
      '<div class="lsaus" style="background:linear-gradient(180deg,' + col(r.a) + ' 0,' + col(r.a) + ' 50%,' + col(r.b) + ' 50%,' + col(r.b) + ' 100%)"></div>' +
      '<div class="lm">' + m(r.a) + m(r.b) + '</div>' +
      '<div class="lt"><b>' + r.tag + '</b><span>' + r.note + '</span></div></div>';
  }).join('') + '</div>';
}
function boxHas(band) { return R.boxes[0].items.some(function (t) { return t.band === band; }); }
function bandIndex(band) { var it = R.boxes[0].items; for (var i = 0; i < it.length; i++) if (it[i].band === band) return i; return 0; }
var LIMIT = {'嫩':70, '脆':88};
// 教学「烤两根」这一步：手指跟着下一步该做的动作走（夹缺的火候、两面差多了就翻、还差肠就下锅）
function cookHand() {
  var i, sl, need = ['嫩', '脆'].filter(function (b) { return !boxHas(b); }), useful = 0;
  for (i = 0; i < R.slots.length; i++) {
    sl = R.slots[i]; if (!sl.s) continue;
    var s = sl.s, up = s.down === 'a' ? 'b' : 'a', j = judge(s), avg = (s.a + s.b) / 2;
    if (need.indexOf(j) >= 0) return '[data-act=flip][data-i="' + i + '"]';   // 该夹了：手指指着这根，提示拖进盒子
    if (need.some(function (b) { return avg < LIMIT[b]; })) useful++;
    if (s[s.down] - s[up] > 22) return '[data-act=flip][data-i="' + i + '"]';
  }
  if (useful < need.length) {
    for (i = 0; i < R.slots.length; i++) if (!R.slots[i].s && !R.slots[i].dirt) return '[data-act=place][data-i="' + i + '"]';
  }
  return null;
}
var SHOP_TUT = [
  {text:'存款能买道具，救急用！', btn:'说说看', hand:'[data-act=tutnext]'},
  {text:'🍭 耐心回满<br>⏳ 多加 30 秒<br>🙋 瞬间做完所有单', btn:'然后呢', hand:'[data-act=tutnext]'},
  {text:'点击道具购买，再点一下使用道具。', btn:'开始营业', hand:'[data-act=tutnext]'}
];
// 第二关第一次开张：王姐教加油、撒孜然
var OIL_TUT = [
  {text:'今天开始要放油，锅上这条是油量。', btn:'然后呢', hand:'.oilgauge', freeze:true},
  {text:'油低于红线会粘锅，容易焦、难翻面。', btn:'那怎么办', hand:'.oilgauge', freeze:true},
  {text:'点油瓶加油，太满会溢出亏 $1。', btn:'记住了', hand:'[data-act=oil]', freeze:true},
  {text:'新小料孜然：拖到盒里的烤肠上就行。', btn:'开始营业', hand:'[data-tool=spice]', freeze:true}
];
var SKEWER_TUT = [
  {text:'串好的肠用完了，得自己串签！', btn:'怎么串', hand:'[data-act=tutnext]'},
  {text:'点竹签筒串一根，先串两根。', hand:'[data-act=skewer]', free:{skewer:1}, until:function () { return R.stock >= 2; }},
  {text:'串好了！点空锅位放上去。', hand:'[data-act=place][data-i="0"]', wait:'place', free:{skewer:1}},
  {text:'闲的时候多串几根备着！', btn:'开始营业', hand:'[data-act=tutnext]', freeze:true, free:{skewer:1}}
];
var SKEWER_MAX = 4;   // 串好的肠最多备几根
var SCRAPE_TUT = [
  {text:'锅用久了会结锅巴。', btn:'那怎么办', hand:'[data-act=tutnext]'},
  {text:'有锅巴就放不了肠。连点 3 下或来回拖，铲干净！', spot:'scrape0', drag:['[data-rub="0"] .g7', '[data-rub="0"] .g6'], wait:'scrape',
   enter:function () { R.slots[0].s = null; R.slots[0].dirt = true; R.slots[0].scrub = 0; }},
  {text:'铲干净了！这关还多了甜辣酱。', btn:'开始营业', hand:'[data-act=tutnext]', freeze:true}
];
function tutStep() { return R && R.tut ? R.tut.steps[R.tut.i] : null; }
function tutGo(i) {
  if (!R.tut) return;
  R.tut.i = i;
  var st = R.tut.steps[i];
  if (!st) { tutEnd(); return; }
  if (st.enter) st.enter();
  clearGuide();
  render(); fit();
  setTimeout(function () { if (tutStep() === st) startGuide(st); }, 60);
}
function tutEnd() {
  clearDemo();
  R.fire = true;
  R.tut = null; R.spawnT = 2.5;
  $('coach').hidden = true;
  log('开始营业！', 'good');
  render(); fit();
}
function tutEvent(name) {
  var st = tutStep();
  if (st && st.wait === name && !st.until) tutGo(R.tut.i + 1);
}
function tutAllows(name) {
  var st = tutStep();
  return !st || st.wait === name;
}
function spot(key) {
  var st = tutStep();
  return st && st.spot && st.spot.split(' ').indexOf(key) >= 0 ? ' spot' : '';
}
var guideEl = null, guideTimer = null;
function clearGuide() {
  if (guideTimer) { clearInterval(guideTimer); guideTimer = null; }
  if (guideEl && guideEl.parentNode) guideEl.parentNode.removeChild(guideEl);
  guideEl = null;
}
function pageRect(sel) {
  var el = document.querySelector(sel); if (!el) return null;
  var r = el.getBoundingClientRect(); if (!r.width) return null;
  return {x:r.left + r.width / 2 + window.pageXOffset, y:r.top + r.height / 2 + window.pageYOffset};
}
function startGuide(st) {
  clearGuide();
  if (!st.hand && !st.handFn && !st.drag && !st.dragFn) return;
  guideEl = document.createElement('div');
  guideEl.className = 'guide ' + (st.drag || st.dragFn ? 'drag' : 'tap');
  guideEl.innerHTML = '<i class="ring"></i><i class="ring r2"></i><img class="hand" alt="" src="./assets/img/scene/g_hand_tap.webp?v=' + BUILD_V + '">';
  document.body.appendChild(guideEl);
  if (st.hand || st.handFn) {
    // 点击引导：手指在目标上反复按下，光圈扩散；目标没出现时先隐藏
    var place = function () {
      var sel = st.handFn ? st.handFn() : st.hand, p = sel && pageRect(sel);
      if (!p) { guideEl.style.opacity = '0'; return; }
      guideEl.style.opacity = ''; guideEl.style.left = p.x + 'px'; guideEl.style.top = p.y + 'px';
    };
    place(); guideTimer = setInterval(place, 250);
  } else {
    // 拖拽引导：手指从起点滑到终点
    var once = function () {
      var dr = st.dragFn ? st.dragFn() : st.drag, a = pageRect(dr[0]), b = pageRect(dr[1]); if (!a || !b) return;
      if (guideEl.animate) {
        guideEl.animate([
          {left:a.x + 'px', top:a.y + 'px', opacity:0},
          {left:a.x + 'px', top:a.y + 'px', opacity:1, offset:.15},
          {left:b.x + 'px', top:b.y + 'px', opacity:1, offset:.75},
          {left:b.x + 'px', top:b.y + 'px', opacity:0}
        ], {duration:1600, easing:'ease-in-out', fill:'forwards'});
      } else { guideEl.style.left = b.x + 'px'; guideEl.style.top = b.y + 'px'; }
    };
    once(); guideTimer = setInterval(once, 1800);
  }
}
function nudge() {
  var c = $('coach'); c.classList.remove('nudge'); void c.offsetWidth; c.classList.add('nudge');
  if (guideEl) { guideEl.classList.remove('big'); void guideEl.offsetWidth; guideEl.classList.add('big'); }
}
var clearDemo = clearGuide;

/* ============ 一局 ============ */
var R = null, nextId = 1;
function startLevel(i, demo) {
  if (!demo) hideMap();
  var L = LEVELS[i];
  var n = L.slots, slots = [];
  for (var k = 0; k < n; k++) slots.push({s:null, dirt:false, count:0});
  R = {i:i, L:L, t:0, net:0, hearts:0, oil:100, stock: L.feat.indexOf('skewer') >= 0 ? 0 : Infinity,
       boxes:[mkBox(), mkBox(), mkBox()], sel:0, fire:true, heat:1, cust:[], spawnT:1.2, over:false, paused:false, slots:slots, pay:[],
       st:{sold:0, angry:0, fled:0, caught:0, wrong:0, wasted:0, bad:0},
       tut: L.tutorial ? {i:0, steps:TUT, label:'教学'} : null};
  // 第二关第一次开张：王姐介绍道具商店
  G.seen = G.seen || {};
  if (i === 1 && !demo && !G.seen.oilTut) {
    R.tut = {i:0, steps:OIL_TUT.concat(G.seen.itemShop ? [] : SHOP_TUT), label:'王姐小课堂'}; G.seen.oilTut = 1; G.seen.itemShop = 1; save();
  } else if (i === 1 && !demo && !G.seen.itemShop) { R.tut = {i:0, steps:SHOP_TUT, label:'王姐小课堂'}; G.seen.itemShop = 1; save(); }
  // 第七关第一次开张：王姐教串签
  if (i === 8 && !demo && !G.seen.scrape) { R.tut = {i:0, steps:SCRAPE_TUT, label:'王姐小课堂'}; G.seen.scrape = 1; save(); }
  if (i === 6 && !demo && !G.seen.skewer) { R.tut = {i:0, steps:SKEWER_TUT, label:'王姐小课堂'}; G.seen.skewer = 1; save(); }
  R.hearts = L.endless ? ENDLESS_HEARTS : START_HEARTS;
  $('log').innerHTML = '';
  $('speaker').innerHTML = '<div class="h">收款音箱</div><div class="e idle">等待收款…</div>';
  $('coach').hidden = !R.tut;
  hideOverlay(); last = now();
  render(); fit();
  window.scrollTo(0, 0);
  clearGuide();
  if (R.tut) setTimeout(function () { var st = tutStep(); if (st && R.tut.i === 0) startGuide(st); }, 80);
}
function mkBox() { return {items:[], stage:'open', fx:null}; }
function mkCust(face, name, order, pat) {
  return {id:nextId++, face:face, name:name, qty:order.specs.length, specs:order.specs, tag:order.tag || '', trait:order.trait || 'easy',
          runner:order.runner, pat:pat, patMax:pat, state:'wait', timer:0, say:''};
}
function ramp() { return R.L.endless ? Math.min(1, R.t / 240) : 0; }
// 按关卡设定的火候比例抽（没设就平均）
function pickBand(L) {
  if (!L.bandW) return pick(L.bands);
  var r = Math.random(), acc = 0;
  for (var i = 0; i < L.bands.length; i++) { acc += L.bandW[i] || 0; if (r < acc) return L.bands[i]; }
  return L.bands[L.bands.length - 1];
}
// 关卡火候规则（第 6 关）：前 within 位客人里一定有一位要 band；要 band 的客人不超过本局 max（开头强制那位除外）
function applyBandRule(L, specs, n) {
  var br = L.bandRule, cnt = R.bandCount || 0;
  if (R.forceAt == null) R.forceAt = 1 + Math.floor(Math.random() * br.within);
  var has = specs.some(function (sp) { return sp.band === br.band; });
  if (!has && cnt === 0 && n >= R.forceAt && n <= br.within) { specs[0].band = br.band; has = true; }
  if (has && cnt + 1 > Math.max(1, Math.floor(br.max * n))) {
    var others = L.bands.filter(function (b) { return b !== br.band; });
    specs.forEach(function (sp) { if (sp.band === br.band) sp.band = pick(others); });
    has = false;
  }
  if (has) R.bandCount = cnt + 1;
}
function spawn() {
  var L = R.L, k = ramp();
  var onScreen = R.cust.map(function (c) { return c.name; });   // 同屏三位尽量不重复
  var fresh = PEOPLE.filter(function (x) { return onScreen.indexOf(x[1]) < 0; });
  var p = pick(fresh.length ? fresh : PEOPLE);
  var pat = L.pat * PAT_SCALE * (1 - .35 * k) * (G.up.horn ? 1.25 : 1) * rnd(.85, 1.15);
  var base = {band: pickBand(L),
    sauce: L.sauces.length && Math.random() < .7 ? pick(L.sauces) : null,
    spice: L.spices.length && Math.random() < .6 ? pick(L.spices) : null};
  var specs = [base];
  if (Math.random() < L.two + .15 * k) {
    // 两根：可能一根一个要求（火候 / 酱 / 小料都可以不同），这种「混搭单」每局最多占客人总数的一半
    var s2 = {band:base.band, sauce:base.sauce, spice:base.spice};
    var canMix = (R.mixed || 0) + 1 <= .5 * ((R.spawned || 0) + 1);
    if (canMix && Math.random() < .8) {
      var parts = [];
      if (L.bands.length > 1) parts.push('band');
      if (L.sauces.length) parts.push('sauce');
      if (L.spices.length) parts.push('spice');
      var pickParts = parts.filter(function (f) { return Math.random() < (f === 'spice' ? .75 : .45); });   // 小料最常不一样
      if (!pickParts.length && parts.length) pickParts = [pick(parts)];
      pickParts.forEach(function (f) {
        if (f === 'band') s2.band = pick(L.bands.filter(function (b) { return b !== base.band; }));
        else if (f === 'sauce') s2.sauce = base.sauce ? pick(L.sauces.filter(function (x) { return x !== base.sauce; }).concat([null])) : pick(L.sauces);
        else s2.spice = base.spice ? pick(L.spices.filter(function (x) { return x !== base.spice; }).concat([null])) : pick(L.spices);
      });
      if (pickParts.length) R.mixed = (R.mixed || 0) + 1;
    }
    specs.push(s2);
  }
  if (L.bandRule) applyBandRule(L, specs, (R.spawned || 0) + 1);
  R.spawned = (R.spawned || 0) + 1;
  R.cust.push(mkCust(p[0], p[1], {specs:specs, runner: Math.random() < L.runner + .13 * k, trait:p[2]}, pat));
}
function spawnScripted() {
  var it = R.boxes[0].items[0] || R.boxes[1].items[0];
  var band = it ? it.band : '嫩';
  R.cust.push(mkCust('🧒', '一年级·豆豆', {specs:[{band:band, sauce:'番茄', spice:null}], runner:false, tag:'t1'}, 999));
}
function spawnScripted2() {
  R.cust.push(mkCust('👩', '家长·王阿姨', {specs:[{band:'嫩', sauce:null, spice:null}, {band:'脆', sauce:'番茄', spice:null}], runner:false, tag:'t2'}, 999));
}
function tick(dt) {
  if (!R || R.over) return;
  var L = R.L, tut = tutStep();
  if (!tut) R.t += dt;
  var cooking = 0, i;
  for (i = 0; i < R.slots.length; i++) if (R.slots[i].s) cooking++;
  // 点火后要热一会儿（约 1.2 秒到满火），停火后约 0.8 秒凉下来
  R.heat = Math.max(0, Math.min(1, R.heat + dt * (R.fire ? 1 / 1.2 : -1 / .8)));
  if (has('oil') && R.heat > .05) R.oil = Math.max(0, R.oil - dt * (cooking ? 1.7 : .3) * R.heat * (G.up.nonstick ? .6 : 1));
  var ost = oilState();
  var stickMul = !ost ? 1 : !STICKY_V2 ? 1.6 : ost === 2 ? 2.6 : 2;
  if (STICKY_V2 && ost && !R.stickWarned && cooking) { R.stickWarned = true; log(ost === 2 ? '锅干了！烤肠粘死在锅上，快加油' : '油不够，粘锅了！翻面要用力撬，快加油', 'bad'); ding(140, .25); }
  if (!ost) R.stickWarned = false;
  var rate = (tut ? (tut.freeze ? 0 : 6) : 7) * COOK_SLOW * heatMul() * stickMul * R.heat;
  for (i = 0; i < R.slots.length; i++) {
    var sl = R.slots[i]; if (!sl.s) continue;
    var s = sl.s, up = s.down === 'a' ? 'b' : 'a';
    s[s.down] += rate * dt; if (rate) s[up] += .7 * R.heat * dt;
  }
  for (i = 0; i < R.cust.length; i++) {
    var c = R.cust[i];
    if (c.state === 'wait') {
      if (!tut) c.pat -= dt;
      if (c.pat <= 0) { c.state = 'leave'; c.timer = 1; c.say = '不等了！'; R.st.angry++; log(c.name + ' 等不及走了' + (L.endless ? '（-1❤）' : ''), 'bad'); if (L.endless) R.hearts--; }
    } else {
      c.timer -= dt;
      if (c.state === 'paying' && c.timer <= 0) { receive(c.price); c.state = 'leave'; c.timer = 1; if (c.review !== 'bad') c.say = c.heart ? '好吃！❤' : '谢谢~'; }
      else if (c.state === 'flee' && c.timer <= 0) { R.st.fled++; log(c.name + ' 逃单跑了（-$' + c.price + (L.endless ? '，-1❤' : '') + '）', 'bad'); if (L.endless) R.hearts--; c.gone = true; }
      else if (c.state === 'leave' && c.timer <= 0) { c.gone = true; }
    }
  }
  R.cust = R.cust.filter(function (c) { return !c.gone; });
  if (tut) {
    if (tut.until && !tut.untilShowsBtn && tut.until()) tutGo(R.tut.i + 1);
    return;
  }
  R.spawnT -= dt;
  if (R.spawnT <= 0) { if (R.cust.length < MAXQ) spawn(); R.spawnT = rnd(L.spawn[0], L.spawn[1]) * (1 - .45 * ramp()); }
  if (L.endless) { if (R.hearts <= 0) finishEndless(); return; }
  if (R.hearts <= 0) { finish(false, 'hearts'); return; }
  var g = L.goal, ok = (g.money == null || R.net >= g.money) && (g.hearts == null || R.hearts >= g.hearts);
  if (ok) finish(true);
  else if (R.t >= L.time + (R.bonusT || 0)) finish(false);
  else countdown(L.time + (R.bonusT || 0) - R.t);
}
function receive(amount) {
  R.net += amount; R.st.sold++;
  R.pay.unshift({amount:amount, t:R.t}); if (R.pay.length > 2) R.pay.length = 2;
  $('speaker').innerHTML = '<div class="h">收款音箱</div>' + R.pay.map(function (p, i) {
    return '<div class="e' + (i === 0 ? ' new' : '') + '">微信收款 ' + p.amount + ' 元 · ' + fmtT(p.t) + '</div>';
  }).join('');
  payChime();
}

/* ============ 操作 ============ */
var ACT_TO_TUT = {place:'place', flip:'flip', pick:'pick', pack:'pack', fire:'fire', scrape:'scrape'};
var SLOT_ACTS = {place:1, flip:1, pick:1};
function act(a, i) {
  if (!R || R.over) return;
  if (a === 'selbox') {
    if (!boxOpen(i)) { log('盒 ' + 'ABC'.charAt(i) + ' 还没解锁，去「升级小摊」买', 'bad'); return; }
    if (R.boxes[i]) R.sel = i; render(); return;
  }
  var st = tutStep();
  if (st) {
    var burntPick = a === 'pick' && R.slots[i] && R.slots[i].s && judge(R.slots[i].s) === 'burnt';
    var freeAct = st.free && st.free[a];
    if (!burntPick && !freeAct && (!ACT_TO_TUT[a] || !tutAllows(ACT_TO_TUT[a]) || (SLOT_ACTS[a] && i !== 0))) {
      log('先跟着王姐做亮起来的那一步', 'bad'); nudge(); return;
    }
  }
  var sl = R.slots[i];
  switch (a) {
    case 'place':
      if (sl.s || sl.dirt) return;
      if (sl.cleanT && now() - sl.cleanT < 600) return;   // 刚铲完锅巴，连点的下一下不算放肠
      if (R.stock <= 0) { log('没有串好的肠了，先点「串一根」', 'bad'); return; }
      if (R.stock !== Infinity) R.stock--;
      sl.s = {a:0, b:0, down:'a'}; R.net -= COST; ding(300, .06);
      tutEvent('place'); break;
    case 'flip':
      if (!sl.s) return;
      sl.flipT = now();   // 防误触：刚点完翻面，同一根短时间内拖不走
      if (STICKY_V2 && oilState()) {
        var need = oilState() === 2 ? 3 : 2;
        sl.pry = (sl.pry || 0) + 1; sl.jolt = now();
        if (sl.pry < need) { log('粘住了！再撬一下' + (need - sl.pry > 1 ? '（还要 ' + (need - sl.pry) + ' 下）' : ''), 'bad'); ding(110, .07); break; }
      }
      sl.pry = 0;
      sl.s.down = sl.s.down === 'a' ? 'b' : 'a'; ding(520, .04);
      tutEvent('flip'); break;
    case 'pick': {
      if (!sl.s) return;
      if (sl.flipT && now() - sl.flipT < 400) return;
      var j = judge(sl.s);
      if (j === 'burnt' && R.tut) {
        // 教学里烤焦了：直接扔掉重来
        sl.s = null; R.st.wasted++; log('焦了！没关系，再放一根试试', 'bad');
        if (!tutStep().twoBands) tutGo(1);
        break;
      }
      if (R.tut) {
        var ts = tutStep(), okBands = ts && ts.twoBands ? ['嫩', '脆'].filter(function (b) { return !boxHas(b); }) : ['嫩'];
        if (okBands.indexOf(j) < 0) {
          var why = j === 'uneven' ? '阴阳面！一面烤太久了，翻面让另一面追上来'
            : j === 'raw' ? '还没熟：两面都要过第一条刻度'
            : j === '微焦' ? '烤过头成「微焦」了，这单不要微焦'
            : (j === '嫩' ? '盒里已经有「嫩」的了，这根再烤一会儿到「脆」' : ts && ts.twoBands ? '盒里已经有「脆」的了，这根只要「嫩」' : '还没到「嫩」');
          log(why, 'bad'); nudge(); return;
        }
      }
      var bk = pickBox();
      if (bk < 0) { log('盒子都满了或已盖上，先交货或倒掉', 'bad'); return; }
      R.boxes[bk].items.push({band:j, sauce:null, spice:null}); sl.s = null; sl.count++;
      if (bk !== R.sel) log('选中的盒子放不下，放进了盒 ' + 'ABC'.charAt(bk), '');
      if (has('scrape') && (sl.count >= 3 || j === 'burnt')) { sl.dirt = true; sl.count = 0; }
      if (j === 'raw') log('夹了一根生的，客人不会给钱', 'bad');
      else if (j === 'burnt') log('夹了一根焦的，客人不会给钱', 'bad');
      else if (j === 'uneven') log('阴阳面，客人会给差评', 'bad');
      ding(660, .05);
      tutEvent('pick'); break;
    }
    case 'scrape': sl.dirt = false; sl.scrub = 0; ding(200, .08); ding(620, .12, null, 'triangle', .08); log('锅巴铲干净了', 'good'); tutEvent('scrape'); break;
    case 'oil':
      if (R.oil > 85) { R.net -= COST; log('油溢出来了（-$1）', 'bad'); }
      R.oil = Math.min(100, R.oil + 35); ding(400, .08); break;
    case 'skewer': if (R.stock < SKEWER_MAX) { R.stock++; ding(760, .04); } break;
    case 'pack': {
      var bx = R.boxes[i];
      if (!bx || !bx.items.length || bx.stage !== 'open') return;
      bx.stage = 'box'; bx.fx = {kind:'box', t:now()};
      ding(330, .06); setTimeout(function () { ding(240, .1); }, 380);
      tutEvent('pack'); break; }
    case 'dump': {
      var bd = R.boxes[i];
      if (bd && bd.items.length) { R.st.wasted += bd.items.length; R.boxes[i] = mkBox(); log('盒 ' + 'ABC'.charAt(i) + ' 倒掉了', 'bad'); }
      break; }
    case 'useitem': useItem(i); break;
    case 'heatlv':
      if (!fireUp() || !HEAT_LV[i]) return;
      R.heatLv = i; ding(360 + i * 180, .08);
      log('火力调到' + HEAT_LV[i].name + '火' + (i === 2 ? '，小心烤焦' : i === 0 ? '，烤得慢但稳' : ''), '');
      break;
    case 'fire':
      // 旋钮顺时针拧：关 → 小 → 中 → 大 → 关（没买「可调火力」时只有 关 ↔ 中）
      if (!fireUp()) { R.fire = !R.fire; R.heatLv = 1; }
      else if (!R.fire) { R.fire = true; R.heatLv = 0; }
      else if ((R.heatLv == null ? 1 : R.heatLv) < 2) R.heatLv = (R.heatLv == null ? 1 : R.heatLv) + 1;
      else R.fire = false;
      ding(R.fire ? 420 + R.heatLv * 120 : 260, .1);
      log(!R.fire ? '已停火，烤肠不会再继续烤' : fireUp() ? '火力：' + HEAT_LV[R.heatLv].name + '火' + (R.heatLv === 2 ? '，小心烤焦' : '') : '点火了，锅要热一会儿', R.fire ? 'good' : '');
      tutEvent('fire'); break;
    case 'cust': tapCust(R.cust.filter(function (c) { return c.id === i; })[0]); break;
  }
  render();
}
// 夹起的烤肠放进哪个盒子：优先选中的盒子，放不下就放另一个
// 局中道具栏：三个按钮一直在；有存货点了就用，没存货显示价格，点了当场买来用
// 最后 5 秒还没达成目标：提醒用沙漏加时（闪烁按时间算，不依赖 CSS 动画，避免每帧重绘时动画重置）
function urgeHourglass() {
  if (!R || R.over || R.tut || R.L.endless || R.L.tutorial) return false;
  var g = R.L.goal, left = R.L.time + (R.bonusT || 0) - R.t;
  var met = (g.money == null || R.net >= g.money) && (g.hearts == null || R.hearts >= g.hearts);
  if (met || left > 5 || left <= 0) return false;
  var hg = ITEMS.filter(function (it) { return it.id === 'hourglass'; })[0];
  if (!((G.items.hourglass || 0) > 0 || G.bank >= hg.cost)) return false;
  if (!R.urged) { R.urged = true; log('只剩 5 秒！点沙漏加 30 秒', 'bad'); }
  return true;
}
function countdown(left) {
  if (R.L.endless || R.L.tutorial || left > 5) { R.lastCount = null; return; }
  var n = Math.ceil(left);
  if (n === R.lastCount || n <= 0) return;
  R.lastCount = n;
  // 倒计时「滴滴」：越到最后越急——5、4 秒滴两下，3、2 秒滴三下，最后 1 秒连滴四下再一声长嘀
  var k, beeps = n >= 4 ? 2 : n >= 2 ? 3 : 4, gap = n >= 4 ? .16 : n >= 2 ? .13 : .1;
  for (k = 0; k < beeps; k++) ding(n === 1 ? 1320 : 988, .07, .5, 'square', k * gap);
  if (n === 1) ding(1760, .5, .6, 'square', beeps * gap + .05);
}
function screenFlash() {
  var f = $('flash');
  if (!f) { f = document.createElement('div'); f.id = 'flash'; document.body.appendChild(f); }
  f.className = 'on';
  setTimeout(function () { f.className = ''; }, 220);
}
// 可调火力：小 0.7 / 中 1 / 大 1.35（没买就一直是中火）
var HEAT_LV = [{name:'小', mul:.7}, {name:'中', mul:1}, {name:'大', mul:1.35}];
// 第一关（教学）不管有没有买「可调火力」，旋钮都只有 开 ↔ 关
function fireUp() { return !!G.up.fire && !(R && R.i === 0); }
var COOK_SLOW = 0.7;   // 进度条变短后整体烤慢 30%
function heatMul() { return fireUp() ? HEAT_LV[R.heatLv == null ? 1 : R.heatLv].mul : 1; }
function blinkOn() { return Math.floor(now() / 250) % 2 === 0; }
function itemBar() {
  if (R.L.tutorial) return '';   // 第一关（教学关）不显示道具
  return '<div class="itembar">' + ITEMS.map(function (it, idx) {
    var n = G.items[it.id] || 0, off = it.id === 'hourglass' && R.L.endless;
    if (!n && G.bank < it.cost) off = true;
    var urge = it.id === 'hourglass' && urgeHourglass();
    return '<button class="itm' + (n ? '' : ' buy') + (urge ? ' urge' + (blinkOn() ? ' on' : '') : '') + '" data-act="useitem" data-i="' + idx + '"' + (off ? ' disabled' : '') + ' aria-label="' + it.name + '">' +
      '<img alt="" src="./assets/img/items/' + it.id + '.webp?v=' + BUILD_V + '"><b>' + (n ? '×' + n : '$' + it.cost) + '</b></button>';
  }).join('') + '</div>';
}
// 道具反馈：在道具按钮上方飘一行字（不用提示框）
// 道具用不了：按钮抖一下（不飘字）
function itemFx(i, text, ok) {
  if (ok) return;
  var b = document.querySelector('.itm[data-i="' + i + '"]'); if (!b) return;
  b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); ding(180, .06);
}
function useItem(i) {
  var it = ITEMS[i]; if (!it) return;
  var have = (G.items[it.id] || 0) > 0;
  if (!have) {
    // 手上没有：先用存款买一个，右上角显示 ×1；再点一下才用
    if (it.id === 'hourglass' && R.L.endless) { itemFx(i, '', false); return; }
    if (G.bank < it.cost) { log('存款不够买' + it.name, 'bad'); itemFx(i, '', false); return; }
    G.bank -= it.cost; G.items[it.id] = 1; save(); ding(880, .08); render(); return;
  }
  if (it.id === 'hourglass') {
    if (R.L.endless) { log('无尽模式不能用沙漏', 'bad'); itemFx(i, '无尽模式不能用', false); return; }
    R.bonusT = (R.bonusT || 0) + 30; R.urged = false; log('沙漏：时间 +30 秒', 'good'); itemFx(i, '+30 秒', true);
  } else if (it.id === 'flower') {
    // 烤肠课代表：排队的客人瞬间全部做完（按做对的订单处理）
    var done = 0;
    R.cust.forEach(function (c) {
      if (c.state !== 'wait') return;
      c.served = true; c.got = true; c.review = 'good'; c.say = '扫好啦~';
      c.price = c.qty === 2 ? PRICE2 : PRICE1;
      c.heart = c.pat / c.patMax > .35; if (c.heart) R.hearts++;
      if (c.runner) { c.state = 'flee'; c.timer = 3.2; } else { c.state = 'paying'; c.timer = rnd(.4, 1); }
      done++;
    });
    if (!done) { log('现在没有排队的客人', 'bad'); itemFx(i, '还没有客人', false); return; }
    log('烤肠课代表：' + done + ' 单瞬间做完！', 'good'); itemFx(i, done + ' 单做完！', true);
  } else if (it.id === 'candy') {
    var n = 0; R.cust.forEach(function (c) { if (c.state === 'wait') { c.pat = c.patMax; n++; } });
    if (!n) { log('现在没有排队的客人', 'bad'); itemFx(i, '还没有客人', false); return; }
    log('棒棒糖：' + n + ' 位客人耐心回满', 'good'); itemFx(i, '耐心回满', true);
  }
  G.items[it.id]--;
  save(); ding(990, .1); setTimeout(function () { ding(1320, .12); }, 90);
}
// 智能机器：番茄涂抹机管番茄；撒料机管孜然、辣椒。返回本关它们能管的 {料名: 'sauce'|'spice'}
function smartSet() {
  var m = {}; if (!R) return m;
  if (G.up.smart && R.L.sauces.indexOf('番茄') >= 0) m['番茄'] = 'sauce';
  if (G.up.spicer) {
    if (R.L.spices.indexOf('孜然') >= 0) m['孜然'] = 'spice';
    if (R.L.spices.indexOf('辣椒') >= 0) m['辣椒'] = 'spice';
  }
  return m;
}
function smartOn() { return Object.keys(smartSet()).length > 0; }
function smartLabel() { return '点烤肠自动加' + Object.keys(smartSet()).join('、'); }
function toggleTomato(k, j) {
  // 找最匹配这盒的排队客人，按他的要求给这盒每根加好 / 去掉机器管的料
  var b = R.boxes[k]; if (!b || b.stage !== 'open' || !b.items.length) return;
  R.sel = k;
  var M = smartSet(), who = G.up.smart && G.up.spicer ? '智能机器' : G.up.spicer ? '撒料机' : '涂抹机';
  var best = null, bestScore = -1;
  R.cust.forEach(function (c) {
    if (c.state !== 'wait') return;
    var score = (c.qty === b.items.length ? 10 : 0);
    b.items.forEach(function (t, i) { var sp = c.specs[Math.min(i, c.specs.length - 1)]; if (sp.band === t.band) score += 2; });
    if (score > bestScore) { bestScore = score; best = c; }
  });
  if (!best) { log(who + '：现在没有客人在等', 'bad'); return; }
  var sp = best.specs, items = b.items;
  // 两根对两根时按火候配对（和交货的判定一致）
  var order = items.map(function (t, i) { return sp[Math.min(i, sp.length - 1)]; });
  if (items.length === 2 && sp.length === 2 && items[0].band === sp[1].band && items[1].band === sp[0].band && items[0].band !== items[1].band) order = [sp[1], sp[0]];
  var changed = 0, sauced = 0, t0 = now();
  items.forEach(function (t, i) {
    ['sauce', 'spice'].forEach(function (kind) {
      var want = order[i][kind] || null, cur = t[kind] || null;
      if (want && M[want] === kind && cur !== want) { t[kind] = want; t.fx = {kind:kind, t:t0}; changed++; if (kind === 'sauce') sauced++; }
      else if (cur && M[cur] === kind && cur !== want) { t[kind] = null; changed++; }
    });
  });
  if (sauced || !changed) ding(changed ? 160 : 600, changed ? .18 : .06);
  if (changed > sauced) [0, 60, 120].forEach(function (d) { setTimeout(function () { ding(1500 + Math.random() * 400, .03); }, d); });
  log(who + '：按' + best.name + '的要求' + (changed ? '弄好了' : '，这盒不用改'), changed ? 'good' : '');
}
var BOXB_FREE = true;   // 测试版：两个打包盒开局就有（false = 盒 B 要在升级小摊买）
function boxTotal() {
  if (R && R.L && R.L.tutorial) return 1;   // 第一关只开一个打包盒，另外两个锁着
  var n = BOXB_FREE ? 2 : 1 + Math.min(1, G.up.boxb || 0);
  return Math.min(3, n + (G.up.boxc ? 1 : 0));
}
function boxOpen(k) { return k < boxTotal(); }
function pickBox() {
  var order = [R.sel].concat([0, 1, 2].filter(function (x) { return x !== R.sel; }));
  for (var n = 0; n < 3; n++) { var b = R.boxes[order[n]]; if (boxOpen(order[n]) && b.stage === 'open' && b.items.length < 2) return order[n]; }
  return -1;
}
function anyBox(fn) { return R.boxes.some(fn); }
function tapCust(c) {
  if (!c) return;
  if (c.state === 'flee') {
    c.state = 'leave'; c.timer = 1; c.say = '嘿嘿…忘了忘了'; c.accused = true;
    R.st.caught++; log('喊住了 ' + c.name + (c.price ? '，补付 $' + c.price : ''), 'good'); if (c.price) receive(c.price); return;
  }
  if (c.state === 'paying' || c.state === 'leave') {
    if (c.served && !c.accused) { c.accused = true; R.hearts = Math.max(0, R.hearts - 1); R.st.wrong++; c.say = '我扫了啊！'; log('冤枉了 ' + c.name + '（-1❤）', 'bad'); }
    return;
  }
  if (anyBox(function (b) { return b.stage === 'box'; })) log('按住打包盒，拖到客人身上', 'bad');
  else if (anyBox(function (b) { return b.items.length; })) log('先装盒，再把盒子拖给客人', 'bad');
  else log('先把锅里的烤肠拖进盒子', 'bad');
}
function deliver(c, k) {
  var bx = R.boxes[k];
  if (!c || c.state !== 'wait' || !bx || bx.stage !== 'box') return false;
  var items = bx.items, specs = c.specs, raw = false, burnt = false, issues = [];
  items.forEach(function (t) { if (t.band === 'raw') raw = true; if (t.band === 'burnt') burnt = true; });
  function diff(t, sp) {
    var d = [];
    if (t.band !== 'raw' && t.band !== 'burnt' && t.band !== sp.band) d.push('火候');
    if (t.sauce !== sp.sauce) d.push('酱');
    if (t.spice !== sp.spice) d.push('小料');
    return d;
  }
  // 两根对两根时，按最合适的配对来比（顺序无所谓）
  var pairs = items.map(function (t, i) { return diff(t, specs[Math.min(i, specs.length - 1)]); });
  if (items.length === 2 && specs.length === 2) {
    var swap = [diff(items[0], specs[1]), diff(items[1], specs[0])];
    if (swap[0].length + swap[1].length < pairs[0].length + pairs[1].length) pairs = swap;
  }
  pairs.forEach(function (d) { d.forEach(function (x) { if (issues.indexOf(x) < 0) issues.push(x); }); });
  if (items.length !== c.qty) issues.push('根数');
  var full = items.length === 2 ? PRICE2 : PRICE1;
  R.boxes[k] = mkBox(); c.served = true; c.got = true;
  if (raw || burnt) {
    c.price = 0; c.review = 'bad'; c.say = raw ? '是生的！不给钱！' : '都焦了！不给钱！';
    log(c.name + ' 差评：' + (raw ? '生的' : '焦的') + '（不给钱，-1❤）', 'bad');
  } else if (issues.length) {
    c.price = Math.max(1, full - (PENALTY[c.trait] || 1)); c.review = 'bad';
    c.say = c.trait === 'picky' ? issues.join('、') + '不对！少给两块！' : issues.join('、') + '不对…算了，少给一块吧';
    log(c.name + ' 差评：' + issues.join('、') + '不对（少收 $' + (full - c.price) + '，-1❤）', 'bad');
  } else {
    c.price = full; c.review = 'good'; c.say = '扫好啦~';
  }
  if (c.review === 'bad') { R.hearts = Math.max(0, R.hearts - 1); R.st.bad++; ding(180, .2); }
  else { c.heart = c.pat / c.patMax > .35; if (c.heart) R.hearts++; ding(880, .06); }
  if (c.runner) { c.state = 'flee'; c.timer = 3.2; if (c.review === 'bad') c.say = '扫好啦~'; }
  else if (c.price > 0) { c.state = 'paying'; c.timer = rnd(.5, 1.3); }
  else { c.state = 'leave'; c.timer = 1.6; }
  tutEvent('serve');
  return true;
}

/* ============ 调料拖拽 ============ */
var SAUCE_PATH = 'M22 13 L30 19 L38 11 L46 19 L54 11 L62 19 L70 11 L78 19 L86 11 L94 19 L102 12';
var DOTS = [[24,10],[31,17],[38,12],[45,19],[52,9],[58,15],[65,20],[71,11],[78,16],[85,10],[91,18],[98,13],[104,17],[34,21],[62,8],[88,21]];
function traySvg(t, fresh) {
  var h = '<svg class="tsvg" viewBox="0 0 120 30" aria-hidden="true"><line x1="0" y1="15" x2="22" y2="15" stroke="#D9C08E" stroke-width="3"/>' +
    '<rect x="12" y="4" width="104" height="22" rx="11" fill="' + col(BAND_VAL[t.band]) + '"/><rect x="22" y="7" width="80" height="3" rx="1.5" fill="#fff" opacity=".22"/>';
  if (t.sauce) h += '<path class="' + (fresh === 'sauce' ? 'draw' : '') + '" d="' + SAUCE_PATH + '" pathLength="100" fill="none" stroke="' + SAUCE_COL[t.sauce] + '" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>';
  if (t.spice) {
    var cc = SPICE_COL[t.spice], cls = fresh === 'spice' ? 'fall' : '';
    h += DOTS.map(function (d, i) {
      var delay = ' style="animation-delay:' + (i * 25) + 'ms"';
      return t.spice === '葱花'
        ? '<rect class="' + cls + '"' + delay + ' x="' + (d[0] - 2) + '" y="' + (d[1] - 1.5) + '" width="4" height="3" rx="1" fill="' + (i % 3 ? cc : '#A8DB7E') + '"/>'
        : '<circle class="' + cls + '"' + delay + ' cx="' + d[0] + '" cy="' + d[1] + '" r="' + (t.spice === '辣椒' ? 1.8 : 1.4) + '" fill="' + cc + '"/>';
    }).join('');
  }
  return h + '</svg>';
}
function applyTopping(kind, v, k, j) {
  if (k == null) {
    // 轻点调料：加给选中的盒子；它没东西可加时，加给另一个
    k = R.sel;
    if (R.boxes[k].stage !== 'open' || !R.boxes[k].items.length) {
      for (var q = 0; q < 3; q++) if (boxOpen(q) && R.boxes[q].stage === 'open' && R.boxes[q].items.length) { k = q; break; }
    }
  }
  var bx = R.boxes[k], tst = tutStep();
  if (!bx || !bx.items.length) { log('盒子里还没有烤肠', 'bad'); return false; }
  if (tst && tst.crispSauce) {
    if (j == null) { log('拖到「脆」的那一根上，不是整个盒子', 'bad'); nudge(); return false; }
    if (bx.items[j] && bx.items[j].band !== '脆') { log('王阿姨说，这根「嫩」烤肠不要刷酱', 'bad'); nudge(); return false; }
  }
  if (bx.stage !== 'open') { log('盒 ' + 'ABC'.charAt(k) + ' 已经盖上了，不能再加料', 'bad'); return false; }
  var items = j == null ? bx.items : [bx.items[j]].filter(Boolean);
  if (!items.length) return false;
  var t0 = now();
  items.forEach(function (t) { t[kind] = v; t.fx = {kind:kind, t:t0}; });
  if (kind === 'sauce') ding(160, .18);
  else [0, 60, 120, 180].forEach(function (d) { setTimeout(function () { ding(1500 + Math.random() * 400, .03); }, d); });
  render();
  tutEvent('topping');
  return true;
}
function burst(x, y, kind, color) {
  var n = kind === 'sauce' ? 6 : 14;
  for (var k = 0; k < n; k++) {
    var p = document.createElement('span'); p.className = 'particle ' + kind; p.style.background = color;
    p.style.left = x + 'px'; p.style.top = y + 'px'; document.body.appendChild(p);
    var dx = (Math.random() - .5) * (kind === 'sauce' ? 30 : 50), dy = kind === 'sauce' ? rnd(8, 20) : rnd(20, 45);
    if (p.animate) {
      var an = p.animate([{transform:'translate(-50%,-50%) scale(1)', opacity:1},
                          {transform:'translate(' + (dx - 2) + 'px,' + (dy - 2) + 'px) scale(.6)', opacity:0}],
                         {duration:rnd(380, 620), easing:'ease-in'});
      an.onfinish = (function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(p);
    } else {
      setTimeout((function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(p), 400);
    }
  }
}
var drag = null;
function dropTarget(x, y, type, from) {
  var el = document.elementFromPoint(x, y); if (!el) return null;
  if (type === 'bag') return el.closest('[data-cid]');
  if (type === 'scrape') {
    var rb = el.closest('[data-rub]');
    return rb && R.slots[+rb.getAttribute('data-rub')] && R.slots[+rb.getAttribute('data-rub')].dirt ? rb : null;
  }
  if (type === 'saus') {
    var sb = el.closest('[data-box]'); if (!sb) return null;
    var sk = +sb.getAttribute('data-box'), sbx = R.boxes[sk];
    return boxOpen(sk) && sbx.stage === 'open' && sbx.items.length < 2 ? sb : null;
  }
  if (type === 'item') {
    var bxEl = el.closest('[data-box]'); if (!bxEl) return null;
    var k = +bxEl.getAttribute('data-box'), b = R.boxes[k];
    return k !== from && boxOpen(k) && b.stage === 'open' && b.items.length < 2 ? bxEl : null;
  }
  return el.closest('[data-item]') || el.closest('[data-box]');
}
function startDrag(tool, e) {
  var kind = tool.getAttribute('data-tool'), v = tool.getAttribute('data-v');
  var color = (kind === 'sauce' ? SAUCE_COL : SPICE_COL)[v];
  var g = document.createElement('div'); g.className = 'ghost ' + kind; g.style.setProperty('--c', color);
  g.innerHTML = '<i class="' + (kind === 'sauce' ? 'bottle' : 'shaker') + '"></i>';
  document.body.appendChild(g);
  drag = {type:'topping', kind:kind, v:v, color:color, g:g, x0:e.clientX, y0:e.clientY, moved:false, over:null};
  moveDrag(e);
}
function startItemDrag(e, k, j) {
  var g = document.createElement('div'); g.className = 'ghost itemg';
  g.innerHTML = traySvg(R.boxes[k].items[j], '');
  document.body.appendChild(g);
  drag = {type:'item', box:k, j:j, g:g, x0:e.clientX, y0:e.clientY, moved:false, over:null};
  moveDrag(e);
}
function startSausDrag(e, i, el) {
  var g = document.createElement('div'); g.className = 'ghost sausg';
  var img = el.querySelector('img'); if (img) g.innerHTML = '<img alt="" src="' + img.getAttribute('src') + '">';
  document.body.appendChild(g);
  drag = {type:'saus', slot:i, g:g, x0:e.clientX, y0:e.clientY, moved:false, over:null};
  moveDrag(e);
}
var SCRAPE_DIST = 160;   // 在锅巴上来回拖的总距离（屏幕像素）够了就铲干净
function startScrapeDrag(e, i) {
  var g = document.createElement('div'); g.className = 'ghost scrg';
  g.innerHTML = '<img alt="" src="' + SC + 'scraper.webp?v=' + BUILD_V + '">';
  document.body.appendChild(g);
  drag = {type:'scrape', slot:i, g:g, x0:e.clientX, y0:e.clientY, lx:e.clientX, ly:e.clientY, dist:0, moved:false, over:null};
  moveDrag(e);
}
function startBagDrag(e, k) {
  var g = document.createElement('div'); g.className = 'ghost bagg';
  g.innerHTML = '<img alt="" src="' + SC + 'box_closed.webp?v=' + BUILD_V + '">';   // 拖的时候手里是同一个合好的盒子（不再用旧的棕色纸盒）
  document.body.appendChild(g);
  drag = {type:'bag', box:k, g:g, x0:e.clientX, y0:e.clientY, moved:false, over:null};
  moveDrag(e);
  render();
}
function moveDrag(e) {
  if (!drag) return;
  drag.g.style.left = e.clientX + 'px'; drag.g.style.top = e.clientY + 'px';
  if (drag.type === 'scrape') {
    var sl0 = R && R.slots[drag.slot];
    drag.dist += Math.abs(e.clientX - drag.lx) + Math.abs(e.clientY - drag.ly); drag.lx = e.clientX; drag.ly = e.clientY;
    if (sl0 && sl0.dirt) {
      var step = Math.floor(drag.dist / (SCRAPE_DIST / 4));
      if (step > (drag.step || 0)) { drag.step = step; ding(150 + Math.random() * 60, .05, .35, 'sawtooth'); }
      if (drag.base == null) drag.base = sl0.scrub || 0;
      sl0.scrub = Math.min(3, drag.base + Math.floor(drag.dist / (SCRAPE_DIST / 3)));
      if (sl0.scrub >= SCRAPE_TAPS || drag.dist >= SCRAPE_DIST) { sl0.cleanT = now(); act('scrape', drag.slot); burst(e.clientX, e.clientY, 'spice', '#8A5A30'); }
      render();
    }
    return;
  }
  if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 8) drag.moved = true;
  if (drag.type === 'saus') drag.g.style.opacity = drag.moved ? '' : '0';
  var t = dropTarget(e.clientX, e.clientY, drag.type, drag.box);
  if (drag.type === 'bag') {
    var id = t ? +t.getAttribute('data-cid') : null;
    if (id !== drag.over) { drag.over = id; render(); }
    drag.g.classList.toggle('pour', !!t);
    return;
  }
  if (t !== drag.over) { if (drag.over) drag.over.classList.remove('drop'); if (t) t.classList.add('drop'); drag.over = t; }
  drag.g.classList.toggle('pour', !!t);
}
function endDrag(e) {
  if (!drag) return;
  var d = drag; drag = null;
  if (d.g.parentNode) d.g.parentNode.removeChild(d.g);
  if (d.type !== 'bag' && d.over) d.over.classList.remove('drop');
  if (!R || R.over || R.paused) { render(); return; }
  if (d.type === 'scrape') {
    var rsl = R.slots[d.slot];
    if (rsl && rsl.dirt && !d.moved) {
      // 点一下也算铲一下：铲子在点的位置停一会儿再消失，点满 SCRAPE_TAPS 下铲干净
      var fl = document.createElement('div'); fl.className = 'ghost scrg tapfx';
      fl.innerHTML = '<img alt="" src="' + SC + 'scraper.webp?v=' + BUILD_V + '">';
      fl.style.left = e.clientX + 'px'; fl.style.top = e.clientY + 'px'; document.body.appendChild(fl);
      setTimeout(function () { if (fl.parentNode) fl.parentNode.removeChild(fl); }, 380);
      scrapeTap(d.slot); return;
    }
    render(); return;
  }
  if (d.type === 'saus') {
    if (!d.moved) { act('flip', d.slot); render(); return; }
    var stb = dropTarget(e.clientX, e.clientY, 'saus');
    if (stb) { R.sel = +stb.getAttribute('data-box'); act('pick', d.slot); }
    else log('拖进下面的打包盒里松手', 'bad');
    render(); return;
  }
  if (d.type === 'item') {
    var src = R.boxes[d.box], tb = dropTarget(e.clientX, e.clientY, 'item', d.box);
    if (tb && src.stage === 'open' && src.items[d.j]) {
      var to = +tb.getAttribute('data-box');
      R.boxes[to].items.push(src.items.splice(d.j, 1)[0]);
      ding(620, .05); log('挪到了盒 ' + 'ABC'.charAt(to), 'good');
    } else if (!d.moved) { if (smartOn()) toggleTomato(d.box, d.j); else R.sel = d.box; }
    else if (!boxOpen(1)) log('解锁盒 B 后，装错的烤肠可以挪过去', 'bad');
    else log('另一个盒子满了或已盖上，放不下', 'bad');
    render(); return;
  }
  var t = dropTarget(e.clientX, e.clientY, d.type, d.box);
  if (d.type === 'bag') {
    if (t) {
      var id = +t.getAttribute('data-cid'), c = R.cust.filter(function (x) { return x.id === id; })[0];
      if (deliver(c, d.box)) burst(e.clientX, e.clientY, 'spice', '#F2B53A');
    } else if (!d.moved) log('按住打包盒，拖到客人身上', 'bad');
    render(); return;
  }
  // 调料一次只加一根：拖到哪根加哪根；拖到盒子空白处就加给离手指最近的那根
  var ok = false, onItem = t && t.hasAttribute('data-item'), el = t;
  if (onItem) { var kj = t.getAttribute('data-item').split('-'); ok = applyTopping(d.kind, d.v, +kj[0], +kj[1]); }
  else if (t) {
    var near = nearestItem(t, e.clientY);
    if (near) { el = near; kj = near.getAttribute('data-item').split('-'); ok = applyTopping(d.kind, d.v, +kj[0], +kj[1]); }
    else log('盒子里还没有烤肠', 'bad');
  } else if (!d.moved) {
    // 轻点调料：选中的盒子里只有一根时才直接加，两根时要拖到那一根上
    var sb = R.boxes[R.sel];
    if (sb && sb.stage === 'open' && sb.items.length === 1) { ok = applyTopping(d.kind, d.v, R.sel, 0); el = document.querySelector('[data-item="' + R.sel + '-0"]'); }
    else if (sb && sb.items.length === 2) log('盒里有两根，按住调料拖到要加的那一根上', 'bad');
    else log('按住调料，拖到盒里的烤肠上', 'bad');
  }
  if (ok && el) {
    var r = el.getBoundingClientRect();
    burst(d.moved ? e.clientX : r.left + r.width / 2, d.moved ? e.clientY : r.top + r.height / 2, d.kind, d.color);
  }
}
function nearestItem(boxEl, y) {
  var list = boxEl.querySelectorAll('[data-item]'), best = null, bd = 1e9;
  for (var n = 0; n < list.length; n++) {
    var r = list[n].getBoundingClientRect(), dy = Math.abs(r.top + r.height / 2 - y);
    if (dy < bd) { bd = dy; best = list[n]; }
  }
  return best;
}
function cancelDrag() {
  if (!drag) return;
  if (drag.g.parentNode) drag.g.parentNode.removeChild(drag.g);
  if (drag.type !== 'bag' && drag.over) drag.over.classList.remove('drop');
  drag = null; render();
}

/* 打包盒（纯 CSS 绘制） */
function boxHTML(fresh, n) {
  return '<div class="pbox' + (fresh ? ' fresh' : '') + '">' +
    '<i class="ps"></i>' + (n > 1 ? '<i class="ps p2"></i>' : '') +
    '<div class="front"><span>烤肠</span></div><div class="lid"></div></div>';
}

/* ============ 渲染 ============ */
function walkStyle(p) { p = Math.max(0, Math.min(1, p)); return ' style="opacity:' + (1 - p).toFixed(2) + '"'; }   // 离场：原地淡出
function patColor(r) { return r > .5 ? 'var(--good)' : r > .25 ? 'var(--gold)' : 'var(--red)'; }
/* ============ 渲染（主界面：720×1280 的场景舞台，整体等比缩放） ============ */
var SC = './assets/img/scene/';
var CUST_ART = [['豆豆','kid01'],['小胖','kid02'],['朵朵','kid03'],['学霸','kid04'],['皮皮','kid05'],['班长','kid06'],['王阿姨','parent01'],['李叔叔','parent02'],['体育老师','teacher'],['奶奶','grandma']];
function custMood(c) {
  var r = c.pat / c.patMax;
  if (c.review === 'bad' || (c.state === 'leave' && !c.served)) return 'angry';
  return c.state === 'wait' && r <= .35 ? 'anxious' : '';
}
function custArt(c) {
  var id = 'kid01';
  for (var n = 0; n < CUST_ART.length; n++) if (c.name.indexOf(CUST_ART[n][0]) >= 0) { id = CUST_ART[n][1]; break; }
  var r = c.pat / c.patMax, st = 'wait';
  // 只用三种表情：等待 / 耐心快没了着急 / 做错了或等太久生气
  if (c.state === 'wait') st = r > .35 ? 'wait' : 'anxious';
  else if (c.review === 'bad' || (c.state === 'leave' && !c.served)) st = 'angry';
  // 着急 / 生气直接换对应表情图
  if (st !== 'wait' && MOOD_ART[id]) id += '_' + st;
  return './assets/img/cust/' + id + '.webp?v=' + BUILD_V;
}
var MOOD_ART = {kid01:1, kid02:1, kid03:1, kid04:1, kid05:1, kid06:1, parent01:1, parent02:1, teacher:1, grandma:1};
var BAND_ICON = {'嫩':'tender', '脆':'crispy', '微焦':'charred'};
var SAUCE_ICON = {'番茄':'tomato', '蜂蜜芥末':'honeymustard', '甜辣':'sweetchili'};
var SPICE_ICON = {'孜然':'cumin', '辣椒':'chili'};
function oIcon(name, label) { return '<span class="oi"><img alt="" src="' + SC + 'i_' + name + '.webp?v=' + BUILD_V + '"><small>' + label + '</small></span>'; }
// 订单气泡：一行图标（数量 / 火候 / 酱 / 小料）；两根不一样时分两行写
function orderIcons(sp) {
  var h = oIcon(BAND_ICON[sp.band] || 'tender', sp.band);
  h += sp.sauce ? oIcon(SAUCE_ICON[sp.sauce], SHORT[sp.sauce].replace('酱', '')) : oIcon('none', '无酱');
  if (R.L.spices.length) h += sp.spice ? oIcon(SPICE_ICON[sp.spice] || 'cumin', sp.spice) : oIcon('none', '无料');
  return h;
}
function orderHTML(c) {
  var sp = c.specs, same = sp.length === 1 || (sp[0].band === sp[1].band && sp[0].sauce === sp[1].sauce && sp[0].spice === sp[1].spice);
  var h = '<div class="o-q">' + oIcon(sp.length === 2 ? 'qty_2' : 'qty_1', sp.length === 2 ? '两根' : '一根') + '</div>';
  if (same) return h + '<div class="o-row">' + orderIcons(sp[0]) + '</div>';
  return h + '<div class="o-row"><i class="o-n">①</i>' + orderIcons(sp[0]) + '</div><div class="o-row"><i class="o-n">②</i>' + orderIcons(sp[1]) + '</div>';
}
// 熟度条用醒目的分段色：生 蓝 → 嫩 绿 → 脆 黄 → 微焦 橙 → 焦 黑
function zoneCol(v) { return v < 40 ? '#5BB8F5' : v < 70 ? '#4CD06A' : v < 88 ? '#FFC21A' : v <= 100 ? '#FF6A3D' : '#2B2B2B'; }
var SAUS_ART = {raw:'raw', '嫩':'tender', '脆':'crispy', '微焦':'charred', burnt:'burnt', uneven:'half'};
var TOOL_SPOT = {'番茄':[494, 598, 50], '蜂蜜芥末':[546, 598, 50], '甜辣':[598, 598, 50]};   // 番茄酱和锅拉开一点
var SPICE_SPOT = {'孜然':[515, 768, 96], '辣椒':[617, 768, 96]};   // 孜然、辣椒盒同样大小，顶边对齐
function render() {
  if (!R) return;
  var L = R.L, g = L.goal, st = tutStep(), k, V = '?v=' + BUILD_V;
  var left = Math.max(0, L.time + (R.bonusT || 0) - R.t);

  // 教学讲解条 / HUD
  $('coach').hidden = !st;
  if (st) {
    var showBtn = st.btn && (!st.until || st.until());
    var pose = /做得好|全对|嫩嫩的了|交给你了/.test(st.text) ? 'happy' : (st.spot || st.drag || st.dragFn || st.handFn) ? 'point' : 'normal';
    setHTML('coach', '<img class="who" alt="王姐" src="' + SC + 'g_mascot_' + pose + '.webp' + V + '"><div class="step">' + R.tut.label + ' ' + (R.tut.i + 1) + ' / ' + R.tut.steps.length + '</div>' +
      '<p>' + st.text + '</p>' + (st.extra ? st.extra() : '') + '<div class="row"><button class="skip" data-act="tutskip">' + (R.tut.steps === TUT ? '跳过教学' : '跳过') + '</button>' + (st.btn2 ? '<button class="alt" data-act="' + st.btn2[1] + '" data-i="' + R.i + '">' + st.btn2[0] + '</button>' : '') +
      (showBtn ? '<button class="next" data-act="tutnext">' + st.btn + '</button>' : '') + '</div>');
  }
  var RES = './assets/img/res/';
  $('hud').classList.toggle('tut-hide', !!st);   // 王姐讲话时（教学和各关小课堂）先不出钱、爱心、时间
  setHTML('hud',
    '<div class="h-stat' + (g.money != null && R.net >= g.money ? ' done' : '') + '"><img alt="" src="' + RES + 'coin.webp' + V + '"><b>' + (R.net < 0 ? '-$' + (-R.net) : '$' + R.net) + (g.money != null ? '<small>/' + g.money + '</small>' : '') + '</b></div>' +
    '<div class="h-stat' + (g.hearts != null && R.hearts >= g.hearts ? ' done' : '') + (L.endless && R.hearts <= 2 ? ' low' : '') + '"><img alt="" src="' + RES + 'heart.webp' + V + '"><b>' + R.hearts + (g.hearts != null ? '<small>/' + g.hearts + '</small>' : '') + '</b></div>' +
    '<div class="h-stat' + (urgeHourglass() && blinkOn() ? ' hurry' : '') + '"><img alt="" src="' + RES + 'clock.webp' + V + '"><b>' + fmtT(L.endless ? R.t : left) + '</b></div>' +
    '<button class="h-pause" data-act="menu" aria-label="暂停"><i></i><i></i></button>' +
    (L.endless ? '' : '<div class="timebar"><i style="width:' + Math.min(100, left / (L.time + (R.bonusT || 0)) * 100) + '%"></i></div>'));
  setHTML('itembar', itemBar());
  $('speaker').className = 'speaker' + spot('speaker');

  // 顾客：三个位置，气泡在头顶
  var q = '';
  for (k = 0; k < MAXQ; k++) {
    var c = R.cust[k];
    if (!c) { q += '<div class="cust empty"></div>'; continue; }
    var r = Math.max(0, c.pat / c.patMax), cls = 'cust', style = '';
    if (c.state === 'wait' && anyBox(function (b) { return b.stage === 'box'; })) cls += ' ready';
    if (c.state === 'wait' && drag && drag.type === 'bag' && drag.over === c.id) cls += ' drop';
    if (G.up.cam && c.state === 'flee') cls += ' cam';   // 门口监控：逃单的人开溜时整个人描一圈黄光
    if (c.state === 'flee') style = walkStyle(1 - c.timer / 3.2);
    if (c.state === 'leave') style = walkStyle(1 - c.timer / 1);
    if (c.tag) cls += spot(c.tag);
    var mood = custMood(c); if (mood) cls += ' ' + mood;
    var clickable = c.state !== 'leave' || (c.served && !c.accused);
    q += '<div class="' + cls + '"' + style + (clickable ? ' data-act="cust" data-i="' + c.id + '"' : '') + (c.state === 'wait' ? ' data-cid="' + c.id + '"' : '') + (c.tag ? ' data-tag="' + c.tag + '"' : '') + '>' +
      '<div class="bubble">' + (c.say ? '<div class="say">' + c.say + '</div>' : orderHTML(c)) +
      (c.state === 'wait' ? '<div class="pat"><i style="width:' + (r * 100) + '%;background:' + patColor(r) + '"></i></div>' : '') + '</div>' +
      '<img class="who" alt="' + c.name + '" src="' + custArt(c) + '">' + (mood ? '<i class="mood">' + (mood === 'angry' ? '💢' : '💦') + '</i>' : '') + (c.got ? '<i class="minibag"></i>' : '') + '</div>';
  }
  $('queue').innerHTML = q;

  // 锅：四道凹槽，每道一个锅位
  var ost = typeof oilState === 'function' && typeof STICKY_V2 !== 'undefined' && STICKY_V2 ? oilState() : (has('oil') && R.oil < 25 ? 1 : 0);
  var sticky = ost > 0, tNow = now(), v2 = typeof STICKY_V2 !== 'undefined' && STICKY_V2;
  var info = $('grillInfo');
  info.textContent = !R.fire ? (R.heat > .05 ? '正在熄火…' : '已停火') : R.heat < .95 ? '正在升温…' : ost === 2 ? '锅干了！快加油' : sticky ? '粘锅了！快加油' : '点烤肠翻面';
  info.className = sticky && R.fire ? 'warn' : '';
  $('grill').className = 'grill' + (R.heat < .5 ? ' off' : '');
  var lv = R.heatLv == null ? 1 : R.heatLv;
  var gs = !R.fire ? 'off' : 'sml'.charAt(fireUp() ? lv : 1);
  var gb = $('gbody'), gsrc = SC + 'grill_' + gs + '.webp' + V; if (gb.getAttribute('src') !== gsrc) gb.setAttribute('src', gsrc);
  setHTML('fireCtl', (fireUp() ? '<i class="kl k1">小</i><i class="kl k2">中</i><i class="kl k3">大</i>' : '<i class="kl k2">开</i>') +
    '<button class="knob' + (R.fire ? ' on' : '') + spot('fire') + '" data-act="fire" aria-label="' + (R.fire ? '停火' : '点火') + '"></button>');
  var slotsEl = $('slots'), html = '';
  for (var i = 0; i < 4; i++) {
    var sl = R.slots[i];
    if (!sl) { html += '<div class="slot off"></div>'; continue; }
    var lockTut = !!st && i !== 0;
    if (sl.dirt) {
      var hit = sl.scrub || 0;
      html += '<div class="slot"><div class="slot-btn dirt p' + (sl.scrub || 0) + (i === 0 ? spot('scrape0') : '') + '" data-rub="' + i + '">' +
        '<i class="gb g1"></i><i class="gb g2"></i><i class="gb g3"></i><i class="gb g4"></i><i class="gb g5"></i><i class="gb g6"></i><i class="gb g7"></i></div></div>';
      continue;
    }
    if (!sl.s) {
      html += '<div class="slot"><button class="slot-btn' + (lockTut ? ' locked' : '') + (i === 0 ? spot('place0') : '') + '" data-act="place" data-i="' + i + '"><i class="plus"></i><b>' + (R.stock > 0 ? '放一根' : '先串肠') + '</b><small>$' + COST + '</small></button></div>';
      continue;
    }
    var s = sl.s, j = judge(s), up = s.down === 'a' ? 'b' : 'a', jolt = sl.jolt && tNow - sl.jolt < 260;
    var m = function (lab, v, isDown) {
      return '<div class="meter' + (isDown ? ' down' : '') + '"><i style="width:' + Math.min(100, v) + '%;background:' + zoneCol(v) + '"></i>' +
        [40, 70, 88].map(function (x) { return '<span class="tk" style="left:' + x + '%"></span>'; }).join('') + '</div>';
    };
    html += '<div class="slot' + (sticky ? ' sticky' : '') + (ost === 2 ? ' dry' : '') + (jolt ? ' jolt' : '') + (i === 0 ? spot('slot0') : '') + '">' +
      '<span class="tag ' + j + '">' + ({raw:'还生', burnt:'焦了！'}[j] || JUDGE_TEXT[j]) + '</span>' +
      (sticky ? '<i class="stk s1"></i><i class="stk s2"></i><i class="stk s3"></i><i class="stk s4"></i><i class="stk s5"></i>' : '') +
      (v2 && sticky ? '<span class="stuck">' + (ost === 2 ? '干锅' : '粘锅') + (sl.pry ? ' ' + sl.pry + '/' + (ost === 2 ? 3 : 2) : '') + '</span>' : '') +
      '<div class="saus-area tap' + (i === 0 ? spot('flip0') : '') + '" data-act="flip" data-i="' + i + '"><img class="saus-img' + (j === 'burnt' ? ' smoke' : '') + '" alt="" src="' + SC + 's_' + (SAUS_ART[j] || 'raw') + '_' + (i + 1) + '.webp' + V + '"></div>' +
      '<div class="meters">' + m('上', s[up], false) + m('下', s[s.down], true) + '</div>' +
      '</div>';
  }
  setHTML('slots', html);

  // 油壶 + 竹签筒
  var tools = '';
  if (has('oil')) tools += '<button class="oilcan' + (v2 && sticky ? ' low' : '') + '" data-act="oil" aria-label="加油"><img alt="" src="' + SC + 'oil.webp' + V + '"><b>加油</b></button>' +
    '<div class="oilgauge' + (R.oil < (typeof OIL_STICKY !== 'undefined' ? OIL_STICKY : 25) ? ' low' : '') + '"><em>油量</em><span class="og-bar"><i style="width:' + Math.round(R.oil) + '%"></i><u style="left:' + (typeof OIL_STICKY !== 'undefined' ? OIL_STICKY : 25) + '%"></u></span></div>';
  if (has('skewer')) tools += '<button class="sticks" data-act="skewer"' + (R.stock >= SKEWER_MAX ? ' disabled' : '') + ' aria-label="串一根"><img alt="" src="' + SC + 'sticks.webp' + V + '"><b>串一根 ' + R.stock + '/' + SKEWER_MAX + '</b></button>';
  setHTML('gtools', tools);

  // 酱瓶 / 调料盒（按住拖到盒里的烤肠上）
  var canTop = anyBox(function (b) { return b.stage === 'open' && b.items.length; }), off = canTop ? '' : ' disabled', tl = '';
  L.sauces.forEach(function (v) {
    var p = TOOL_SPOT[v] || [492, 598, 52], f = {'番茄':'ketchup', '蜂蜜芥末':'mustard', '甜辣':'sweetchili'}[v];
    tl += '<button class="tool bottle' + spot('tool-' + v) + '" data-tool="sauce" data-v="' + v + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px;width:' + p[2] + 'px"' + off + '><img alt="" src="' + SC + f + '.webp' + V + '"><span>' + SHORT[v] + '</span></button>';
  });
  L.spices.forEach(function (v) {
    var p = SPICE_SPOT[v] || [508, 748, 106], f = {'孜然':'cumin', '辣椒':'chili'}[v] || 'cumin';
    tl += '<button class="tool spicebox" data-tool="spice" data-v="' + v + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px;width:' + p[2] + 'px"' + off + '><img alt="" src="' + SC + f + '.webp' + V + '"><span>' + v + '</span></button>';
  });
  setHTML('tools', tl);

  // 打包盒：三格，开着放烤肠 → 装盒 → 合上拖给客人
  var t0 = now();
  var panels = [0, 1, 2].map(function (k) {
    if (!boxOpen(k)) {
      return '<div class="bx locked" data-act="selbox" data-i="' + k + '"><img class="bx-img" alt="" src="' + SC + 'box_open.webp' + V + '"><div class="lockbody"><i class="lock"></i></div></div>';
    }
    var b = R.boxes[k], n = b.items.length, pf = b.fx && t0 - b.fx.t < 900 ? b.fx.kind : '';
    if (b.stage === 'box') {
      var lifted = drag && drag.type === 'bag' && drag.box === k;
      return '<div class="bx closed' + (k === R.sel ? ' sel' : '') + spot('box' + k) + '" data-box="' + k + '" data-act="selbox" data-i="' + k + '">' +
        '<div class="bagwrap' + spot('bag' + k) + (lifted ? ' lifted' : '') + (pf === 'box' ? ' fresh' : '') + '" data-bag="' + k + '"><img class="bx-img" alt="" src="' + SC + 'box_closed.webp' + V + '"><span class="bx-n">' + (n === 2 ? '两根' : '一根') + '</span></div>' +
        '<div class="bx-tip">拖给客人 ↑</div></div>';
    }
    var items = [0, 1].map(function (j) {
      var t = b.items[j];
      if (!t) return '<div class="bitem empty"></div>';
      var fresh = t.fx && t0 - t.fx.t < 900 ? t.fx.kind : '';
      return '<div class="bitem' + spot('item' + k + j) + (k === 0 && t.band === '脆' ? spot('crisp') : '') + '" data-item="' + k + '-' + j + '">' + traySvg(t, fresh) +
        '<span><b class="bd-' + t.band + '">' + (JUDGE_TEXT[t.band] || t.band) + '</b>' + (t.sauce ? SHORT[t.sauce].replace('酱', '') : '无酱') + (L.spices.length ? '·' + (t.spice || '无料') : '') + '</span></div>';
    }).join('');
    return '<div class="bx' + (k === R.sel ? ' sel' : '') + spot('box' + k) + '" data-box="' + k + '" data-act="selbox" data-i="' + k + '">' +
      '<img class="bx-img" alt="" src="' + SC + 'box_open.webp' + V + '"><div class="bx-items">' + items + '</div>' +
      '<button class="bx-dump" data-act="dump" data-i="' + k + '"' + (n ? '' : ' disabled') + ' aria-label="倒掉">倒掉</button>' +
      '<button class="bx-pack' + spot('pack' + k) + '" data-act="pack" data-i="' + k + '"' + (n ? '' : ' disabled') + '>装盒</button></div>';
  });
  setHTML('trayBox', panels.join(''));   // 智能机器的用法写在商店介绍里，局中不再显示
  if (st) placeCoach(st);
}
// 讲解框放在不挡目标的那一头：目标在画面上半部分 → 讲解框放到底部，反之放顶部
function placeCoach(st) {
  var sel = st.hand && st.hand !== '[data-act=tutnext]' ? st.hand : st.handFn ? st.handFn() : st.drag ? st.drag[1] : st.dragFn ? st.dragFn()[1] : null;
  if (!sel && st.spot) sel = '.spot';
  var el = sel && document.querySelector('#stage ' + sel), stg = $('stage').getBoundingClientRect(), bottom = false;
  if (el) { var r = el.getBoundingClientRect(); bottom = (r.top + r.height / 2 - stg.top) < stg.height * .5; }
  $('coach').className = 'coach' + (bottom ? ' bottom' : '');
}

/* ============ 竖屏适配：内容高于屏幕时整体等比缩小 ============ */
// 「添加到主屏幕」打开时（状态栏透明），iOS 报告的页面高度会少一截状态栏，底部留出一条空白。
// 这种模式下按整块屏幕的真实高度来铺满所有全屏层。
function isStandalone() { return !!(navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)); }
function realH() {
  // 状态栏改成不透明后，iOS 给网页的区域就是状态栏以下的整块，innerHeight 就是真实可用高度，不再自己补
  return window.innerHeight || document.documentElement.clientHeight;
  var h = window.innerHeight || document.documentElement.clientHeight;
  if (isStandalone() && screen && screen.height) {
    var portrait = (window.innerWidth || 0) < (window.innerHeight || 1);
    var sh = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
    if (sh > h) h = sh;
  }
  return h;
}
// 排查用：各种「屏幕高度」的读数
function viewDiag() {
  var pr = document.createElement('div');
  pr.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:100lvh;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none';
  document.body.appendChild(pr);
  var cs = getComputedStyle(pr), lvh = pr.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  var out = 'in ' + innerWidth + '×' + innerHeight + ' · cl ' + document.documentElement.clientHeight + ' · lvh ' + Math.round(lvh) +
    ' · vv ' + (window.visualViewport ? Math.round(visualViewport.height) : '-') + ' · 屏 ' + screen.width + '×' + screen.height +
    ' · 安全区 ' + parseFloat(cs.paddingTop) + '/' + parseFloat(cs.paddingBottom) + ' · app ' + Math.round(($('app') || document.body).getBoundingClientRect().height) +
    ' · sa ' + (document.documentElement.classList.contains('sa') ? 1 : 0);
  pr.parentNode.removeChild(pr);
  return out;
}
function syncAppH() {
  var de = document.documentElement, h = realH();
  de.style.setProperty('--appH', h + 'px');
  de.classList.toggle('sa', isStandalone() && h > (window.innerHeight || 0));
}
syncAppH();
window.addEventListener('resize', syncAppH);
function fit() {
  // 主界面是 720×1280 的舞台：整张等比缩小到放得下，左右 / 上下空出来的地方由背景图铺满
  var st = $('stage'); if (!st) return;
  syncAppH();
  var W = window.innerWidth || document.documentElement.clientWidth, H = realH();
  var sc = Math.min(W / 720, H / 1280);
  st.style.transform = 'scale(' + sc.toFixed(4) + ')';
  st.style.setProperty('--topgap', Math.max(0, (H - 1280 * sc) / 2 / sc).toFixed(1) + 'px');   // 舞台上方多出来的空白（舞台像素）
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', function () { setTimeout(fit, 200); });

/* ============ 弹层 ============ */
function showOverlay(html, cls) { var o = $('overlay'); o.innerHTML = '<div class="card' + (cls ? ' ' + cls : '') + '">' + html + '</div>'; o.hidden = false; o.scrollTop = 0; }
function hideOverlay() { $('overlay').hidden = true; }
var menuShopOpen = false;   // 开始菜单里的道具商店：点按钮展开 / 收起
function menu() {
  if (R && !R.over) R.paused = true;
  clearGuide();
  var cur = Math.min(G.cleared, 9);
  var inGame = R && !R.over && !R.demo;
  if (!inGame) return showMap();
  return pausePop();
  showOverlay('<div class="kicker">' + (inGame ? '已暂停 · 第 ' + (R.i + 1) + ' 关 · ' + R.L.name : '放学时间 · 17:00 · 实验二小东门') + '</div>' +
    '<h1>校门口<em>烤肠摊</em></h1>' +
    (inGame ? pauseShop(R.L.endless) : '') +
    (inGame ? '' : '<p>一根 <span class="price">$3</span>，两根 <span class="price">$5</span>。</p>') +
    (inGame ? '' : '<div class="lvgrid">' + LEVELS.map(function (L, i) {
      if (L.endless) {
        var best = G.best || {money:0, time:0}, open = G.cleared >= ENDLESS;
        return '<button class="lvbtn endless" data-act="intro" data-i="' + i + '"' + (open ? '' : ' disabled') + '>' +
          '<i class="no">课外活动</i><b>无尽模式</b><span>' + (open ? (best.money ? '最高 $' + best.money + ' · 最久 ' + fmtT(best.time) : '口碑扣光前，能赚多少？') : '通关第 10 关解锁') + '</span></button>';
      }
      return '<button class="lvbtn' + (i < G.cleared ? ' done' : '') + (i === cur ? ' cur' : '') + '" data-act="intro" data-i="' + i + '"' + (i > G.cleared ? ' disabled' : '') + '>' +
        '<i class="no">第 ' + (i + 1) + ' 课</i><b>' + L.name.replace('教学关·', '') + '</b><span>' + (L.tutorial ? '教学 · ' : '') + goalText(L.goal) + '</span></button>';
    }).join('') + '</div>') +
    '<div class="actions">' + (R && !R.over && !R.demo ? '<button class="b hot" data-act="resume">继续这一局</button><button class="b red" data-act="go" data-i="' + R.i + '">重玩本关</button>' : '<button class="b red" data-act="intro" data-i="' + cur + '">' + (G.cleared ? '继续第 ' + (cur + 1) + ' 关' : '开始教学') + '</button>') +
    '<button class="b" data-act="shop">升级小摊</button>' +
    (inGame ? '' : '<button class="b' + (menuShopOpen ? ' on' : '') + '" data-act="menushop">道具商店 ' + (menuShopOpen ? '▴' : '▾') + '</button>') +
    '<button class="b" data-act="music">背景音乐：' + (musicOn() ? '开' : '关') + '</button>' +
    (inGame ? '<button class="b wide" data-act="quit">退出到关卡列表</button>' : '') + '</div>' +
    (!inGame && menuShopOpen ? pauseShop(false) : ''));
}
// 暂停：顶部标签头 + 右上角关闭 + 背景音乐 / 音效音量 + 重玩本关 + 回地图 / 继续游戏（参考美术暂停图）
var ICON_BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z" fill="#B97A5A"/><path d="M12 6v13.5" stroke="#FBF0E1" stroke-width="1.6"/></svg>';
var ICON_SPK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#B97A5A"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="#B97A5A" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
var ICON_NOTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5V5.5l11-2.5v12" stroke="#B97A5A" stroke-width="2.4" fill="none" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="#B97A5A"/><circle cx="17.5" cy="15" r="3" fill="#B97A5A"/></svg>';
function pausePop() {
  var V = '?v=' + BUILD_V, vm = Math.round(musicVol() * 100), vs = Math.round(sfxVol() * 100);
  var SPK = ICON_SPK, NOTE = ICON_NOTE;
  var _unused = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#B97A5A"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="#B97A5A" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
  var _unused2 = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5V5.5l11-2.5v12" stroke="#B97A5A" stroke-width="2.4" fill="none" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="#B97A5A"/><circle cx="17.5" cy="15" r="3" fill="#B97A5A"/></svg>';
  showOverlay('<div class="ps">' +
    '<div class="ps-props"><img class="pp-tongs" alt="" src="./assets/img/pause/tongs.webp' + V + '"><img class="pp-ketchup" alt="" src="./assets/img/pause/ketchup.webp' + V + '">' +
      '<img class="pp-sausage" alt="" src="./assets/img/pause/sausage.webp' + V + '"><img class="pp-mustard" alt="" src="./assets/img/pause/mustard.webp' + V + '"></div>' +
    '<div class="ps-tab">暂停</div>' +
    '<button class="ps-x" data-act="resume" aria-label="关闭"></button>' +
    '<div class="ps-panel">' +
      '<div class="st-row"><span class="st-name">音乐音量</span><input class="ps-range" type="range" min="0" max="100" step="5" value="' + vm + '" data-vol="m" style="--p:' + vm + '%" aria-label="背景音乐音量"></div>' +
      '<div class="st-row"><span class="st-name">音效音量</span><input class="ps-range" type="range" min="0" max="100" step="5" value="' + vs + '" data-vol="s" style="--p:' + vs + '%" aria-label="音效音量"></div>' +
      '<div class="ps-div"></div>' +
      '<button class="rp-btn sub ps-wide" data-act="go" data-i="' + R.i + '">重玩本关</button>' +
      '<div class="ps-bottom"><button class="ps-home" data-act="quit" aria-label="回到地图"><img alt="" src="./assets/img/res/ic_home.webp' + V + '"></button>' +
      '<button class="rp-btn main ps-go" data-act="resume">继续游戏</button></div>' +
    '</div></div>', 'lvpop');
}
document.addEventListener('input', function (e) {
  var t = e.target; if (!t || !t.getAttribute || !t.getAttribute('data-vol')) return;
  var v = +t.value; t.style.setProperty('--p', v + '%'); setVol(t.getAttribute('data-vol'), v);
  if (t.getAttribute('data-vol') === 's') ding(880, .06);
});
// 关卡开场：过关目标 + 时间 + 锅位 三张卡片
function goalCards(L) {
  if (L.endless) {
    return '<div class="gcs"><div class="gc main"><span>玩法</span><b>口碑 ❤' + ENDLESS_HEARTS + '<br>扣光收摊</b></div>' +
      '<div class="gc"><span>营业时间</span><b>不限时</b></div>' +
      '<div class="gc"><span>锅位</span><b>' + L.slots + ' 个</b></div></div>';
  }
  var g = L.goal, goal = [];
  if (g.money != null) goal.push('净赚 $' + g.money);
  if (g.hearts != null) goal.push('❤ ' + g.hearts + ' 颗');
  return '<div class="gcs"><div class="gc main"><span>过关目标</span><b>' + goal.join('<br>') + '</b></div>' +
    '<div class="gc"><span>营业时间</span><b>' + L.time + ' 秒</b></div>' +
    '<div class="gc"><span>锅位</span><b>' + L.slots + ' 个</b></div></div>';
}
// 关卡开场弹窗：星星 + 飘带标题 + 奶油面板（目标 / 营业时间 / 本关新内容 / 带上道具）+ 开始按钮
var introIdx = 0;
function intro(i) {
  introIdx = i;
  var L = LEVELS[i], POP = './assets/img/pop/', V = '?v=' + BUILD_V, done = !L.endless && i < G.cleared;
  var g = L.goal || {}, goal = [];
  if (L.endless) goal.push('口碑 ❤' + ENDLESS_HEARTS + '，扣光收摊');
  else { if (g.money != null) goal.push('净赚 <em>$' + g.money + '</em>'); if (g.hearts != null) goal.push('<em>❤ ' + g.hearts + '</em> 颗'); }
  var stars = '';
  for (var k = 0; k < 3; k++) stars += '<img class="s' + k + '" alt="" src="' + POP + (done ? 'star' : 'star_empty') + '.webp' + V + '">';
  var boost = L.tutorial ? '' : '<div class="lp-sec">带上道具</div><div class="lp-boost">' + ITEMS.map(function (it, idx) {
    var off = it.id === 'hourglass' && L.endless, have = G.items[it.id] || 0;
    return '<div class="lp-item' + (off ? ' off' : '') + '"><div class="lp-slot"><img alt="" src="./assets/img/items/' + it.id + '.webp' + V + '">' +
      (have ? '<i class="lp-cnt">' + have + '</i>' : '') + '</div><b>' + (it.bar || it.name) + '</b>' +
      '<button class="lp-buy" data-act="buyitem" data-i="' + idx + '"' + (G.bank < it.cost || off ? ' disabled' : '') + '>$' + it.cost + '</button></div>';
  }).join('') + '</div><div class="lp-bank">存款 $' + G.bank + '</div>';
  showOverlay('<div class="lp">' +
    '<div class="lp-ribbon"><small>' + (L.endless ? '课外活动' : '第 ' + (i + 1) + ' 关') + '</small><b>' + L.name.replace('教学关·', '') + '</b></div>' +
    '<div class="lp-panel">' +
      '<div class="lp-sec">过关目标</div><div class="lp-goal">' + goal.join('<span class="plus">+</span>') + '</div>' +
      (boost ? '<div class="lp-div"></div>' + boost : '') +
      '<button class="lp-play" data-act="go" data-i="' + i + '"><img alt="" src="' + POP + 'play.webp' + V + '"><span>' + (L.tutorial ? '开始教学' : '开始出摊') + '</span></button>' +
    '</div>' +
  '</div>', 'lvpop');
  addBack('menu');
}
// 结算弹窗：飘带标题 + 三行成绩（金币 / 爱心或时间 / 成交）+ 存款条 + 主按钮 + 一排圆形小按钮（参考美术结算预览图）
// 过关时星星背后的放射光（内联 SVG：16 道渐隐光束，慢慢转）
var RAYS_SVG = (function () {
  var r = '', n = 16;
  for (var k = 0; k < n; k++) {
    var a = k / n * Math.PI * 2, w = Math.PI / n * .55, R = 200;
    var x1 = (Math.cos(a - w) * R).toFixed(1), y1 = (Math.sin(a - w) * R).toFixed(1), x2 = (Math.cos(a + w) * R).toFixed(1), y2 = (Math.sin(a + w) * R).toFixed(1);
    r += '<path d="M0 0L' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'Z"/>';
  }
  return '<svg class="rp-rays" viewBox="-200 -200 400 400" aria-hidden="true"><defs><radialGradient id="rpRay" cx="0" cy="0" r="200" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0" stop-color="#FFF6C8" stop-opacity=".95"/><stop offset=".45" stop-color="#FFD35A" stop-opacity=".45"/><stop offset="1" stop-color="#FFB830" stop-opacity="0"/></radialGradient></defs>' +
    '<g fill="url(#rpRay)">' + r + '</g></svg>';
})();
function resultPop(o) {
  var RES = './assets/img/res/', POP = './assets/img/pop/', V = '?v=' + BUILD_V, stars = '';
  if (o.win) for (var k = 0; k < 3; k++) stars += '<img class="s' + k + '" alt="" src="' + POP + 'star.webp' + V + '">';
  var cells = o.stats.map(function (st) {
    return '<div class="rp-cell"><img alt="" src="' + RES + st.icon + '.webp' + V + '"><b' + (st.bad ? ' class="bad"' : '') + '>' + st.val + '</b><i>' + st.label + '</i></div>';
  }).join('');
  var btn = function (b, cls) {
    return '<button class="' + cls + '" data-act="' + b.act + '"' + (b.i != null ? ' data-i="' + b.i + '"' : '') + '><span>' + b.label + '</span></button>';
  };
  var icons = (o.icons || []).map(function (ic) {
    return '<button class="rp-ib" data-act="' + ic.act + '"' + (ic.i != null ? ' data-i="' + ic.i + '"' : '') + '><img alt="" src="' + RES + ic.img + '.webp' + V + '"><small>' + ic.label + '</small></button>';
  }).join('');
  showResult('<div class="lp rp' + (o.win ? ' win' : '') + '">' +
    (stars ? '<div class="rp-stars">' + RAYS_SVG + '<i class="rp-glow"></i>' + stars +
      '<i class="rp-spark k1"></i><i class="rp-spark k2"></i><i class="rp-spark k3"></i><i class="rp-spark k4"></i><i class="rp-spark k5"></i></div>' : '') +
    '<div class="lp-ribbon"><b>' + o.title + '</b></div>' +
    '<div class="lp-panel">' +
      '<div class="rp-box"><div class="rp-cap">本关成绩</div><div class="rp-cells">' + cells + '</div></div>' +
      '<div class="rp-btns">' + btn(o.primary, 'rp-btn main') + (o.secondary ? btn(o.secondary, 'rp-btn sub') : '') + '</div>' +
      (icons ? '<div class="rp-icons">' + icons + '</div>' : '') +
    '</div>' +
  '</div>', 'lvpop');
  addBack('menu');
}
function resultIcons(retryI) {
  return [{act:'go', i:retryI, img:'ic_retry', label:'再玩'}, {act:'menu', img:'ic_levels', label:'地图'},
          {act:'shop', img:'ic_upgrade', label:'升级'}, {act:'resitems', img:'ic_shop', label:'道具'}, {act:'share', img:'ic_share', label:'分享'}];
}
function finish(win, why) {
  R.over = true; clearDemo(); render();
  var gain = Math.max(0, R.net); G.bank += gain;
  if (win && R.i + 1 > G.cleared) G.cleared = R.i + 1;
  save();
  var s = R.st, i = R.i;
  shareInfo = {endless:false, win:win, why:why, lv:i + 1, name:R.L.name.replace('教学关·', ''), net:R.net, hearts:R.hearts, sold:s.sold};
  var o = {win:win, sub:'第 ' + (i + 1) + ' 关 · ' + R.L.name.replace('教学关·', ''),
    title: win ? (i === 9 ? '校门口之王！' : '目标达成！') : why === 'hearts' ? '爱心扣光了…' : '差一点点…',
    stats:[{icon:'coin', val:(R.net < 0 ? '-$' + (-R.net) : '$' + R.net), label:'本关净赚', bad:R.net < 0}, {icon:'heart', val:R.hearts, label:'剩余爱心'}, {icon:'orders', val:s.sold, label:'成交单数'}]};
  if (win) {
    o.primary = i < 9 ? {act:'intro', i:i + 1, label:'下一关'} : {act:'intro', i:ENDLESS, label:'挑战无尽模式'};
    o.icons = resultIcons(i);
  } else {
    o.primary = {act:'go', i:i, label:'再来一次'};
    o.secondary = {act:'menu', label:'回到地图'};
    o.icons = resultIcons(i).slice(2);   // 失败时：升级 / 道具 / 分享
  }
  resultPop(o);
}
function finishEndless() {
  R.over = true; clearDemo(); render();
  var gain = Math.max(0, R.net); G.bank += gain;
  var best = G.best || {money:0, time:0}, rec = R.net > best.money;
  G.best = {money:Math.max(best.money, R.net), time:Math.max(best.time, Math.floor(R.t))};
  save();
  shareInfo = {endless:true, rec:rec, net:R.net, time:R.t, sold:R.st.sold, best:G.best.money};
  resultPop({win:rec, sub:'无尽模式 · 最高 $' + G.best.money, title:rec ? '新纪录！' : '口碑扣光了',
    stats:[{icon:'coin', val:(R.net < 0 ? '-$' + (-R.net) : '$' + R.net), label:'本局净赚', bad:R.net < 0}, {icon:'clock', val:fmtT(R.t), label:'坚持时间'}, {icon:'orders', val:R.st.sold, label:'成交单数'}],
    primary:{act:'go', i:ENDLESS, label:'再来一局'}, icons:resultIcons(ENDLESS).slice(1)});
}
function resultItems() { itemShop('shareback'); }
function pauseShop(endless) {
  return '<div class="pshop" data-endless="' + (endless ? 1 : 0) + '"><div class="pshop-h">道具商店<small>存款 $' + G.bank + '</small></div><div class="prow">' + ITEMS.map(function (it, idx) {
    var off = it.id === 'hourglass' && endless;
    return '<div class="pitem' + (off ? ' off' : '') + '"><i>' + it.icon + '</i><b>' + it.name + '</b><small>' + (off ? '无尽模式不可用' : it.short) + '</small>' +
      '<span>已有 ' + (G.items[it.id] || 0) + '</span><button class="b hot" data-act="buyitem" data-i="' + idx + '"' + (G.bank < it.cost || off ? ' disabled' : '') + '>$' + it.cost + '</button></div>';
  }).join('') + '</div></div>';
}
/* ============ 分享战绩：画一张战绩卡 → 发小红书笔记 / 存相册 ============ */
var shareInfo = null, lastResult = null, shareURL = '';
function showResult(html, cls) { lastResult = {html:html, cls:cls}; showOverlay(html, cls); }
// 所有弹出页面的返回键统一放在屏幕左上角（和地图页同一位置）
function addBack(act) {
  var o = $('overlay'); if (!o) return;
  var b = document.createElement('button'); b.className = 'pg-back'; b.setAttribute('data-act', act); b.setAttribute('aria-label', '返回');
  b.innerHTML = '<img alt="" src="./assets/img/ui/ui_back.webp?v=' + BUILD_V + '">'; o.appendChild(b);
}
function hasBridge() { return !!(window.xhs && window.xhs.miniTool && typeof window.xhs.miniTool.postNote === 'function'); }
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// 分享文案：三套口吻，每次打开分享随机一套（卡片标语、笔记标题、正文保持同一套）
var SHARE_COPY = [
  {title:'我在校门口卖烤肠！', tag:'你能比我卖得好吗？',
   lv:function (i, v) { return '第 ' + i.lv + ' 关「' + i.name + '」' + v + '净赚 $' + i.net + '，爱心 ' + i.hearts + '，成交 ' + i.sold + ' 单。你能比我卖得好吗？'; },
   en:function (i) { return '在实验二小门口的无尽模式里坚持了 ' + fmtT(i.time) + '，净赚 $' + i.net + '，成交 ' + i.sold + ' 单！' + (i.rec ? '刷新了最高纪录～' : '') + '你能坚持更久吗？'; }},
  {title:'放学铃一响，我的烤肠摊开张了', tag:'来校门口跟我比比？',
   lv:function (i, v) { return '放学铃一响就开摊！第 ' + i.lv + ' 关「' + i.name + '」' + v + '今天净赚 $' + i.net + '，收获爱心 ' + i.hearts + ' 颗，卖出 ' + i.sold + ' 单。来实验二小门口跟我比比？'; },
   en:function (i) { return '放学铃一响就开摊！无尽模式守了 ' + fmtT(i.time) + '，卖出 ' + i.sold + ' 单，净赚 $' + i.net + '。' + (i.rec ? '又破纪录啦～' : '') + '来实验二小门口跟我比比？'; }},
  {title:'今日烤肠摊战报来啦', tag:'香味飘进校门啦，你也来试试！',
   lv:function (i, v) { return '烤肠摊老板打卡：第 ' + i.lv + ' 关「' + i.name + '」' + v + '$' + i.net + ' 进账、爱心 ' + i.hearts + '、成交 ' + i.sold + ' 单～香味都飘进校门了，你也来试试？'; },
   en:function (i) { return '烤肠摊老板打卡：无尽模式撑了 ' + fmtT(i.time) + '，' + i.sold + ' 单、$' + i.net + ' 进账～' + (i.rec ? '新纪录到手！' : '') + '香味都飘进校门了，你也来试试？'; }}
];
var shareCopy = SHARE_COPY[0];
function drawShareCard(info) {
  var W = 720, H = 960, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var c = cv.getContext('2d'), F = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif', K = '"Kaiti SC","STKaiti","KaiTi",' + F;
  var good = info.win || info.rec, k, x;
  c.fillStyle = '#E8EDE2'; c.fillRect(0, 0, W, H);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  // 黑板 HUD
  rr(c, 24, 24, W - 48, 160, 12); c.fillStyle = '#9A6A3F'; c.fill();
  rr(c, 32, 32, W - 64, 144, 8); c.fillStyle = '#2F4A3B'; c.fill();
  c.fillStyle = '#F3F1E6'; c.font = 'bold 36px ' + K;
  c.fillText(info.endless ? '无尽模式 · 校门口烤肠摊' : '第' + info.lv + '关 · ' + info.name, W / 2, 80);
  var stats = info.endless
    ? [['净赚', '$' + info.net], ['坚持', fmtT(info.time)], ['成交', info.sold + ' 单']]
    : [['净赚', '$' + info.net], ['爱心', '❤ ' + info.hearts], ['成交', info.sold + ' 单']];
  for (k = 0; k < 3; k++) {
    x = 48 + k * 212;
    rr(c, x, 100, 200, 60, 8); c.fillStyle = '#3A5A48'; c.fill();
    c.setLineDash([6, 5]); c.strokeStyle = 'rgba(243,241,230,.35)'; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
    c.textAlign = 'left'; c.fillStyle = 'rgba(243,241,230,.7)'; c.font = '22px ' + F; c.fillText(stats[k][0], x + 16, 139);
    c.textAlign = 'right'; c.fillStyle = '#F3F1E6'; c.font = 'bold 30px ' + F; c.fillText(stats[k][1], x + 186, 141);
  }
  c.textAlign = 'center';
  // 校门：天空 + 围墙
  c.save(); rr(c, 24, 200, W - 48, 300, 12); c.clip();
  c.fillStyle = '#F2EFE6'; c.fillRect(24, 200, W - 48, 300);
  var sky = c.createLinearGradient(0, 200, 0, 262); sky.addColorStop(0, '#BFE2F4'); sky.addColorStop(1, '#DDF0F8');
  c.fillStyle = sky; c.fillRect(24, 200, W - 48, 62);
  c.fillStyle = '#B5BDC5'; c.fillRect(24, 480, W - 48, 3);
  for (x = 24; x < W - 24; x += 16) c.fillRect(x, 480, 3, 20);
  c.restore();
  rr(c, 24, 200, W - 48, 300, 12); c.strokeStyle = '#CFC8B6'; c.lineWidth = 3; c.stroke();
  rr(c, 44, 218, 176, 52, 6); c.fillStyle = '#B81C16'; c.fill(); c.strokeStyle = '#E8B64A'; c.lineWidth = 3; c.stroke();
  c.fillStyle = '#FFD86B'; c.font = 'bold 32px ' + K; c.fillText('实 验 二 小', 132, 256);
  rr(c, 236, 218, W - 280, 52, 8); c.fillStyle = '#101820'; c.fill();
  c.textAlign = 'left'; c.fillStyle = '#9FB0C3'; c.font = '18px ' + F; c.fillText('收款音箱', 252, 250);
  c.fillStyle = '#4FBF7A'; c.font = 'bold 26px ' + F; c.fillText('今日到账 $' + info.net, 346, 253);
  c.textAlign = 'center';
  // 三位客人
  var who = [['🧒', '一年级·豆豆'], ['👧', '五年级·班长'], ['👩', '家长·王阿姨']];
  var says = good ? ['好香！', '再来一根！', '明天还来'] : ['还行吧', '有点焦…', '下次再来'];
  for (k = 0; k < 3; k++) {
    x = 44 + k * 216;
    rr(c, x, 290, 200, 176, 12); c.fillStyle = '#FFFDF5'; c.fill(); c.strokeStyle = good ? '#F5B82E' : '#E3DCCB'; c.lineWidth = 3; c.stroke();
    c.font = '60px ' + F; c.fillText(who[k][0], x + 100, 364);
    c.fillStyle = '#66717C'; c.font = '20px ' + F; c.fillText(who[k][1], x + 100, 398);
    rr(c, x + 18, 412, 164, 40, 20); c.fillStyle = '#EEF4FB'; c.fill(); c.strokeStyle = '#CFDFF0'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#C2410C'; c.font = 'bold 22px ' + F; c.fillText(says[k], x + 100, 440);
  }
  // 烤肠锅
  rr(c, 24, 516, W - 48, 200, 14);
  var st = c.createLinearGradient(0, 516, 0, 716); st.addColorStop(0, '#3A4450'); st.addColorStop(1, '#2A323C');
  c.fillStyle = st; c.fill(); c.strokeStyle = '#5B6673'; c.lineWidth = 6; c.stroke();
  c.textAlign = 'left'; c.fillStyle = '#EEF2F6'; c.font = 'bold 24px ' + F; c.fillText('烤肠锅', 46, 552);
  c.textAlign = 'center';
  var done = [74, 82, 92];
  for (k = 0; k < 3; k++) {
    x = 44 + k * 216;
    c.save(); rr(c, x, 568, 200, 128, 10); c.clip();
    c.fillStyle = '#20262E'; c.fillRect(x, 568, 200, 128);
    c.fillStyle = '#262E38'; for (var gx = x + 12; gx < x + 200; gx += 14) c.fillRect(gx, 568, 2, 128);
    var glow = c.createLinearGradient(0, 650, 0, 696); glow.addColorStop(0, 'rgba(242,120,40,0)'); glow.addColorStop(1, 'rgba(242,120,40,.45)');
    c.fillStyle = glow; c.fillRect(x, 650, 200, 46);
    c.restore();
    c.strokeStyle = '#D9C08E'; c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x + 14, 632); c.lineTo(x + 50, 632); c.stroke();
    rr(c, x + 36, 612, 150, 40, 20); c.fillStyle = col(done[k]); c.fill();
    c.strokeStyle = 'rgba(60,20,8,.45)'; c.lineWidth = 4;
    for (var m = 0; m < 4; m++) { c.beginPath(); c.moveTo(x + 66 + m * 28, 616); c.lineTo(x + 56 + m * 28, 648); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.3)'; rr(c, x + 50, 619, 120, 6, 3); c.fill();
  }
  // 课桌：战绩
  rr(c, 24, 732, W - 48, 204, 12); c.fillStyle = '#D9B685'; c.fill(); c.strokeStyle = '#9A6A3F'; c.lineWidth = 5; c.stroke();
  rr(c, 48, 752, W - 96, 164, 10); c.fillStyle = '#FFFDF5'; c.fill();
  c.save(); rr(c, 48, 752, W - 96, 164, 10); c.clip();
  c.strokeStyle = '#D8E5F1'; c.lineWidth = 2;
  for (var y = 792; y < 916; y += 40) { c.beginPath(); c.moveTo(48, y); c.lineTo(W - 48, y); c.stroke(); }
  c.fillStyle = '#E48A8A'; c.fillRect(48, 752, 6, 164);
  c.restore();
  var verdict = info.endless ? (info.rec ? '新纪录！' : '收摊了') : info.win ? '目标达成！' : info.why === 'hearts' ? '爱心扣光了…' : '差一点点…';
  c.fillStyle = good ? '#D7261E' : '#66717C'; c.font = 'bold 54px ' + F; c.fillText(verdict, W / 2, 818);
  var tag = info.endless && info.best ? '最高纪录 $' + info.best + '，' + shareCopy.tag : shareCopy.tag, fs = 30;
  c.fillStyle = '#27313A'; c.font = 'bold 30px ' + F;
  while (fs > 20 && c.measureText(tag).width > 400) { fs -= 2; c.font = 'bold ' + fs + 'px ' + F; }
  c.fillText(tag, W / 2, 864);
  c.fillStyle = '#B0413E'; c.font = '24px ' + F; c.fillText('#校门口烤肠摊', W / 2, 900);
  if (good) {
    c.save(); c.translate(W - 106, 812); c.rotate(-.25);
    c.strokeStyle = 'rgba(215,38,30,.8)'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 40, 0, Math.PI * 2); c.stroke();
    c.fillStyle = 'rgba(215,38,30,.85)'; c.font = 'bold 50px ' + F; c.textBaseline = 'middle'; c.fillText('★', 0, 3);
    c.restore();
  }
  return cv.toDataURL('image/png');
}
function shareText(info) {
  if (info.endless) return shareCopy.en(info);
  return shareCopy.lv(info, info.win ? '目标达成！' : '差一点点…');
}
function openShare() {
  if (!shareInfo) return;
  shareCopy = SHARE_COPY[Math.floor(Math.random() * SHARE_COPY.length)];
  try { shareURL = drawShareCard(shareInfo); } catch (e) { shareURL = ''; }
  var ok = hasBridge();
  showOverlay('<div class="kicker">分享战绩</div><h1>晒一晒</h1>' +
    (shareURL ? '<img class="sharecard" src="' + shareURL + '" alt="战绩卡">' : '<p>战绩卡生成失败，请再试一次。</p>') +
    '<p class="sub" id="shareMsg">' + (ok ? '发笔记时还能再改标题和正文。' : '在小红书里打开才能发笔记、存相册；现在可以长按图片保存。') + '</p>' +
    '<div class="actions"><button class="b red" data-act="sharenote"' + (ok && shareURL ? '' : ' disabled') + '>发小红书笔记</button>' +
    '<button class="b" data-act="savepic"' + (ok && shareURL ? '' : ' disabled') + '>存到相册</button>' +
    '<button class="b wide" data-act="shareback">返回</button></div>');
  addBack('shareback');
}
function shareMsg(t) { var m = $('shareMsg'); if (m) m.textContent = t; }
function postShareNote() {
  if (!hasBridge() || !shareURL) return;
  shareMsg('正在打开发布页…');
  window.xhs.miniTool.postNote({
    title: shareCopy.title,
    content: shareText(shareInfo),
    pageType: 'photo_publish',
    mediaInfo: {image_resources: [{url: shareURL}]},
    tags: '校门口烤肠摊'
  }).then(function () { shareMsg('发布页已打开，发出去让朋友来比比！'); })
    .catch(function (e) { shareMsg('没能打开发布页：' + ((e && e.errMsg) || '请稍后再试')); });
}
function saveSharePic() {
  if (!hasBridge() || !shareURL) return;
  shareMsg('正在保存…');
  window.xhs.miniTool.writeTempFile({data: shareURL})
    .then(function (r) { return window.xhs.miniTool.saveImageToPhotosAlbum({filePath: r.filePath}); })
    .then(function () { shareMsg('已存到相册'); })
    .catch(function (e) { shareMsg('没存成功：' + ((e && e.errMsg) || '可能没有相册权限')); });
}
function shopToggle(endless) {
  return '<button class="b" data-act="shoptoggle" data-i="' + (endless ? 1 : 0) + '">道具商店 ▾</button>';
}
// 结算页的道具商店按钮：在按钮区下方展开 / 收起道具条
function toggleResultShop(btn, endless) {
  var card = btn.closest('.card'), open = card.querySelector('.pshop');
  if (open) { open.parentNode.removeChild(open); btn.classList.remove('on'); btn.textContent = '道具商店 ▾'; return; }
  var tmp = document.createElement('div'); tmp.innerHTML = pauseShop(endless);
  card.appendChild(tmp.firstChild); btn.classList.add('on'); btn.textContent = '道具商店 ▴';
  var ps = card.querySelector('.pshop'); if (ps.scrollIntoView) ps.scrollIntoView({block:'nearest'});
}
function refreshItemStrip() {
  if (document.querySelector('#overlay .sp-items')) return itemShop();
  if (document.querySelector('#overlay .lp-boost')) return intro(introIdx);
  var box = document.querySelector('#overlay .pshop'); if (!box) return;
  var tmp = document.createElement('div'); tmp.innerHTML = pauseShop(box.getAttribute('data-endless') === '1');
  box.parentNode.replaceChild(tmp.firstChild, box);
  var bl = document.querySelector('#overlay .bankline b'); if (bl) bl.textContent = '$' + G.bank;
  var bv = document.querySelector('#overlay .bankv'); if (bv) bv.textContent = '$' + G.bank;
}
function shopBack(from) {
  // 从关卡开场进来 → 回开场；游戏暂停中进来 → 回暂停；否则回关卡列表
  var nxt = Math.min(G.cleared, 9);
  if (from != null && !isNaN(from)) return '<button class="b red" data-act="go" data-i="' + from + '">开始出摊</button><button class="b" data-act="intro" data-i="' + from + '">返回</button>';
  if (R && !R.over && !R.demo) return '<button class="b wide" data-act="menu">回到暂停</button>';
  if (R && R.over && !R.demo && lastResult) return '<button class="b red" data-act="shareback">返回结算</button><button class="b" data-act="menu">关卡列表</button>';
  return '<button class="b red" data-act="intro" data-i="' + nxt + '">去第 ' + (nxt + 1) + ' 关</button><button class="b" data-act="menu">关卡列表</button>';
}
// 框式弹窗（商店 / 设置共用）：顶部标签头 + 粗描边面板
function framePop(title, body, back, shopDeco) {
  var V = '?v=' + BUILD_V;
  var head = shopDeco
    ? '<img class="sp-awning" alt="" src="./assets/img/shop/awning.webp' + V + '"><div class="sp-ribbon"><img alt="" src="./assets/img/shop/ribbon.webp' + V + '"><b>' + title + '</b></div>'
    : '<div class="ps-tab sp-tab">' + title + '</div>';
  showOverlay('<div class="sp' + (shopDeco ? ' deco' : '') + '">' + head + '<div class="ps-panel sp-panel">' + body + '</div></div>', 'lvpop wide');
  if (back) addBack(back);
}
function priceBtn(act, i, cost, ok) {
  return '<button class="sp-price' + (ok ? '' : ' off') + '" data-act="' + act + '" data-i="' + i + '"' + (ok ? '' : ' disabled') + '><span><i class="cur">$</i>' + cost + '</span></button>';
}
function bankBar() { return '<div class="sp-bank"><img alt="" src="./assets/img/shop/bank.webp?v=' + BUILD_V + '"><b><i class="cur">$</i>' + G.bank + '</b></div>'; }
function shop() {
  var V = '?v=' + BUILD_V, inGame = R && !R.over && !R.demo, fromRes = R && R.over && !R.demo && lastResult, nxt = Math.min(G.cleared, 9);
  var rows = UPGRADES.map(function (u, idx) {
    var lv = G.up[u.id] || 0, maxed = lv >= u.max, c = u.cost[lv], ic = u.id === 'boxc' ? 'boxb' : u.id;
    return '<div class="sp-row"><span class="sp-ic"><img alt="" src="./assets/img/shop/up_' + ic + '.webp' + V + '"></span>' +
      '<span class="sp-txt"><b>' + u.name + (u.max > 1 ? '<em>' + lv + '/' + u.max + '</em>' : '') + '</b><small>' + u.desc + '</small></span>' +
      (maxed ? '<span class="sp-owned"><span>已拥有</span></span>' : priceBtn('buy', idx, c, G.bank >= c)) + '</div>';
  }).join('');
  var foot = inGame ? '<button class="sp-big go" data-act="menu"><span>回到暂停</span></button>'
    : fromRes ? '<button class="sp-big go" data-act="shareback"><span>返回结算</span></button><button class="sp-big list" data-act="menu"><span>关卡列表</span></button>'
    : '<button class="sp-big go" data-act="intro" data-i="' + nxt + '"><span>去第 ' + (nxt + 1) + ' 关</span></button><button class="sp-big list" data-act="menu"><span>关卡列表</span></button>';
  framePop('升级小摊', bankBar() + '<div class="sp-list">' + rows + '</div><div class="sp-foot">' + foot + '</div>',
    inGame ? 'menu' : fromRes ? 'shareback' : 'menu', true);
}
// 道具商店（地图 / 结算 两处进来，返回各回各的）
var itemShopBack = 'mapclose';
function itemShop(back) {
  itemShopBack = back || itemShopBack;
  var V = '?v=' + BUILD_V, endless = !!(R && R.over && !R.demo && R.L.endless);
  var rows = ITEMS.map(function (it, idx) {
    var off = it.id === 'hourglass' && endless, have = G.items[it.id] || 0;
    return '<div class="sp-row' + (off ? ' dim' : '') + '"><span class="sp-ic"><img alt="" src="./assets/img/items/' + it.id + '.webp' + V + '">' + (have ? '<i class="lp-cnt">' + have + '</i>' : '') + '</span>' +
      '<span class="sp-txt"><b>' + it.name + '</b><small>' + (off ? '无尽模式不可用' : it.desc) + '</small></span>' + priceBtn('buyitem', idx, it.cost, G.bank >= it.cost && !off) + '</div>';
  }).join('');
  framePop('道具商店', bankBar() + '<div class="sp-list sp-items">' + rows + '</div>' +
    '<div class="sp-foot"><button class="sp-big list" data-act="' + itemShopBack + '"><span>' + (itemShopBack === 'shareback' ? '返回结算' : '返回地图') + '</span></button></div>', itemShopBack, true);
}

/* ============ 事件 ============ */
document.addEventListener('pointerdown', function (e) {
  kickAudio();
  var bagEl = e.target.closest('[data-bag]');
  if (bagEl) {
    e.preventDefault();
    var bk2 = +bagEl.getAttribute('data-bag');
    if (!R || R.over || R.paused || !R.boxes[bk2] || R.boxes[bk2].stage !== 'box') return;
    if (!tutAllows('serve')) { log('先跟着王姐做亮起来的那一步', 'bad'); nudge(); return; }
    startBagDrag(e, bk2); watchTarget(e.target); return;
  }
  var itemEl = e.target.closest('[data-item]');
  if (itemEl && R && !R.over && !R.paused && !R.tut) {
    var kj = itemEl.getAttribute('data-item').split('-'), ib = R.boxes[+kj[0]];
    if (ib && ib.stage === 'open' && ib.items[+kj[1]]) { e.preventDefault(); startItemDrag(e, +kj[0], +kj[1]); watchTarget(e.target); return; }
  }
  var rubEl = e.target.closest('[data-rub]');
  if (rubEl) {
    e.preventDefault();
    if (!R || R.over || R.paused) return;
    var rst = tutStep();
    if (rst && !tutAllows('scrape') && !(rst.free && rst.free.scrape)) { log('先跟着王姐做亮起来的那一步', 'bad'); nudge(); return; }
    startScrapeDrag(e, +rubEl.getAttribute('data-rub')); watchTarget(e.target); return;
  }
  var sausEl = e.target.closest('[data-act=flip]');
  if (sausEl && R && !R.over && !R.paused) {
    e.preventDefault();
    var si = +sausEl.getAttribute('data-i');
    if (R.slots[si] && R.slots[si].s) { startSausDrag(e, si, sausEl); watchTarget(e.target); }
    return;
  }
  var tool = e.target.closest('[data-tool]');
  if (tool) {
    e.preventDefault();
    if (tool.disabled || !R || R.over || R.paused) return;
    if (!tutAllows('topping')) { log('先跟着王姐做亮起来的那一步', 'bad'); nudge(); return; }
    startDrag(tool, e); watchTarget(e.target); return;
  }
  var el = e.target.closest('[data-act]'); if (!el) return;
  if (el.disabled) { if (el.classList.contains('itm')) { var di = +el.getAttribute('data-i'); itemFx(di, ITEMS[di] && ITEMS[di].id === 'hourglass' && R && R.L.endless ? '无尽模式不能用' : '存款不够', false); return; } if (tutStep()) { log('先跟着王姐做亮起来的那一步', 'bad'); nudge(); } return; }
  var a = el.getAttribute('data-act'), i = +el.getAttribute('data-i');
  e.preventDefault();
  if (a === 'music') { G.music = !musicOn(); save(); syncMusic(); if (el.closest('#overlay')) menu(); else if (el.closest('#lvmap')) el.querySelector('img').src = './assets/img/ui/' + (musicOn() ? 'ui_music_on' : 'ui_music_off') + '.webp?v=' + BUILD_V; else render(); return; }
  if (a === 'tstart') { hideTitle(); return menu(); }
  if (a === 'tsettings') return titleSettings();
  if (a === 'tmusic' || a === 'setmusic') { G.music = !musicOn(); save(); syncMusic(); return titleSettings(); }
  if (a === 'setsfx') { G.sfx = G.sfx === false; save(); if (G.sfx !== false) ding(880, .08); return titleSettings(); }
  if (a === 'retut') { G.seen = {}; save(); return titleSettings('好的！第 2、7、9 关开头的游戏教学会重新出现'); }
  if (a === 'tclose') return hideOverlay();
  if (a === 'menu') return menu();
  if (a === 'intro') return intro(i);
  if (a === 'mapnode') return mapNode(i);
  if (a === 'resitems') return resultItems();
  if (a === 'mapclose') { hideOverlay(); var bk = document.querySelector('#lvmap .lm-stat.star b'); if (bk) bk.textContent = '$' + G.bank; return; }
  if (a === 'maphome') { hideMap(); return showTitle(); }
  if (a === 'mapitems') { menuShopOpen = true; return showItemShop(); }
  if (a === 'go') return loadLevel(i);
  if (a === 'shop') return shop();
  if (a === 'resume') { R.paused = false; hideOverlay(); last = now(); var ts = tutStep(); if (ts) startGuide(ts); return; }
  if (a === 'quit') { if (R) { R.over = true; R.paused = true; } clearGuide(); return menu(); }
  if (a === 'share') return openShare();
  if (a === 'sharenote') return postShareNote();
  if (a === 'savepic') return saveSharePic();
  if (a === 'shareback') { if (lastResult) showOverlay(lastResult.html, lastResult.cls); return; }
  if (a === 'shoptoggle') return toggleResultShop(el, i === 1);
  if (a === 'menushop') { menuShopOpen = !menuShopOpen; menu(); var ps = document.querySelector('#overlay .pshop'); if (ps && ps.scrollIntoView) ps.scrollIntoView({block:'nearest'}); return; }
  if (a === 'buyitem') { var itb = ITEMS[i]; if (G.bank >= itb.cost) { G.bank -= itb.cost; G.items[itb.id] = (G.items[itb.id] || 0) + 1; save(); ding(880, .08); } return refreshItemStrip(); }
  if (a === 'buy') { var u = UPGRADES[i], c = u.cost[G.up[u.id] || 0]; if (G.bank >= c) { G.bank -= c; G.up[u.id] = (G.up[u.id] || 0) + 1; save(); } return shop(); }
  if (!R || R.paused) return;
  if (a === 'tutnext') { var st = tutStep(); if (st && (!st.until || st.until())) tutGo(R.tut.i + 1); return; }
  if (a === 'tutskip') { tutEnd(); return; }
  act(a, i);
});
// 铲锅巴：在锅巴上连点 SCRAPE_TAPS 下铲掉（不用左右划：手机上横划容易触发「返回 / 退出」手势）
var SCRAPE_TAPS = 3;
function scrapeTap(i) {
  var sl = R.slots[i]; if (!sl || !sl.dirt) return;
  sl.scrub = (sl.scrub || 0) + 1;
  ding(150 + Math.random() * 60, .07, .4, 'sawtooth');
  if (sl.scrub >= SCRAPE_TAPS) { sl.cleanT = now(); act('scrape', i); return; }
  render();
}
// 拖拽事件路由。手指按住的元素可能在重绘时被换掉，换掉后 iOS 不再把 move / up 冒泡到 document，
// 所以除了 document，也在最初按下的元素上直接监听，同一个事件只处理一次。
function onPtrMove(e) { if (e.__seen) return; e.__seen = true; moveDrag(e); }
function onPtrUp(e) { if (e.__seen) return; e.__seen = true; endDrag(e); }
function onPtrCancel(e) { if (e.__seen) return; e.__seen = true; cancelDrag(e); }
function watchTarget(el) {
  if (!el || !el.addEventListener) return;
  el.addEventListener('pointermove', onPtrMove);
  el.addEventListener('pointerup', onPtrUp);
  el.addEventListener('pointercancel', onPtrCancel);
  var off = function () {
    el.removeEventListener('pointermove', onPtrMove); el.removeEventListener('pointerup', onPtrUp);
    el.removeEventListener('pointercancel', onPtrCancel); document.removeEventListener('pointerup', off, true); document.removeEventListener('pointercancel', off, true);
    el.removeEventListener('pointerup', off); el.removeEventListener('pointercancel', off);
  };
  setTimeout(function () { el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); document.addEventListener('pointerup', off, true); document.addEventListener('pointercancel', off, true); }, 0);
}
document.addEventListener('pointermove', onPtrMove);
document.addEventListener('pointerup', onPtrUp);
document.addEventListener('pointercancel', onPtrCancel);
document.addEventListener('visibilitychange', function () {
  if (document.hidden && R && !R.over && !R.demo && !R.paused) menu();
  syncMusic();
  last = now();
});

/* ============ 防误触：不让页面被放大、滑动、回弹或弹出系统菜单 ============ */
(function guardTouch() {
  var opt = {passive:false};
  // 只有内容真的超出、能上下滑的弹窗才放行；其余一律不让页面跟着手指动
  function inScroller(t) {
    for (var el = t; el && el !== document.body; el = el.parentNode) {
      if (el.scrollHeight > el.clientHeight + 2) {
        var oy = window.getComputedStyle ? getComputedStyle(el).overflowY : '';
        if (oy === 'auto' || oy === 'scroll') return true;
      }
    }
    return false;
  }
  // 双指缩放、页面拖动 / 回弹 / 下拉；弹窗内部仍可上下滑
  document.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 1) { e.preventDefault(); return; }
    if (e.target && e.target.type === 'range') return;   // 音量条照常拖
    if (!inScroller(e.target)) e.preventDefault();
  }, opt);
  // iOS 双击放大：两次抬手间隔很短时拦掉默认行为（游戏用 pointerdown，不受影响）
  var lastEnd = 0;
  document.addEventListener('touchend', function (e) {
    var t = Date.now();
    if (t - lastEnd < 350) e.preventDefault();
    lastEnd = t;
  }, opt);
  // iOS 捏合手势、双击、长按 / 右键菜单
  ['gesturestart', 'gesturechange', 'dblclick', 'contextmenu'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (ev === 'contextmenu' && e.target && e.target.classList && e.target.classList.contains('sharecard')) return; e.preventDefault(); }, opt);
  });
})();

/* ============ 主循环 ============ */
function now() { return window.performance && performance.now ? performance.now() : Date.now(); }
var last = now(), acc = 0, fitAcc = 0;
function loop() {
  var t = now(), dt = Math.min(.1, (t - last) / 1000); last = t;
  if (R && !R.over && !R.paused) {
    tick(dt); acc += dt; fitAcc += dt;
    if (acc > .066) { acc = 0; if (!R.over) render(); }
    if (fitAcc > 1) { fitAcc = 0; fit(); }
  }
  requestAnimationFrame(loop);
}

/* ============ 开始画面：长卷从上往下摇 → 标题浮现 → 开始游戏 / 设置 ============ */
var TITLE_IMG = './assets/img/title/';
var TITLE_W = 375, TITLE_H = 812;   // 开始画面按这个尺寸设计（和摆放器一致），到手机上整体等比缩放
var TITLE_STOP = .805;   // 镜头最后停的位置：屏幕底边落在长图从上往下 80.5% 处（路边）
function showTitle() {
  var ts = document.createElement('div'); ts.id = 'title'; ts.className = 'ts';
  ts.innerHTML = '<i class="ts-tint top"></i><i class="ts-tint bot"></i><div class="ts-col"><i class="ts-pattern"></i><img class="ts-bg" alt="" src="' + TITLE_IMG + 'title_pan_bg.webp?v=' + BUILD_V + '">' +
    '<canvas class="ts-orbit back"></canvas><img class="ts-logo" alt="我在学校门口买烤肠" src="' + TITLE_IMG + 'logo_title.webp?v=' + BUILD_V + '"><canvas class="ts-orbit front"></canvas>' +
    '<div class="ts-btns"><button class="ts-btn start" data-act="tstart"><img alt="开始游戏" src="' + TITLE_IMG + 'btn_start.webp?v=' + BUILD_V + '"></button>' +
    '<button class="ts-btn set" data-act="tsettings"><img alt="设置" src="' + TITLE_IMG + 'btn_settings.webp?v=' + BUILD_V + '"></button></div>' +
    '<div class="ts-load">加载中…</div></div>';
  document.body.appendChild(ts);
  var LAY = {logo:[3.5, 23.2, 93.1], start:[18.6, 56.9, 62.8], set:[20.7, 68.3, 58.6]};   // 左 / 上 / 宽，单位 %
  [['.ts-logo', LAY.logo], ['.ts-btn.start', LAY.start], ['.ts-btn.set', LAY.set]].forEach(function (p) {
    var el = ts.querySelector(p[0]); el.style.left = p[1][0] + '%'; el.style.top = p[1][1] + '%'; el.style.width = p[1][2] + '%';
  });
  // iPhone Safari 会用页面底色给顶部状态栏 / 底部工具栏染色：开始画面期间换成画面里天空和路边的颜色
  setBarColor('#735DBF'); document.body.style.backgroundColor = document.documentElement.style.backgroundColor = '#C47C5C';
  var stage = ts.querySelector('.ts-col');
  function fitStage() {
    var W = ts.clientWidth, H = ts.clientHeight, sc = Math.max(W / TITLE_W, H / TITLE_H);
    stage.style.transform = 'translate(-50%,-50%) scale(' + sc.toFixed(4) + ')';
  }
  fitStage();
  var orbit = startOrbit(ts, LAY.logo);
  var col = stage, bg = ts.querySelector('.ts-bg'), imgs = ts.querySelectorAll('img'), left = imgs.length, started = false, done = false;
  function finish() {
    if (done) return; done = true;
    bg.style.transition = 'none'; bg.style.transform = 'translate3d(0,' + -panDist() + 'px,0)';
    ts.className = 'ts ready logo-on btns-on';
  }
  function panDist() { return Math.max(0, bg.offsetHeight * TITLE_STOP - col.clientHeight); }
  function go() {
    if (started) return; started = true;
    ts.className = 'ts ready';
    // 先停在长图顶部（星空），下一帧开始往下摇到校门口
    bg.style.transform = 'translate3d(0,0,0)';
    setTimeout(function () {
      if (done) return;
      bg.style.transition = 'transform 2.8s cubic-bezier(.45,0,.2,1)';
      bg.style.transform = 'translate3d(0,' + -panDist() + 'px,0)';
    }, 250);
    setTimeout(function () { if (!done) ts.className = 'ts ready logo-on'; }, 2900);
    setTimeout(function () { if (!done) { done = true; ts.className = 'ts ready logo-on btns-on'; } }, 3600);
  }
  for (var n = 0; n < imgs.length; n++) {
    if (imgs[n].complete) left--; else imgs[n].onload = imgs[n].onerror = function () { if (--left <= 0) go(); };
  }
  if (left <= 0) go();
  setTimeout(go, 4000);   // 图片太慢也别一直卡在加载
  // 摇镜头时点一下屏幕直接跳到最后
  ts.addEventListener('pointerdown', function (e) { if (started && !done && !e.target.closest('[data-act]')) finish(); });
  window.addEventListener('resize', function () { fitStage(); orbit.resize(); if (done && bg.parentNode) { bg.style.transition = 'none'; bg.style.transform = 'translate3d(0,' + -panDist() + 'px,0)'; } });
}
// 标题流星：从「校」「门」上方的天空出发，往左下划，先钻到标题背后，再从「买」「烤」之间穿出来，闪一下消失；隔几秒再来一颗
function startOrbit(ts, lay) {
  var cvs = ts.querySelectorAll('.ts-orbit'), back = cvs[0], front = cvs[1], cb = back.getContext('2d'), cf = front.getContext('2d');
  var lw = TITLE_W * lay[2] / 100, lh = lw * 400 / 640, lx = TITLE_W * lay[0] / 100, ly = TITLE_H * lay[1] / 100;   // 标题图 640×400
  function L(u, v) { return [lx + lw * u, ly + lh * v]; }   // 标题图里的相对坐标 → 画布坐标
  // 圆弧：绕标题中心顺时针转大半圈、半径越转越小（螺旋收进来）。
  // 从「校」「门」上方出发 → 绕到标题右边（这段在字背后）→ 从右边绕出来到字前面 → 收到「买」「烤」之间
  var A0 = -72 * Math.PI / 180, A1 = 100 * Math.PI / 180, OX = .48, OY = .32, RX = .52, RY = .6, SHRINK = .45;
  var CROSS = (5 * Math.PI / 180 - A0) / (A1 - A0);   // 转过标题右边（约 5°）之前在背后，之后在前面
  var E = pt(1);
  var CYCLE = 4.2, FLY = 1.6, k = 1, raf = 0, t0 = now(), sparks = [];
  function resize() {
    var r = ts.querySelector('.ts-col').getBoundingClientRect();
    k = Math.min(3, (window.devicePixelRatio || 1) * r.width / TITLE_W);
    [back, front].forEach(function (c) { c.width = TITLE_W * k; c.height = TITLE_H * k; });
  }
  function pt(u) {
    var a = A0 + (A1 - A0) * u, sc = 1 - (1 - SHRINK) * Math.pow(u, 1.5);
    return L(OX + Math.cos(a) * RX * sc, OY + Math.sin(a) * RY * sc);
  }
  function star(c, x, y, r, rot, alpha) {
    var g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,' + alpha + ')'); g.addColorStop(.3, 'rgba(255,236,170,' + (alpha * .9) + ')'); g.addColorStop(1, 'rgba(255,190,80,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(r / 18, r / 18); c.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    c.beginPath(); c.moveTo(0, -11); c.lineTo(2, -2); c.lineTo(11, 0); c.lineTo(2, 2); c.lineTo(0, 11); c.lineTo(-2, 2); c.lineTo(-11, 0); c.lineTo(-2, -2); c.closePath(); c.fill(); c.restore();
  }
  function draw() {
    raf = requestAnimationFrame(draw);
    [cb, cf].forEach(function (c) { c.setTransform(k, 0, 0, k, 0, 0); c.clearRect(0, 0, TITLE_W, TITLE_H); c.lineCap = 'round'; });
    if (ts.className.indexOf('logo-on') < 0) return;
    var t = ((now() - t0) / 1000 + CYCLE - 1) % CYCLE;   // 标题出来 1 秒后第一颗
    if (t < FLY) {
      var u = t / FLY; u = 1 - Math.pow(1 - u, 2.2);   // 先快后慢地绕过来
      var N = 44, TR = .38;
      for (var n = N; n > 0; n--) {   // 光尾
        var u1 = Math.max(0, u - TR * n / N), u2 = Math.max(0, u - TR * (n - 1) / N), p1 = pt(u1), p2 = pt(u2), f = 1 - n / N;
        var c = u2 > CROSS ? cf : cb;
        c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]);
        c.strokeStyle = 'rgba(255,' + (225 + 30 * f | 0) + ',' + (150 + 105 * f | 0) + ',' + Math.min(1, Math.pow(f, 1.2) * 1.1).toFixed(3) + ')';
        c.shadowColor = 'rgba(255,200,90,.9)'; c.shadowBlur = 10 * f; c.lineWidth = 1 + 5 * f; c.stroke(); c.shadowBlur = 0;
      }
      var h = pt(u), hc = u > CROSS ? cf : cb;
      star(hc, h[0], h[1], 16 + 6 * u, t * 6, 1);
      if (Math.random() < .5) sparks.push({x:h[0], y:h[1], vx:(Math.random() - .5) * 30, vy:Math.random() * 25 + 5, life:1, front:u > CROSS});
    } else if (t < FLY + .7) {   // 穿出来后在「买」「烤」之间闪一下
      var q = (t - FLY) / .7;
      star(cf, E[0], E[1], 22 + 16 * Math.sin(q * Math.PI), q * 3, 1 - q);
      if (q < .15) for (var m = 0; m < 3; m++) sparks.push({x:E[0], y:E[1], vx:(Math.random() - .5) * 90, vy:(Math.random() - .7) * 70, life:1, front:true});
    }
    sparks = sparks.filter(function (sp) {
      sp.life -= .03; sp.x += sp.vx / 60; sp.y += sp.vy / 60; sp.vy += .8; if (sp.life <= 0) return false;
      var c2 = sp.front ? cf : cb; c2.fillStyle = 'rgba(255,230,160,' + (sp.life * .9).toFixed(3) + ')';
      c2.beginPath(); c2.arc(sp.x, sp.y, 1.6 * sp.life + .4, 0, Math.PI * 2); c2.fill(); return true;
    });
  }
  resize(); draw();
  ts.__orbitStop = function () { cancelAnimationFrame(raf); };
  return {resize:resize};
}
// 状态栏颜色：页面里固定有一个 theme-color，只改颜色不删（删了 Safari 会一直沿用上一次的颜色）
function setBarColor(c) {
  var m = document.querySelector('meta[name="theme-color"]');
  if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
  m.content = c || '#744F80';   // 默认 = 游戏画面顶端的天空色
}
function hideTitle() {
  var ts = $('title'); if (!ts) return;
  if (ts.__orbitStop) ts.__orbitStop();
  setBarColor(null); document.body.style.backgroundColor = document.documentElement.style.backgroundColor = '';
  ts.className += ' out';
  setTimeout(function () { if (ts.parentNode) ts.parentNode.removeChild(ts); }, 350);
}
function titleSettings(msg) {
  var vm = Math.round((G.vol && G.vol.m != null ? G.vol.m : 100)), vs = Math.round((G.vol && G.vol.s != null ? G.vol.s : 100));
  var tg = function (act, on) { return '<button class="st-tog' + (on ? ' on' : '') + '" data-act="' + act + '"><span class="st-lab">' + (on ? '开' : '关') + '</span><i></i></button>'; };
  var row = function (ic, name, ctl) { return '<div class="st-row"><span class="ps-ic">' + ic + '</span><span class="st-name">' + name + '</span>' + ctl + '</div>'; };
  var slider = function (k, v, lab) { return '<input class="ps-range" type="range" min="0" max="100" step="5" value="' + v + '" data-vol="' + k + '" style="--p:' + v + '%" aria-label="' + lab + '">'; };
  framePop('设置',
    '<div class="st-sec">声音</div>' +
    row(ICON_NOTE, '背景音乐', tg('setmusic', musicOn())) +
    row(ICON_SPK, '音效', tg('setsfx', G.sfx !== false)) +
    row(ICON_NOTE, '音乐音量', slider('m', vm, '背景音乐音量')) +
    row(ICON_SPK, '音效音量', slider('s', vs, '音效音量')) +
    '<div class="ps-div st-div"></div>' +
    row(ICON_BOOK, '游戏教学', '<button class="st-btn" data-act="retut">重新看一遍</button>') +
    (msg ? '<div class="st-msg">' + msg + '</div>' : '') +
    '<div class="st-ver">版本 ' + BUILD_V + ' · ' + (isStandalone() ? '主屏幕' : '浏览器') + '<br>' + viewDiag() + '</div>' +
    '<div class="sp-foot"><button class="sp-big list" data-act="tclose"><span>返回</span></button><button class="sp-big go" data-act="tclose"><span>好的</span></button></div>', 'tclose');
}

/* ============ 关卡地图：放学路上 10 个站点，过一关亮一个 ============ */
// 站点中心（地图图 750×1624 的坐标），1 在最下面，10 在校门口
// 新地图（1125×2000）上 10 块石板的中心和宽度，1 在最下面
var MAP_PADS = [[650,1850,270],[650,1560,250],[370,1350,240],[680,1200,230],[690,950,215],[490,810,205],[420,624,195],[660,510,185],[870,390,175],[720,300,165]];
// 关卡站点：画成一块圆台，锁着的灰蓝色带小锁，解锁的金黄色，当前关会发光
function nodeSVG(n, st) {
  var lock = st === 'lock', id = 'g' + n + st;
  var top = lock ? '#DCE4EC' : '#FFD95E', top2 = lock ? '#A9B9C9' : '#F6A21F', side = lock ? '#7D8FA3' : '#C96A18', side2 = lock ? '#62738A' : '#A9530F', ink = lock ? '#6E8197' : '#A9530F';
  return '<svg viewBox="0 0 120 100" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + top2 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + side + '"/><stop offset="1" stop-color="' + side2 + '"/></linearGradient></defs>' +
    '<ellipse cx="60" cy="66" rx="56" ry="26" fill="url(#' + id + 's)"/><rect x="4" y="40" width="112" height="26" fill="url(#' + id + 's)"/>' +
    '<ellipse cx="60" cy="40" rx="56" ry="26" fill="url(#' + id + ')"/>' +
    '<ellipse cx="60" cy="40" rx="52" ry="23" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/>' +
    '<ellipse cx="48" cy="30" rx="26" ry="8" fill="#fff" opacity=".35"/>' +
    '<text x="60" y="' + (lock ? 47 : 54) + '" text-anchor="middle" font-family="ShuHei,PingFang SC,sans-serif" font-size="' + (lock ? 34 : 44) + '" fill="#fff" stroke="' + ink + '" stroke-width="6" paint-order="stroke" stroke-linejoin="round">' + n + '</text>' +
    (lock ? '<g transform="translate(60 72)"><path d="M-7 -6v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#fff" stroke-width="5"/><rect x="-12" y="-7" width="24" height="18" rx="5" fill="#fff"/><circle cy="1" r="3" fill="' + ink + '"/><rect x="-1.2" y="1" width="2.4" height="5" rx="1" fill="' + ink + '"/></g>' : '') +
    '</svg>';
}
var MAP_TOP10 = 188;   // 左侧「升级小摊」顶边对齐的高度：第 10 关石头顶边的 y（地图坐标）
// 当前关（金色石头）上数字的中心，按每张地图实测（每张图石头位置略有不同）；小三角放在数字正上方
var MAP_DIGITS = [[346,1509],[540,1383],[402,1217],[298,1020],[610,846],[470,709],[230,579],[307,439],[612,314],[503,219]];   // 第 10 关石头顶边的 y（地图坐标）
var MAP_NODES = [[345,1545],[540,1415],[398,1250],[262,1022],[618,870],[475,722],[228,605],[309,460],[615,340],[505,240]];
// 进关卡前的加载画面：花纹底 + 一根像进度条一样「烤熟」的烤肠 + LOADING...
var loading = false;
function loadLevel(i) {
  if (loading) return;
  loading = true; hideOverlay(); clearGuide();
  var ld = document.createElement('div'); ld.id = 'loader'; ld.className = 'ld';
  // 胖乎乎的卡通烤肠剪影 + 竹签；两道烤纹是镂空的。用裁剪矩形从下往上露出实心那层当进度
  var SAUS = '<path d="M30 6c11 0 19 8 19 20v42c0 12-8 20-19 20S11 80 11 68V26C11 14 19 6 30 6z"/><rect x="27" y="84" width="6" height="40" rx="3"/>';
  var CUTS = '<path d="M18 34l24-9M18 50l24-9M18 66l24-9" stroke="#E3864A" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
  ld.innerHTML = '<div class="ld-box"><svg class="ld-saus" viewBox="0 0 60 128" aria-hidden="true"><defs><clipPath id="ldClip"><rect class="ld-clip" x="0" y="128" width="60" height="0"/></clipPath></defs>' +
    '<g fill="#F7C795" opacity=".3">' + SAUS + '</g><g fill="#F7C795" clip-path="url(#ldClip)">' + SAUS + '</g>' + CUTS + '</svg>' +
    '<div class="ld-txt">LOADING<span>...</span></div></div>';
  document.body.appendChild(ld);
  setBarColor('#E0833F'); document.body.style.backgroundColor = document.documentElement.style.backgroundColor = '#E4864C';
  var clip = ld.querySelector('.ld-clip'), t0 = now(), DUR = 1300;
  (function step() {
    var k = Math.min(1, (now() - t0) / DUR), e = 1 - Math.pow(1 - k, 2.2);
    clip.setAttribute('y', (128 - 128 * e).toFixed(1)); clip.setAttribute('height', (128 * e).toFixed(1));
    if (k < 1) return setTimeout(step, 16);   // 不用 rAF：页面在后台时 rAF 会停，加载画面就卡住了
    // 加载完：在加载画面后面开局，再淡出
    startLevel(i);
    ld.className = 'ld out'; loading = false;
    setTimeout(function () { if (ld.parentNode) ld.parentNode.removeChild(ld); setBarColor(null); if (!document.querySelector('.ts, #lvmap')) document.body.style.backgroundColor = document.documentElement.style.backgroundColor = ''; }, 380);
  })();
}
function showMap() {
  hideOverlay(); hideMap();
  var open = Math.min(G.cleared + 1, 10), cur = Math.min(G.cleared, 9);   // 已解锁的站点数 / 当前该玩的那一关
  var mp = document.createElement('div'); mp.id = 'lvmap'; mp.className = 'lvmap' + (G.cleared >= ENDLESS ? ' has-bar' : '');
  var h = '<i class="lm-tint top"></i><i class="lm-tint bot"></i><div class="lm-stage"><img class="lm-bg" alt="关卡地图" src="./assets/img/map/map_bg_long.webp?v=' + BUILD_V + '">';
  MAP_PADS.forEach(function (n, i) {
    // 用美术切图：亮的（带光晕，石台只占图宽 72%）/ 锁着的；数字由程序叠在台面上
    // 已通过：node_done（石台占图宽 63%）；当前关：node_lit（72%）；锁着：node_lock（整张）
    var st = i < open ? (i === cur && G.cleared < 10 ? 'cur' : 'open') : 'lock', lock = st === 'lock', done = st === 'open';
    var w = n[2] * .72 / (lock ? 1 : done ? .63 : .72), file = lock ? 'node_lock' : done ? 'node_done' : 'node_lit', ty = lock ? 28 : done ? 38 : 39;
    h += '<button class="lm-node ' + st + '" data-act="mapnode" data-i="' + i + '" style="left:' + (n[0] / 11.25) + '%;top:' + (n[1] / 20) + '%;width:' + (w / 11.25) + '%" aria-label="第 ' + (i + 1) + ' 关">' +
      '<img alt="" src="./assets/img/map/' + file + '.webp?v=' + BUILD_V + '"><b style="top:' + ty + '%">' + (i + 1) + '</b>' +
      (st === 'cur' ? '<i class="lm-tri"></i>' : '') + '</button>';
  });
  var UI = './assets/img/ui/', V = '?v=' + BUILD_V;
  h += '</div><div class="lm-hud">' +
    '<button class="lm-ico back" data-act="maphome" aria-label="返回首页"><img alt="" src="' + UI + 'ui_back.webp' + V + '"></button>' +
    '<div class="lm-stat star"><img alt="" src="' + UI + 'ui_star.webp' + V + '"><b>$' + G.bank + '</b></div>' +
    '<button class="lm-stat heart" data-act="mapnode" data-i="' + (LEVELS.length - 1) + '" aria-label="无限模式"><img alt="" src="' + UI + 'ui_heart.webp' + V + '"><b>无限模式</b></button>' +   // 无限模式入口
    '<button class="lm-ico set" data-act="tsettings" aria-label="设置"><img alt="" src="' + UI + 'ui_settings.webp' + V + '"></button>' +
    '<div class="lm-side"><button class="lm-ico" data-act="shop" aria-label="升级小摊"><img alt="" src="' + UI + 'ui_upgrade.webp' + V + '"><small>升级小摊</small></button>' +
    '<button class="lm-ico" data-act="mapitems" aria-label="道具商店"><img alt="" src="' + UI + 'ui_shop.webp' + V + '"><small>道具商店</small></button></div></div>' +
    (G.cleared >= ENDLESS ? '<div class="lm-bar"><button class="lm-pill hot" data-act="intro" data-i="' + ENDLESS + '">无尽模式</button></div>' : '');
  mp.innerHTML = h;
  document.body.appendChild(mp);
  // Safari 状态栏 / 工具栏跟着地图的颜色走（不再是开始画面的紫色）
  setBarColor('#C38F5E'); document.body.style.backgroundColor = document.documentElement.style.backgroundColor = '#CF9379';   // 底色 = 地图最底下的颜色，万一没铺满也看不出
  // 地图整张铺满屏幕（像开始画面一样等比放大，多出来的两边 / 上下裁掉），不用滚动
  var stage = mp.querySelector('.lm-stage');
  function fitMap() {
    var W = mp.clientWidth, H = mp.clientHeight, sc = W / 1125, w = 1125 * sc, hh = 2000 * sc;   // 加长版地图：按宽度铺满，上下多出来的由长图补齐，站点坐标不变
    stage.style.width = w + 'px'; stage.style.height = hh + 'px'; stage.style.left = (W - w) / 2 + 'px'; stage.style.top = (H - hh) / 2 + 'px';
    [].forEach.call(mp.querySelectorAll('.lm-node'), function (b) { var t = b.querySelector('b'); if (t) t.style.fontSize = (b.offsetWidth * (b.classList.contains('lock') ? .3 : .24)).toFixed(1) + 'px'; });
    var side = mp.querySelector('.lm-side'), p10 = MAP_PADS[9];
    side.style.top = Math.max(60, (H - hh) / 2 + (p10[1] - p10[2] * .32) * sc) + 'px';
  }
  fitMap(); window.addEventListener('resize', function () { if (mp.parentNode) fitMap(); });
}
function showItemShop() { itemShop('mapclose'); }
function hideMap() { var m = $('lvmap'); if (m && m.parentNode) { m.parentNode.removeChild(m); setBarColor(null); document.body.style.backgroundColor = document.documentElement.style.backgroundColor = ''; } }
function mapNode(i) {
  if (i > G.cleared) {
    var b = document.querySelector('.lm-node[data-i="' + i + '"]'); if (b) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); }
    ding(180, .12); mapToast(LEVELS[i] && LEVELS[i].endless ? '通关全部 ' + (LEVELS.length - 1) + ' 关后解锁无限模式' : '先通过第 ' + (G.cleared + 1) + ' 关才能解锁');
    return;
  }
  ding(880, .06); intro(i);
}
function mapToast(t) {
  var m = $('lvmap'); if (!m) return;
  var o = m.querySelector('.lm-toast'); if (!o) { o = document.createElement('div'); o.className = 'lm-toast'; m.appendChild(o); }
  o.textContent = t; o.classList.remove('on'); void o.offsetWidth; o.classList.add('on');
}

/* 开场：摆一个营业中的样子，再弹出关卡列表 */
startLevel(Math.min(G.cleared, 9), true);
R.paused = true; R.demo = true; R.tut = null; $('coach').hidden = true;
R.slots[0].s = {a:52, b:31, down:'b'};
R.slots[1].s = {a:74, b:70, down:'a'};
R.boxes[0].items = [{band:'嫩', sauce:'番茄', spice:null}];
spawn(); spawn(); R.cust[0].pat *= .6;
render(); fit(); showTitle();
requestAnimationFrame(loop);

/* 调试入口：仅在地址带 #debug 时暴露，供快进测试 */
if (location.hash === '#debug') {
  window.__sausage = {state:function () { return R; }, tick:tick, render:render, act:act, applyTopping:applyTopping, tutGo:tutGo, deliver:deliver};
}
})();
