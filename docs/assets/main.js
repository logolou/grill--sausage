/* 校门口烤肠摊 — 经典脚本，ES2017，无外部依赖 */
(function () {
'use strict';

/* ============ 配置 ============ */
var PRICE1 = 3, PRICE2 = 5, COST = 1;
var SAUCE_COL = {'番茄':'#D8342A','蜂蜜芥末':'#E7C43A','甜辣':'#F06A2B'};
var SPICE_COL = {'孜然':'#8A6A3A','葱花':'#4FA83D','辣椒':'#C0180C'};
var LEVELS = [
  {name:'教学关·开张大吉', time:90, goal:{money:10}, slots:3, pat:75, spawn:[8,11], bands:['嫩'], sauces:['番茄'], spices:[], two:.15, runner:0, feat:[], tutorial:true,
   news:['摊主老王手把手教你怎么摆烤肠摊','教学结束后，自己动手试试吧，今天赚 ¥10 就能收摊！']},
  {name:'油锅要伺候', time:90, goal:{money:10}, slots:3, pat:60, spawn:[7,10], bands:['嫩'], sauces:['番茄'], spices:['孜然'], two:.2, runner:0, feat:['oil'],
   news:['锅里的油会越烤越少。油量低于红线时会粘锅，烤肠成熟更快，更容易焦。','点「加油」补油；油很满时再加会溢出，损失 ¥1。','新小料：孜然。使用方法：把调料罐拖到烤肠上抖一抖。']},
  {name:'口味多起来', time:90, goal:{money:18}, slots:3, pat:65, spawn:[6,9], bands:['嫩','脆'], bandW:[.7,.3], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:0, feat:['oil'],
   news:['新口感：「脆」——烤肠两面都需要烤过第二条刻度。','新酱料：蜂蜜芥末。新小料：辣椒。']},
  {name:'攒人气', time:90, goal:{hearts:9}, slots:3, pat:51, spawn:[5.5,8], bands:['嫩','脆'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:0, feat:['oil'],
   news:['顾客耐心还剩 35% 以上时交付顾客心巴上的烤肠，就会给你一颗爱心。']},
  {name:'有人逃单！', time:120, goal:{money:20}, slots:3, pat:47, spawn:[5.2,7.8], bands:['嫩','脆'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.3, runner:.18, feat:['oil'],
   news:['顾客拿到烤肠都会说「扫好啦」。正常顾客片刻后收款音箱会播报到账，然后才离开。','逃单的人没有到账播报，拿了就走——在他走远前点击喊他站住！','喊错了（人家其实付了）要扣一颗爱心！']},
  {name:'微焦党来了', time:120, goal:{money:30}, slots:4, pat:45, spawn:[4.8,7.2], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.35, runner:.05, bandRule:{band:'微焦', within:3, max:.2}, feat:['oil'],
   news:['新口感：「微焦」——两面过第三条刻度，但不能烤到头。','锅位增加到 4 个。']},
  {name:'自己串签', time:120, goal:{hearts:12}, slots:4, pat:43, spawn:[4.6,7], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.5, runner:.2, bandRule:{band:'微焦', within:0, max:.25}, feat:['oil','skewer'],
   news:['预串好的肠用完了。先点「串一根」，串好的肠才能下锅。']},
  {name:'放学高峰', time:150, goal:{money:30}, slots:4, pat:40, spawn:[3.8,5.8], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末'], spices:['孜然','辣椒'], two:.45, runner:.2, feat:['oil','skewer'],
   news:['全校一起放学：顾客来得更快、更没耐心，要两根的更多了。']},
  {name:'锅底要铲', time:150, goal:{money:40}, slots:4, pat:39, spawn:[4,6], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.4, runner:.22, feat:['oil','skewer','scrape'],
   news:['每个锅位烤完 3 根、或烤焦一根肠之后会结锅巴，要用手指在锅巴上来回蹭两下铲掉才能再用。','新酱料：甜辣。']},
  {name:'校门口之王', time:180, goal:{money:50,hearts:12}, slots:4, pat:39, spawn:[3.5,5.6], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.45, runner:.25, feat:['oil','skewer','scrape'],
   news:['最终关：钱和爱心两个目标都要达成。']},
  {name:'无尽模式', endless:true, time:0, goal:{}, slots:4, pat:44, spawn:[5,7.5], bands:['嫩','脆','微焦'], sauces:['番茄','蜂蜜芥末','甜辣'], spices:['孜然','辣椒'], two:.35, runner:.12, feat:['oil'],
   news:['不限时间：客人会越来越多、越来越急，逃单的也越来越多。','开局口碑 ❤5。差评、客人等不及走掉、被逃单跑掉，各扣 1 颗；做对且够快 +1。','口碑扣光就收摊，看看你能坚持到第几关！']}
];
var ENDLESS = 10, ENDLESS_HEARTS = 5, START_HEARTS = 3;   // 开局爱心；扣到 0 当场收摊
var MAXQ = 3;
var PAT_SCALE = 1.25;   // 全局顾客耐心倍数：嫌客人太急就调大
var UPGRADES = [
  {id:'boxb', name:'多一个打包盒', desc:'第 2 个 ¥20，第 3 个 ¥40，最多 3 个盒子', cost:[20,40], max:2},
  {id:'fire', name:'可调火力烤肠锅', desc:'火力分小 / 中 / 大，快慢自己调', cost:[35], max:1},
  {id:'nonstick', name:'不粘锅涂层', desc:'耗油慢 40%', cost:[25], max:1},
  {id:'horn', name:'吆喝小喇叭', desc:'客人耐心 +25%', cost:[30], max:1},
  {id:'smart', name:'智能番茄涂抹机', desc:'点烤肠，按客人要求涂好番茄酱', cost:[30], max:1},
  {id:'spicer', name:'智能撒料机', desc:'点烤肠，按客人要求撒孜然、辣椒', cost:[50], max:1},
  {id:'cam', name:'门口监控', desc:'逃单的人会被红框标出', cost:[40], max:1}
];
// 第三项是内设性格，不在界面上显示：easy 随和（做错少收 ¥1），picky 挑剔（做错少收 ¥2）
// 一次性道具：花钱买，每局都能用，用掉就没了
var ITEMS = [
  {id:'candy', icon:'🍭', name:'棒棒糖', desc:'排队客人的耐心全部回满', short:'耐心回满', cost:5},
  {id:'hourglass', icon:'⏳', name:'沙漏', desc:'本关时间 +30 秒（无尽模式不能用）', short:'时间 +30 秒', cost:5},
  {id:'flower', icon:'🙋', name:'烤肠课代表', bar:'课代表', desc:'排队的客人瞬间全部做完，照价收钱', short:'瞬间做完所有单', cost:20}
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
function goalText(g) { var a = []; if (g.money != null) a.push('净赚 ¥' + g.money); if (g.hearts != null) a.push(g.hearts + ' 颗爱心'); return a.join(' + '); }

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
    g.gain.setValueAtTime(vol || SFX_VOL, t0);
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
var bgmBuf = null, bgmSrc = null, bgmLoading = false;
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
      var g = ctx.createGain(); g.gain.value = .2; g.connect(ctx.destination);
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
  {text:'还有1分钟放学！我是摊主老王，跟我学卖烤肠。', btn:'好嘞', hand:'[data-act=tutnext]'},
  {text:'先点亮着的空锅位，放一根肠下锅（进价 ¥1）。', spot:'place0', wait:'place', hand:'[data-act=place][data-i="0"]'},
  {text:'朝下那面正在烤。盯住下面的进度条，过了第一条刻度烤肠就熟了……', spot:'slot0',
   until:function () { var s = R.slots[0].s; return s && s[s.down] >= 42; }},
  {text:'这面熟了！点一下锅里的烤肠，它就会翻面，烤另一面。', spot:'flip0', wait:'flip', hand:'[data-act=flip][data-i="0"]'},
  {text:'等另一面也过第一条刻度。别烤太久，进度条走到头就焦了。', spot:'slot0',
   until:function () { var s = R.slots[0].s; return s && judge(s) === '嫩'; }},
  {text:'两面都烤得嫩嫩的了！先停一下，看看烤肠不同火候的标准：', btn:'懂了', hand:'[data-act=tutnext]', freeze:true, extra:lessonHTML},
  {text:'两面都熟了，标签变成「嫩」。点「夹起」，烤肠会放进下面的「盒 A」。', spot:'pick0', wait:'pick', hand:'[data-act=pick][data-i="0"]'},
  {text:'第一位小客人来了！看他的要求：要「一根烤得嫩嫩的加番茄酱的烤肠」。', spot:'t1', btn:'看懂了', hand:'[data-act=tutnext]', enter:function () { spawnScripted(); }},
  {text:'按住「番茄酱」，拖到盒 A 里的烤肠上，松手挤上酱。', spot:'tool-番茄 item00', wait:'topping', drag:['[data-tool="sauce"]', '[data-item="0-0"]']},
  {text:'酱挤好了。点盒 A 的「装盒」，把盒盖合上。', spot:'pack0', wait:'pack', hand:'[data-act=pack][data-i="0"]'},
  {text:'盒子盖好了！按住打包盒，拖到豆豆身上，松手递给他！', spot:'bag0 t1', wait:'serve', drag:['[data-bag="0"]', '[data-tag="t1"]']},
  {text:'听！收款音箱播报「到账」，才说明客人真付了钱。有人可能会逃单，要留意有没有到账播报。', spot:'speaker', btn:'懂了', hand:'[data-act=tutnext]',
   until:function () { return R.pay.length > 0; }, untilShowsBtn:true},
  {text:'又来一位！王阿姨要「两根」：一根要烤得「嫩」不刷酱，一根「脆」的，刷番茄酱。两根装进同一个盒子。', spot:'t2', btn:'看懂了', hand:'[data-act=tutnext]', enter:function () { spawnScripted2(); }},
  {text:'放两根肠下锅。一根到「嫩」就夹出来；另一根多烤一会儿，两面都过第二条刻度，变「脆」再夹。记得勤点烤肠翻面，别烤成阴阳面！', free:{place:1, flip:1, pick:1}, handFn:cookHand, twoBands:true,
   until:function () { return boxHas('嫩') && boxHas('脆'); }},
  {text:'只给「脆」的那根挤番茄酱，「嫩」的那根不要酱。', spot:'tool-番茄 crisp', wait:'topping', crispSauce:true,
   dragFn:function () { return ['[data-tool="sauce"]', '[data-item="0-' + bandIndex('脆') + '"]']; },
   until:function () { var it = R.boxes[0].items; return it.length === 2 && it[bandIndex('脆')].sauce === '番茄' && !it[bandIndex('嫩')].sauce; }},
  {text:'一根「嫩」没酱、一根「脆」有酱，全对。点「装盒」。', spot:'pack0', wait:'pack', hand:'[data-act=pack][data-i="0"]'},
  {text:'按住打包盒，拖给王阿姨！', spot:'bag0 t2', wait:'serve', drag:['[data-bag="0"]', '[data-tag="t2"]']},
  {text:'做得好！拿爱心的条件：根数、火候、酱、小料全做对，并且客人耐心条还剩三分之一以上。', btn:'记住了', hand:'[data-act=tutnext]'},
  {text:'做错了，客人会少给钱、打差评；生的、烤焦的直接不给钱。差评会让店里的爱心减少，爱心减为零时会强制收摊。', btn:'知道了', hand:'[data-act=tutnext]'},
  {text:'锅里忙不过来时可以停火，烤肠就不会继续受热。试试点「停火」。', spot:'fire', wait:'fire', hand:'[data-act=fire]'},
  {text:'火灭了，再点一次，炉子会重新点火，需要预热一会儿才能烤下一批。现在摊子就交给你了！', btn:'开始营业', hand:'[data-act=tutnext]'}
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
      return '<div class="meter"><i style="width:' + Math.min(100, v) + '%;background:' + col(v) + '"></i>' +
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
    if (need.indexOf(j) >= 0) return '[data-act=pick][data-i="' + i + '"]';
    if (need.some(function (b) { return avg < LIMIT[b]; })) useful++;
    if (s[s.down] - s[up] > 22) return '[data-act=flip][data-i="' + i + '"]';
  }
  if (useful < need.length) {
    for (i = 0; i < R.slots.length; i++) if (!R.slots[i].s && !R.slots[i].dirt) return '[data-act=place][data-i="' + i + '"]';
  }
  return null;
}
var SHOP_TUT = [
  {text:'存款能买道具了，关键时刻救急！', btn:'说说看', hand:'[data-act=tutnext]'},
  {text:'🍭 棒棒糖：排队客人耐心回满<br>⏳ 沙漏：本关多加 30 秒<br>🙋 课代表：瞬间做完所有订单', btn:'然后呢', hand:'[data-act=tutnext]'},
  {text:'道具在黑板下方，点一下就用。', btn:'开始营业', hand:'[data-act=tutnext]'}
];
var SKEWER_TUT = [
  {text:'老王又来啦！今天预串好的肠用完了，从这关起得自己串签。', btn:'怎么串', hand:'[data-act=tutnext]'},
  {text:'看锅下面的「串一根」，点一下就串好一根，最多能备 4 根。先串两根试试。', hand:'[data-act=skewer]', free:{skewer:1}, until:function () { return R.stock >= 2; }},
  {text:'串好了！现在点空锅位，把串好的肠放上去。', hand:'[data-act=place][data-i="0"]', wait:'place', free:{skewer:1}},
  {text:'记住：没有串好的肠，锅位是放不上去的。<br>客人少的时候多串几根备着，放学高峰才不手忙脚乱。', btn:'开始营业', hand:'[data-act=tutnext]', freeze:true, free:{skewer:1}}
];
var SKEWER_MAX = 4;   // 串好的肠最多备几根
var SCRAPE_TUT = [
  {text:'第九关！老王来提个醒：锅用久了会结锅巴。每个锅位烤完 3 根肠，或者烤焦一根，就会结一层锅巴。', btn:'那怎么办', hand:'[data-act=tutnext]'},
  {text:'结了锅巴的锅位放不了新肠。看，这格结锅巴了——用手指按住它，<b>来回蹭两下</b>，把锅巴铲干净！', spot:'scrape0', rub:'[data-rub="0"]', wait:'scrape',
   enter:function () { R.slots[0].s = null; R.slots[0].dirt = true; R.slots[0].scrub = 0; }},
  {text:'铲干净了！忙起来也要留意锅巴，别让锅位闲着。<br>另外这关多了新酱料「甜辣」，看清客人要哪种酱。', btn:'开始营业', hand:'[data-act=tutnext]', freeze:true}
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
  if (!st.hand && !st.handFn && !st.drag && !st.dragFn && !st.rub) return;
  guideEl = document.createElement('div');
  guideEl.className = 'guide ' + (st.drag || st.dragFn ? 'drag' : 'tap');
  guideEl.innerHTML = '<i class="ring"></i><i class="ring r2"></i><span class="hand">👆</span>';
  document.body.appendChild(guideEl);
  if (st.rub) {
    // 蹭的引导：手指在目标上左右来回
    guideEl.className = 'guide drag';
    var wob = function () {
      var p = pageRect(st.rub); if (!p) { guideEl.style.opacity = '0'; return; }
      guideEl.style.opacity = '';
      if (guideEl.animate) guideEl.animate([
        {left:(p.x - 22) + 'px', top:p.y + 'px'}, {left:(p.x + 22) + 'px', top:p.y + 'px'},
        {left:(p.x - 22) + 'px', top:p.y + 'px'}, {left:(p.x + 22) + 'px', top:p.y + 'px'}, {left:(p.x - 22) + 'px', top:p.y + 'px'}
      ], {duration:1400, easing:'ease-in-out', fill:'forwards'});
      else { guideEl.style.left = p.x + 'px'; guideEl.style.top = p.y + 'px'; }
    };
    wob(); guideTimer = setInterval(wob, 1700);
  } else if (st.hand || st.handFn) {
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
  var L = LEVELS[i];
  var n = L.slots, slots = [];
  for (var k = 0; k < n; k++) slots.push({s:null, dirt:false, count:0});
  R = {i:i, L:L, t:0, net:0, hearts:0, oil:100, stock: L.feat.indexOf('skewer') >= 0 ? 0 : Infinity,
       boxes:[mkBox(), mkBox(), mkBox()], sel:0, fire:true, heat:1, cust:[], spawnT:1.2, over:false, paused:false, slots:slots, pay:[],
       st:{sold:0, angry:0, fled:0, caught:0, wrong:0, wasted:0, bad:0},
       tut: L.tutorial ? {i:0, steps:TUT, label:'教学'} : null};
  // 第二关第一次开张：老王介绍道具商店
  G.seen = G.seen || {};
  if (i === 1 && !demo && !G.seen.itemShop) { R.tut = {i:0, steps:SHOP_TUT, label:'老王小课堂'}; G.seen.itemShop = 1; save(); }
  // 第七关第一次开张：老王教串签
  if (i === 8 && !demo && !G.seen.scrape) { R.tut = {i:0, steps:SCRAPE_TUT, label:'老王小课堂'}; G.seen.scrape = 1; save(); }
  if (i === 6 && !demo && !G.seen.skewer) { R.tut = {i:0, steps:SKEWER_TUT, label:'老王小课堂'}; G.seen.skewer = 1; save(); }
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
  var L = R.L, p = pick(PEOPLE), k = ramp();
  var pat = L.pat * PAT_SCALE * (1 - .35 * k) * (G.up.horn ? 1.25 : 1) * rnd(.85, 1.15);
  var base = {band: pickBand(L),
    sauce: L.sauces.length && Math.random() < .7 ? pick(L.sauces) : null,
    spice: L.spices.length && Math.random() < .6 ? pick(L.spices) : null};
  var specs = [base];
  if (Math.random() < L.two + .15 * k) {
    // 两根：可能一根一个要求（火候 / 酱 / 小料都可以不同），但这种「混搭单」每局最多占客人总数的 25%
    var s2 = {band:base.band, sauce:base.sauce, spice:base.spice};
    var canMix = (R.mixed || 0) + 1 <= .25 * ((R.spawned || 0) + 1);
    if (canMix && Math.random() < .6) {
      var parts = [];
      if (L.bands.length > 1) parts.push('band');
      if (L.sauces.length) parts.push('sauce');
      if (L.spices.length) parts.push('spice');
      var pickParts = parts.filter(function () { return Math.random() < .5; });
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
  var sticky = has('oil') && R.oil < 25;
  var rate = (tut ? (tut.freeze ? 0 : 6) : 7) * heatMul() * (sticky ? 1.6 : 1) * R.heat;
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
      else if (c.state === 'flee' && c.timer <= 0) { R.st.fled++; log(c.name + ' 逃单跑了（-¥' + c.price + (L.endless ? '，-1❤' : '') + '）', 'bad'); if (L.endless) R.hearts--; c.gone = true; }
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
      log('先跟着老王做亮起来的那一步', 'bad'); nudge(); return;
    }
  }
  var sl = R.slots[i];
  switch (a) {
    case 'place':
      if (sl.s || sl.dirt) return;
      if (R.stock <= 0) { log('没有串好的肠了，先点「串一根」', 'bad'); return; }
      if (R.stock !== Infinity) R.stock--;
      sl.s = {a:0, b:0, down:'a'}; R.net -= COST; ding(300, .06);
      tutEvent('place'); break;
    case 'flip':
      if (!sl.s) return;
      sl.flipT = now();   // 防误触：刚点完翻面，同一格的「夹起」短时间内不响应
      // 粘锅时要点两下才能翻：第一下撬松（烤肠抖一下）
      if (has('oil') && R.oil < 25) {
        sl.pry = (sl.pry || 0) + 1; sl.jolt = now();
        if (sl.pry < 2) { log('粘住了！再撬一下', 'bad'); ding(110, .07); break; }
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
      if (R.oil > 85) { R.net -= COST; log('油溢出来了（-¥1）', 'bad'); }
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
      if (!G.up.fire || !HEAT_LV[i]) return;
      R.heatLv = i; ding(360 + i * 180, .08);
      log('火力调到' + HEAT_LV[i].name + '火' + (i === 2 ? '，小心烤焦' : i === 0 ? '，烤得慢但稳' : ''), '');
      break;
    case 'fire':
      R.fire = !R.fire; ding(R.fire ? 520 : 260, .12);
      log(R.fire ? '点火了，锅要热一会儿' : '已停火，烤肠不会再继续烤', R.fire ? 'good' : '');
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
function heatMul() { return G.up.fire ? HEAT_LV[R.heatLv == null ? 1 : R.heatLv].mul : 1; }
function blinkOn() { return Math.floor(now() / 250) % 2 === 0; }
function itemBar() {
  if (R.L.tutorial) return '';   // 第一关（教学关）不显示道具
  return '<div class="itembar">' + ITEMS.map(function (it, idx) {
    var n = G.items[it.id] || 0, off = it.id === 'hourglass' && R.L.endless;
    if (!n && G.bank < it.cost) off = true;
    var urge = it.id === 'hourglass' && urgeHourglass();
    return '<button class="itm' + (n ? '' : ' buy') + (urge ? ' urge' + (blinkOn() ? ' on' : '') : '') + '" data-act="useitem" data-i="' + idx + '"' + (off ? ' disabled' : '') + '>' +
      '<i>' + it.icon + '</i>' + (it.bar || it.name) + '<b>' + (n ? '×' + n : '¥' + it.cost) + '</b></button>';
  }).join('') + '</div>';
}
function useItem(i) {
  var it = ITEMS[i]; if (!it) return;
  var have = (G.items[it.id] || 0) > 0;
  if (!have && G.bank < it.cost) { log('存款不够买' + it.name, 'bad'); return; }
  if (it.id === 'hourglass') {
    if (R.L.endless) { log('无尽模式不能用沙漏', 'bad'); return; }
    R.bonusT = (R.bonusT || 0) + 30; R.urged = false; log('沙漏：时间 +30 秒', 'good');
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
    if (!done) { log('现在没有排队的客人', 'bad'); return; }
    log('烤肠课代表：' + done + ' 单瞬间做完！', 'good');
  } else if (it.id === 'candy') {
    var n = 0; R.cust.forEach(function (c) { if (c.state === 'wait') { c.pat = c.patMax; n++; } });
    if (!n) { log('现在没有排队的客人', 'bad'); return; }
    log('棒棒糖：' + n + ' 位客人耐心回满', 'good');
  }
  if (have) G.items[it.id]--;
  else { G.bank -= it.cost; log('花 ¥' + it.cost + ' 买了' + it.name + '，当场用掉', ''); }
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
function boxTotal() { return 1 + Math.min(2, G.up.boxb || 0); }   // 盒 A 固定有，最多再买 2 个
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
    R.st.caught++; log('喊住了 ' + c.name + (c.price ? '，补付 ¥' + c.price : ''), 'good'); if (c.price) receive(c.price); return;
  }
  if (c.state === 'paying' || c.state === 'leave') {
    if (c.served && !c.accused) { c.accused = true; R.hearts = Math.max(0, R.hearts - 1); R.st.wrong++; c.say = '我扫了啊！'; log('冤枉了 ' + c.name + '（-1❤）', 'bad'); }
    return;
  }
  if (anyBox(function (b) { return b.stage === 'box'; })) log('按住打包盒，拖到客人身上', 'bad');
  else if (anyBox(function (b) { return b.items.length; })) log('先装盒，再把盒子拖给客人', 'bad');
  else log('先从锅里夹起烤肠', 'bad');
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
    log(c.name + ' 差评：' + issues.join('、') + '不对（少收 ¥' + (full - c.price) + '，-1❤）', 'bad');
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
function startBagDrag(e, k) {
  var g = document.createElement('div'); g.className = 'ghost bagg';
  g.innerHTML = boxHTML('', R.boxes[k].items.length);
  document.body.appendChild(g);
  drag = {type:'bag', box:k, g:g, x0:e.clientX, y0:e.clientY, moved:false, over:null};
  moveDrag(e);
  render();
}
function moveDrag(e) {
  if (!drag) return;
  drag.g.style.left = e.clientX + 'px'; drag.g.style.top = e.clientY + 'px';
  if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 8) drag.moved = true;
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
  if (d.type === 'item') {
    var src = R.boxes[d.box], tb = dropTarget(e.clientX, e.clientY, 'item', d.box);
    if (tb && src.stage === 'open' && src.items[d.j]) {
      var to = +tb.getAttribute('data-box');
      R.boxes[to].items.push(src.items.splice(d.j, 1)[0]);
      ding(620, .05); log('挪到了盒 ' + 'ABC'.charAt(to), 'good');
    } else if (!d.moved) { if (smartOn()) toggleTomato(d.box, d.j); else R.sel = d.box; }
    else if (!G.up.boxb) log('解锁盒 B 后，装错的烤肠可以挪过去', 'bad');
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
function walkStyle(p) { p = Math.max(0, Math.min(1, p)); return ' style="transform:translateX(' + (p * 70).toFixed(1) + '%);opacity:' + (1 - p * .75).toFixed(2) + '"'; }
function patColor(r) { return r > .5 ? 'var(--good)' : r > .25 ? 'var(--gold)' : 'var(--red)'; }
function chip(field, sp) {
  if (field === 'band') return '<span class="chip b-' + sp.band + '">' + sp.band + '</span>';
  if (field === 'sauce') return '<span class="chip">' + (sp.sauce ? SHORT[sp.sauce] : '不要酱') + '</span>';
  return '<span class="chip">' + (sp.spice ? '撒' + sp.spice : '不要料') + '</span>';
}
function orderHTML(c) {
  var sp = c.specs, fields = ['band', 'sauce'].concat(R.L.spices.length ? ['spice'] : []);
  var diff = sp.length === 2 ? fields.filter(function (f) { return sp[0][f] !== sp[1][f]; }) : [];
  var h = '<span class="q">' + (sp.length === 2 ? '两根' : '一根') + '</span>';
  fields.forEach(function (f) { if (diff.indexOf(f) < 0) h += chip(f, sp[0]); });
  if (diff.length) [0, 1].forEach(function (k) {
    h += '<span class="ln"><i>' + (k ? '②' : '①') + '</i>' + diff.map(function (f) { return chip(f, sp[k]); }).join('') + '</span>';
  });
  return h;
}
function render() {
  if (!R) return;
  var L = R.L, g = L.goal, st = tutStep(), k;
  var left = Math.max(0, L.time + (R.bonusT || 0) - R.t);

  // 教学讲解条 / HUD
  $('coach').hidden = !st; $('hud').hidden = !!st;
  if (st) {
    var showBtn = st.btn && (!st.until || st.until());
    setHTML('coach', '<div class="who">👨‍🍳</div><div class="step">' + R.tut.label + ' ' + (R.tut.i + 1) + ' / ' + R.tut.steps.length + '</div>' +
      '<p>' + st.text + '</p>' + (st.extra ? st.extra() : '') + '<div class="row"><button class="skip" data-act="tutskip">' + (R.tut.steps === TUT ? '跳过教学' : '跳过') + '</button>' + (st.btn2 ? '<button class="alt" data-act="' + st.btn2[1] + '" data-i="' + R.i + '">' + st.btn2[0] + '</button>' : '') +
      (showBtn ? '<button class="next" data-act="tutnext">' + st.btn + '</button>' : '') + '</div>');
  } else {
    setHTML('hud', '<div class="lv">' + (L.endless ? '无尽模式' : '第 ' + (R.i + 1) + ' 关 · ' + L.name) + '</div>' +
      '<button class="pause mus' + (musicOn() ? '' : ' off') + '" data-act="music" aria-label="背景音乐">♪</button>' +
      '<button class="pause" data-act="menu">暂停</button>' +
      '<div class="stats">' +
        '<div class="stat' + (g.money != null && R.net >= g.money ? ' done' : '') + '"><b>¥' + R.net + (g.money != null ? ' / ' + g.money : '') + '</b><span>' + (L.endless ? '本局净赚' : '本关净赚') + '</span></div>' +
        '<div class="stat' + (g.hearts != null && R.hearts >= g.hearts ? ' done' : '') + (L.endless && R.hearts <= 2 ? ' low' : '') + '"><b>❤ ' + R.hearts + (g.hearts != null ? ' / ' + g.hearts : '') + '</b><span>' + (L.endless ? '口碑' : '爱心') + '</span></div>' +
        '<div class="stat' + (urgeHourglass() && blinkOn() ? ' hurry' : '') + '"><b>' + fmtT(L.endless ? R.t : left) + '</b><span>' + (L.endless ? '已营业' : '剩余时间') + '</span></div>' +
      '</div>' + (L.endless ? '' : '<div class="timebar"><i style="width:' + Math.min(100, left / (L.time + (R.bonusT || 0)) * 100) + '%"></i></div>') +
      itemBar());
  }
  $('speaker').className = 'speaker' + spot('speaker');

  // 顾客
  var q = '';
  for (k = 0; k < MAXQ; k++) {
    var c = R.cust[k];
    if (!c) { q += '<div class="cust empty">等下一位…</div>'; continue; }
    var r = Math.max(0, c.pat / c.patMax);
    var cls = 'cust';
    var style = '';
    if (c.state === 'wait' && anyBox(function (b) { return b.stage === 'box'; })) cls += ' ready';
    if (c.state === 'wait' && drag && drag.type === 'bag' && drag.over === c.id) cls += ' drop';
    if (c.state === 'flee') { if (G.up.cam) cls += ' cam'; style = walkStyle(1 - c.timer / 3.2); }
    if (c.state === 'leave') style = walkStyle(1 - c.timer / 1);
    if (c.tag) cls += spot(c.tag);
    var clickable = c.state !== 'leave' || (c.served && !c.accused);
    q += '<div class="' + cls + '"' + style + (clickable ? ' data-act="cust" data-i="' + c.id + '"' : '') + (c.state === 'wait' ? ' data-cid="' + c.id + '"' : '') + (c.tag ? ' data-tag="' + c.tag + '"' : '') + '>' +
      '<div class="who"><span class="face">' + c.face + '</span>' + (c.got ? '<i class="minibag"></i>' : '') + '<span class="name">' + c.name + '</span></div>' +
      '<div class="bubble">' + orderHTML(c) + '</div>' +
      (c.state === 'wait' ? '<div class="pat"><i style="width:' + (r * 100) + '%;background:' + patColor(r) + '"></i></div>' : '') +
      (c.say ? '<div class="say">' + c.say + '</div>' : '') + '</div>';
  }
  $('queue').innerHTML = q;

  // 锅
  var sticky = has('oil') && R.oil < 25;
  var info = $('grillInfo');
  info.textContent = !R.fire ? (R.heat > .05 ? '正在熄火…' : '已停火') : R.heat < .95 ? '正在升温…' : sticky ? '油不够，粘锅了！快加油' : '朝下的一面在烤 · 点烤肠翻面';
  info.className = sticky && R.fire ? 'warn' : '';
  $('grill').className = 'grill' + (R.heat < .5 ? ' off' : '');
  var lv = R.heatLv == null ? 1 : R.heatLv;
  setHTML('fireCtl', (G.up.fire ? '<span class="heat">' + HEAT_LV.map(function (h, k) {
      return '<button class="hl' + (k === lv ? ' on' : '') + '" data-act="heatlv" data-i="' + k + '">' + h.name + '</button>';
    }).join('') + '</span>' : '') +
    '<button class="b fire' + (R.fire ? ' on' : '') + spot('fire') + '" data-act="fire"><i class="flame"></i>' + (R.fire ? '停火' : '点火') + '</button>');
  var slotsEl = $('slots');
  slotsEl.className = 'slots' + (R.slots.length === 4 ? ' c4' : '');
  slotsEl.innerHTML = R.slots.map(function (sl, i) {
    var lockTut = !!st && i !== 0;
    if (sl.dirt) {
      var rubbed = Math.floor((sl.scrub || 0) / 2);
      return '<div class="slot"><div class="slot-btn dirt p' + rubbed + (i === 0 ? spot('scrape0') : '') + '" data-rub="' + i + '">铲锅巴<small>来回蹭 ' + SCRAPE_RUBS + ' 下</small><span class="rubdots">' +
        new Array(SCRAPE_RUBS + 1).join('·').split('').map(function (x, k) { return k < rubbed ? '●' : '○'; }).join('') + '</span></div></div>';
    }
    if (!sl.s) {
      var can = R.stock > 0;
      return '<div class="slot"><button class="slot-btn' + (lockTut ? ' locked' : '') + (i === 0 ? spot('place0') : '') + '" data-act="place" data-i="' + i + '">' +
        (can ? '放一根' : '先串肠') + '<small>进价 ¥' + COST + '</small></button></div>';
    }
    var s = sl.s, j = judge(s), up = s.down === 'a' ? 'b' : 'a';
    function m(lab, v, isDown) {
      return '<span>' + lab + '</span><div class="meter' + (isDown ? ' down' : '') + '"><i style="width:' + Math.min(100, v) + '%;background:' + col(v) + '"></i>' +
        [40, 70, 88].map(function (x) { return '<span class="tk" style="left:' + x + '%"></span>'; }).join('') + '</div>';
    }
    var jolt = sl.jolt && now() - sl.jolt < 260;
    return '<div class="slot' + (sticky ? ' sticky' : '') + (jolt ? ' jolt' : '') + (i === 0 ? spot('slot0') : '') + '">' +
      '<span class="tag ' + j + '">' + ({raw:'还生', burnt:'焦了！'}[j] || JUDGE_TEXT[j]) + '</span>' +
      '<div class="saus-area tap' + (i === 0 ? spot('flip0') : '') + '" data-act="flip" data-i="' + i + '"><span class="stick"></span><div class="saus' + (j === 'burnt' ? ' smoke' : '') + (sticky ? ' scorch' : '') + '" style="background:linear-gradient(180deg,' + col(s[up]) + ' 0,' + col(s[up]) + ' 50%,' + col(s[s.down]) + ' 50%,' + col(s[s.down]) + ' 100%)"></div></div>' +
      '<div class="meters">' + m('上', s[up], false) + m('下', s[s.down], true) + '</div>' +
      '<div class="sbtns">' +
      '<button class="b ' + (j === 'burnt' ? 'red' : 'hot') + (i === 0 ? spot('pick0') : '') + '" data-act="pick" data-i="' + i + '">夹起</button></div></div>';
  }).join('');

  var tools = [];
  if (has('oil')) tools.push('<div class="tl"><span class="lab">油 ' + Math.round(R.oil) + '%</span><div class="oilbar"><i style="width:' + R.oil + '%"></i><span class="lo"></span><span class="hi"></span></div><button class="b" data-act="oil">加油</button></div>');
  if (has('skewer')) tools.push('<div class="tl"><span class="lab">串好的肠</span><span class="stock">' + R.stock + ' / ' + SKEWER_MAX + '</span><button class="b hot" data-act="skewer"' + (R.stock >= SKEWER_MAX ? ' disabled' : '') + '>串一根</button></div>');
  var gt = $('gtools'); gt.className = 'gtools' + (tools.length === 2 ? ' two' : '');
  setHTML('gtools', tools.join(''));

  // 打包台：两个独立的盒子，各自 装烤肠 → 装盒 → 拖给客人
  var t0 = now();
  var nbox = Math.max(2, boxTotal());
  var panels = [0, 1, 2].slice(0, nbox).map(function (k) {
    if (!boxOpen(k)) {
      return '<div class="bx locked" data-act="selbox" data-i="' + k + '"><div class="bx-h"><b>盒 ' + 'ABC'.charAt(k) + '</b><span></span></div>' +
        '<div class="lockbody"><i class="lock"></i><b>未解锁</b><span>在「升级小摊」花 ¥' + UPGRADES.filter(function (u) { return u.id === 'boxb'; })[0].cost[Math.min(1, G.up.boxb || 0)] + ' 解锁</span></div></div>';
    }
    var b = R.boxes[k], n = b.items.length, pf = b.fx && t0 - b.fx.t < 900 ? b.fx.kind : '';
    var sum = n ? (n === 2 ? '两根' : '一根') + ' · ' + (JUDGE_TEXT[b.items[0].band] || b.items[0].band) + ' · ' + (b.items[0].sauce ? SHORT[b.items[0].sauce] : '无酱') + (L.spices.length ? ' · ' + (b.items[0].spice || '无料') : '') : '';
    var body, btn;
    if (b.stage === 'box') {
      var lifted = drag && drag.type === 'bag' && drag.box === k;
      body = '<div class="bx-stage"><div class="bagwrap' + spot('bag' + k) + (lifted ? ' lifted' : '') + '" data-bag="' + k + '">' + boxHTML(pf === 'box', n) + '</div><div class="sum">' + sum + '</div></div>';
      btn = '<button class="b pk" disabled>拖给客人 ↑</button>';
    } else {
      body = '<div class="bx-items">' + [0, 1].map(function (j) {
        var t = b.items[j];
        if (!t) return '<div class="bitem empty">' + (j === 0 ? '空盒' : '可再放一根') + '</div>';
        var fresh = t.fx && t0 - t.fx.t < 900 ? t.fx.kind : '';
        return '<div class="bitem' + spot('item' + k + j) + (k === 0 && t.band === '脆' ? spot('crisp') : '') + '" data-item="' + k + '-' + j + '">' + traySvg(t, fresh) +
          '<span><b class="bd-' + t.band + '">' + (JUDGE_TEXT[t.band] || t.band) + '</b>' + (t.sauce ? SHORT[t.sauce] : '无酱') + (L.spices.length ? '·' + (t.spice || '无料') : '') + '</span></div>';
      }).join('') + '</div>';
      btn = '<button class="b pk hot' + spot('pack' + k) + '" data-act="pack" data-i="' + k + '"' + (n ? '' : ' disabled') + '>装盒</button>';
    }
    return '<div class="bx' + (k === R.sel ? ' sel' : '') + spot('box' + k) + '" data-box="' + k + '" data-act="selbox" data-i="' + k + '">' +
      '<div class="bx-h"><b>盒 ' + 'ABC'.charAt(k) + '</b><span>' + (k === R.sel && boxOpen(1) ? '夹起放这里' : '') + '</span>' +
      '<button class="x" data-act="dump" data-i="' + k + '"' + (n ? '' : ' disabled') + '>倒掉</button></div>' + body + btn + '</div>';
  });
  var canTop = anyBox(function (b) { return b.stage === 'open' && b.items.length; });
  var off = canTop ? '' : ' disabled';
  var h = '<div class="box-h"><span>打包台 · 一根¥' + PRICE1 + ' / 两根¥' + PRICE2 + '</span>' + (smartOn() ? '<em class="smart">' + smartLabel() + '</em>' : '') + '</div>' +
          '<div class="bxrow' + (nbox === 3 ? ' n3' : '') + '">' + panels.join('') + '</div>';
  var tl = L.sauces.map(function (v) {
    return '<button class="b tool' + spot('tool-' + v) + '" data-tool="sauce" data-v="' + v + '" style="--c:' + SAUCE_COL[v] + '"' + off + '><i class="bottle"></i><span>' + SHORT[v] + '</span></button>';
  }).concat(L.spices.map(function (v) {
    return '<button class="b tool" data-tool="spice" data-v="' + v + '" style="--c:' + SPICE_COL[v] + '"' + off + '><i class="shaker"></i><span>' + v + '</span></button>';
  }));
  if (tl.length) h += '<div class="tools n' + Math.max(3, tl.length) + '">' + tl.join('') + '</div>';
  setHTML('trayBox', h);
}

/* ============ 竖屏适配：内容高于屏幕时整体等比缩小 ============ */
function fit() {
  // 画面放不下时整体等比缩小，但先把布局宽度放大 1/缩放倍数，缩完后看上去仍是满宽（不会变窄）
  var app = $('app'), vw = window.innerWidth || document.documentElement.clientWidth;
  var W = Math.min(464, vw - 16), left = Math.max(8, (vw - W) / 2);
  app.style.transform = ''; app.style.marginBottom = ''; app.style.width = ''; app.style.maxWidth = ''; app.style.marginLeft = '';
  var cs = window.getComputedStyle ? getComputedStyle(app) : null;
  var gap = cs ? (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0) : 0;
  var vh = (window.innerHeight || document.documentElement.clientHeight) - gap;
  var sc = Math.min(1, vh / app.offsetHeight);
  for (var n = 0; n < 3 && sc < .995; n++) {
    app.style.width = (W / sc).toFixed(1) + 'px'; app.style.maxWidth = 'none';
    sc = Math.max(.5, Math.min(1, vh / app.offsetHeight));
  }
  if (sc < .995) {
    app.style.width = (W / sc).toFixed(1) + 'px'; app.style.maxWidth = 'none';
    app.style.marginLeft = left.toFixed(1) + 'px';
    app.style.transformOrigin = '0 0';
    app.style.transform = 'scale(' + sc.toFixed(3) + ')';
    app.style.marginBottom = (-app.offsetHeight * (1 - sc)).toFixed(0) + 'px';
  } else {
    app.style.width = '';
  }
  document.documentElement.style.setProperty('--appw', W.toFixed(1) + 'px');
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
  showOverlay('<div class="kicker">' + (inGame ? '已暂停 · 第 ' + (R.i + 1) + ' 关 · ' + R.L.name : '放学时间 · 17:00 · 实验二小东门') + '</div>' +
    '<h1>校门口<em>烤肠摊</em></h1>' +
    (inGame ? pauseShop(R.L.endless) : '') +
    (inGame ? '' : '<p>一根 <span class="price">¥3</span>，两根 <span class="price">¥5</span>。</p>') +
    (inGame ? '' : '<div class="lvgrid">' + LEVELS.map(function (L, i) {
      if (L.endless) {
        var best = G.best || {money:0, time:0}, open = G.cleared >= ENDLESS;
        return '<button class="lvbtn endless" data-act="intro" data-i="' + i + '"' + (open ? '' : ' disabled') + '>' +
          '<i class="no">课外活动</i><b>无尽模式</b><span>' + (open ? (best.money ? '最高 ¥' + best.money + ' · 最久 ' + fmtT(best.time) : '口碑扣光前，能赚多少？') : '通关第 10 关解锁') + '</span></button>';
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
// 关卡开场：过关目标 + 时间 + 锅位 三张卡片
function goalCards(L) {
  if (L.endless) {
    return '<div class="gcs"><div class="gc main"><span>玩法</span><b>口碑 ❤' + ENDLESS_HEARTS + '<br>扣光收摊</b></div>' +
      '<div class="gc"><span>营业时间</span><b>不限时</b></div>' +
      '<div class="gc"><span>锅位</span><b>' + L.slots + ' 个</b></div></div>';
  }
  var g = L.goal, goal = [];
  if (g.money != null) goal.push('净赚 ¥' + g.money);
  if (g.hearts != null) goal.push('❤ ' + g.hearts + ' 颗');
  return '<div class="gcs"><div class="gc main"><span>过关目标</span><b>' + goal.join('<br>') + '</b></div>' +
    '<div class="gc"><span>营业时间</span><b>' + L.time + ' 秒</b></div>' +
    '<div class="gc"><span>锅位</span><b>' + L.slots + ' 个</b></div></div>';
}
function intro(i) {
  var L = LEVELS[i];
  showOverlay('<div class="kicker">' + (L.endless ? '课外活动' : '第 ' + (i + 1) + ' 关 / 共 10 关') + '</div><h1>' + L.name + '</h1>' +
    goalCards(L) +
    '<ul class="rules">' + L.news.map(function (n) { return '<li>' + n + '</li>'; }).join('') +
    '</ul>' +
    '<div class="actions"><button class="b red" data-act="go" data-i="' + i + '">' + (L.tutorial ? '开始教学' : '开始出摊') + '</button><button class="b" data-act="menu">返回</button>' +
    '</div>' + (L.tutorial ? '' : pauseShop(!!L.endless)));
}
function finish(win, why) {
  R.over = true; clearDemo(); render();
  var gain = Math.max(0, R.net); G.bank += gain;
  if (win && R.i + 1 > G.cleared) G.cleared = R.i + 1;
  save();
  var s = R.st, i = R.i;
  shareInfo = {endless:false, win:win, why:why, lv:i + 1, name:R.L.name.replace('教学关·', ''), net:R.net, hearts:R.hearts, sold:s.sold};
  showResult('<div class="kicker">' + (win ? '奖　状' : why === 'hearts' ? '收摊了' : '时间到') + '</div><h1>' + (win ? (i === 9 ? '你就是<em>校门口之王</em>！' : '目标达成！') : why === 'hearts' ? '爱心扣光了…' : '差一点点…') + '</h1>' +
    '<div class="res"><div><b>¥' + R.net + '</b><span>本关净赚</span></div><div><b>❤ ' + R.hearts + '</b><span>爱心</span></div>' +
    '<div><b>' + s.sold + '</b><span>成交单数</span></div></div>' +
    '<p>存款 +¥' + gain + '，现在共 <span class="bankv">¥' + G.bank + '</span>。</p>' +
    '<div class="actions">' + (win && i < 9 ? '<button class="b red wide" data-act="intro" data-i="' + (i + 1) + '">下一关</button>' : '') +
    (win && i === 9 ? '<button class="b red wide" data-act="intro" data-i="' + ENDLESS + '">解锁了！挑战无尽模式</button>' : '') +
    '<button class="b' + (win ? '' : ' hot') + '" data-act="go" data-i="' + i + '">再来一次</button><button class="b" data-act="menu">关卡列表</button>' +
    '<button class="b" data-act="shop">升级小摊</button>' + shopToggle(false) + '<button class="b red wide share" data-act="share">分享战绩</button></div>', win ? 'award' : '');
}
function finishEndless() {
  R.over = true; clearDemo(); render();
  var gain = Math.max(0, R.net); G.bank += gain;
  var best = G.best || {money:0, time:0}, rec = R.net > best.money;
  G.best = {money:Math.max(best.money, R.net), time:Math.max(best.time, Math.floor(R.t))};
  save();
  shareInfo = {endless:true, rec:rec, net:R.net, time:R.t, sold:R.st.sold, best:G.best.money};
  showResult('<div class="kicker">' + (rec ? '奖　状' : '收摊了') + '</div><h1>' + (rec ? '新纪录！' : '口碑扣光了') + '</h1>' +
    '<div class="res"><div><b>¥' + R.net + '</b><span>本局净赚</span></div><div><b>' + fmtT(R.t) + '</b><span>坚持时间</span></div>' +
    '<div><b>' + R.st.sold + '</b><span>成交单数</span></div></div>' +
    '<p>最高纪录 ¥' + G.best.money + ' · 最久 ' + fmtT(G.best.time) + '。存款 +¥' + gain + '，现在共 <span class="bankv">¥' + G.bank + '</span>。</p>' +
    '<div class="actions"><button class="b red" data-act="go" data-i="' + ENDLESS + '">再来一局</button><button class="b" data-act="menu">关卡列表</button>' +
    '<button class="b" data-act="shop">升级小摊</button>' + shopToggle(true) + '<button class="b red wide share" data-act="share">分享战绩</button></div>', rec ? 'award' : '');
}
function pauseShop(endless) {
  return '<div class="pshop" data-endless="' + (endless ? 1 : 0) + '"><div class="pshop-h">道具商店<small>存款 ¥' + G.bank + '</small></div><div class="prow">' + ITEMS.map(function (it, idx) {
    var off = it.id === 'hourglass' && endless;
    return '<div class="pitem' + (off ? ' off' : '') + '"><i>' + it.icon + '</i><b>' + it.name + '</b><small>' + (off ? '无尽模式不可用' : it.short) + '</small>' +
      '<span>已有 ' + (G.items[it.id] || 0) + '</span><button class="b hot" data-act="buyitem" data-i="' + idx + '"' + (G.bank < it.cost || off ? ' disabled' : '') + '>¥' + it.cost + '</button></div>';
  }).join('') + '</div></div>';
}
/* ============ 分享战绩：画一张战绩卡 → 发小红书笔记 / 存相册 ============ */
var shareInfo = null, lastResult = null, shareURL = '';
function showResult(html, cls) { lastResult = {html:html, cls:cls}; showOverlay(html, cls); }
function hasBridge() { return !!(window.xhs && window.xhs.miniTool && typeof window.xhs.miniTool.postNote === 'function'); }
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// 分享文案：三套口吻，每次打开分享随机一套（卡片标语、笔记标题、正文保持同一套）
var SHARE_COPY = [
  {title:'我在校门口卖烤肠！', tag:'你能比我卖得好吗？',
   lv:function (i, v) { return '第 ' + i.lv + ' 关「' + i.name + '」' + v + '净赚 ¥' + i.net + '，爱心 ' + i.hearts + '，成交 ' + i.sold + ' 单。你能比我卖得好吗？'; },
   en:function (i) { return '在实验二小门口的无尽模式里坚持了 ' + fmtT(i.time) + '，净赚 ¥' + i.net + '，成交 ' + i.sold + ' 单！' + (i.rec ? '刷新了最高纪录～' : '') + '你能坚持更久吗？'; }},
  {title:'放学铃一响，我的烤肠摊开张了', tag:'来校门口跟我比比？',
   lv:function (i, v) { return '放学铃一响就开摊！第 ' + i.lv + ' 关「' + i.name + '」' + v + '今天净赚 ¥' + i.net + '，收获爱心 ' + i.hearts + ' 颗，卖出 ' + i.sold + ' 单。来实验二小门口跟我比比？'; },
   en:function (i) { return '放学铃一响就开摊！无尽模式守了 ' + fmtT(i.time) + '，卖出 ' + i.sold + ' 单，净赚 ¥' + i.net + '。' + (i.rec ? '又破纪录啦～' : '') + '来实验二小门口跟我比比？'; }},
  {title:'今日烤肠摊战报来啦', tag:'香味飘进校门啦，你也来试试！',
   lv:function (i, v) { return '烤肠摊老板打卡：第 ' + i.lv + ' 关「' + i.name + '」' + v + '¥' + i.net + ' 进账、爱心 ' + i.hearts + '、成交 ' + i.sold + ' 单～香味都飘进校门了，你也来试试？'; },
   en:function (i) { return '烤肠摊老板打卡：无尽模式撑了 ' + fmtT(i.time) + '，' + i.sold + ' 单、¥' + i.net + ' 进账～' + (i.rec ? '新纪录到手！' : '') + '香味都飘进校门了，你也来试试？'; }}
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
    ? [['净赚', '¥' + info.net], ['坚持', fmtT(info.time)], ['成交', info.sold + ' 单']]
    : [['净赚', '¥' + info.net], ['爱心', '❤ ' + info.hearts], ['成交', info.sold + ' 单']];
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
  c.fillStyle = '#4FBF7A'; c.font = 'bold 26px ' + F; c.fillText('今日到账 ¥' + info.net, 346, 253);
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
  var tag = info.endless && info.best ? '最高纪录 ¥' + info.best + '，' + shareCopy.tag : shareCopy.tag, fs = 30;
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
  var box = document.querySelector('#overlay .pshop'); if (!box) return;
  var tmp = document.createElement('div'); tmp.innerHTML = pauseShop(box.getAttribute('data-endless') === '1');
  box.parentNode.replaceChild(tmp.firstChild, box);
  var bl = document.querySelector('#overlay .bankline b'); if (bl) bl.textContent = '¥' + G.bank;
  var bv = document.querySelector('#overlay .bankv'); if (bv) bv.textContent = '¥' + G.bank;
}
function shopBack(from) {
  // 从关卡开场进来 → 回开场；游戏暂停中进来 → 回暂停；否则回关卡列表
  var nxt = Math.min(G.cleared, 9);
  if (from != null && !isNaN(from)) return '<button class="b red" data-act="go" data-i="' + from + '">开始出摊</button><button class="b" data-act="intro" data-i="' + from + '">返回</button>';
  if (R && !R.over && !R.demo) return '<button class="b wide" data-act="menu">回到暂停</button>';
  return '<button class="b red" data-act="intro" data-i="' + nxt + '">去第 ' + (nxt + 1) + ' 关</button><button class="b" data-act="menu">关卡列表</button>';
}
function shop() {
  showOverlay('<div class="kicker">存款 ¥' + G.bank + '</div><h1>升级小摊</h1><p class="sub">永久有效</p><div>' + UPGRADES.map(function (u, idx) {
    var lv = G.up[u.id] || 0, maxed = lv >= u.max, c = u.cost[lv];
    return '<div class="up"><div><b>' + u.name + (u.max > 1 ? ' · ' + lv + '/' + u.max : '') + '</b><small>' + u.desc + '</small></div>' +
      '<button class="b' + (maxed ? '' : ' hot') + '" data-act="buy" data-i="' + idx + '"' + (maxed || G.bank < c ? ' disabled' : '') + '>' + (maxed ? '已拥有' : '¥' + c) + '</button></div>';
  }).join('') + '</div>' +
    '<div class="actions">' + shopBack(null) + '</div>');
}

/* ============ 事件 ============ */
document.addEventListener('pointerdown', function (e) {
  kickAudio();
  var bagEl = e.target.closest('[data-bag]');
  if (bagEl) {
    e.preventDefault();
    var bk2 = +bagEl.getAttribute('data-bag');
    if (!R || R.over || R.paused || !R.boxes[bk2] || R.boxes[bk2].stage !== 'box') return;
    if (!tutAllows('serve')) { log('先跟着老王做亮起来的那一步', 'bad'); nudge(); return; }
    startBagDrag(e, bk2); return;
  }
  var itemEl = e.target.closest('[data-item]');
  if (itemEl && R && !R.over && !R.paused && !R.tut) {
    var kj = itemEl.getAttribute('data-item').split('-'), ib = R.boxes[+kj[0]];
    if (ib && ib.stage === 'open' && ib.items[+kj[1]]) { e.preventDefault(); startItemDrag(e, +kj[0], +kj[1]); return; }
  }
  var rubEl = e.target.closest('[data-rub]');
  if (rubEl) {
    e.preventDefault();
    if (!R || R.over || R.paused) return;
    var rst = tutStep();
    if (rst && !tutAllows('scrape') && !(rst.free && rst.free.scrape)) { log('先跟着老王做亮起来的那一步', 'bad'); nudge(); return; }
    rub = {id:e.pointerId, i:+rubEl.getAttribute('data-rub'), lx:e.clientX, ly:e.clientY, ax:{dir:0, run:0}, ay:{dir:0, run:0}, moved:false};
    return;
  }
  var tool = e.target.closest('[data-tool]');
  if (tool) {
    e.preventDefault();
    if (tool.disabled || !R || R.over || R.paused) return;
    if (!tutAllows('topping')) { log('先跟着老王做亮起来的那一步', 'bad'); nudge(); return; }
    startDrag(tool, e); return;
  }
  var el = e.target.closest('[data-act]'); if (!el) return;
  if (el.disabled) { if (tutStep()) { log('先跟着老王做亮起来的那一步', 'bad'); nudge(); } return; }
  var a = el.getAttribute('data-act'), i = +el.getAttribute('data-i');
  e.preventDefault();
  if (a === 'music') { G.music = !musicOn(); save(); syncMusic(); if (el.closest('#overlay')) menu(); else render(); return; }
  if (a === 'menu') return menu();
  if (a === 'intro') return intro(i);
  if (a === 'go') return startLevel(i);
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
// 铲锅巴：手指在锅巴上来回蹭。每朝一个方向滑够 18px 算一笔，一来一回（2 笔）算蹭一下，蹭够 SCRAPE_RUBS 下就铲掉
var SCRAPE_RUBS = 2, rub = null;
function rubAxis(st, d) {
  if (!d) return false;
  var sg = d > 0 ? 1 : -1;
  if (sg !== st.dir) { st.dir = sg; st.run = 0; st.done = false; }
  st.run += Math.abs(d);
  if (!st.done && st.run >= 18) { st.done = true; return true; }
  return false;
}
function rubMove(e) {
  if (!rub || e.pointerId !== rub.id) return;
  e.preventDefault();
  var dx = e.clientX - rub.lx, dy = e.clientY - rub.ly; rub.lx = e.clientX; rub.ly = e.clientY;
  var sl = R && R.slots[rub.i]; if (!sl || !sl.dirt || R.over || R.paused) { rub = null; return; }
  if (Math.abs(dx) >= Math.abs(dy) ? rubAxis(rub.ax, dx) : rubAxis(rub.ay, dy)) {
    sl.scrub = (sl.scrub || 0) + 1; rub.moved = true;
    ding(150 + Math.random() * 60, .06, .35, 'sawtooth');
    if (sl.scrub >= SCRAPE_RUBS * 2) { var ri = rub.i; rub = null; act('scrape', ri); return; }
    render();
  }
}
function rubEnd(e) {
  if (!rub || e.pointerId !== rub.id) return;
  if (!rub.moved) log('锅巴粘得牢，要用手指在上面来回蹭两下', 'bad');
  rub = null;
}
document.addEventListener('pointermove', rubMove, {passive:false});
document.addEventListener('pointerup', rubEnd);
document.addEventListener('pointercancel', function (e) { if (rub && e.pointerId === rub.id) rub = null; });
document.addEventListener('pointermove', moveDrag);
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', cancelDrag);
document.addEventListener('visibilitychange', function () {
  if (document.hidden && R && !R.over && !R.demo && !R.paused) menu();
  syncMusic();
  last = now();
});

/* ============ 防误触：不让页面被放大、滑动、回弹或弹出系统菜单 ============ */
(function guardTouch() {
  var opt = {passive:false};
  function inScroller(t) { return t && t.closest && t.closest('.overlay'); }
  // 双指缩放、页面拖动 / 回弹 / 下拉；弹窗内部仍可上下滑
  document.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 1) { e.preventDefault(); return; }
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

/* 开场：摆一个营业中的样子，再弹出关卡列表 */
startLevel(Math.min(G.cleared, 9), true);
R.paused = true; R.demo = true; R.tut = null; $('coach').hidden = true;
R.slots[0].s = {a:52, b:31, down:'b'};
R.slots[1].s = {a:74, b:70, down:'a'};
R.boxes[0].items = [{band:'嫩', sauce:'番茄', spice:null}];
spawn(); spawn(); R.cust[0].pat *= .6;
render(); fit(); menu();
requestAnimationFrame(loop);

/* 调试入口：仅在地址带 #debug 时暴露，供快进测试 */
if (location.hash === '#debug') {
  window.__sausage = {state:function () { return R; }, tick:tick, render:render, act:act, applyTopping:applyTopping, tutGo:tutGo, deliver:deliver};
}
})();
