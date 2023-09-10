const fetch = require('node-fetch');

(async () => {
  const resp = await fetch('https://zt.baidu.com/activity/activitycommonv2/info?fr=icon&ek=ddc4e82&c=340&loc=(12695268.602172,2568418.016805)&b=(12694435,2566936,12696101,2569899)&bc=340&zoom=17.000000&stbar_height=20&phonebrand=&zid=uQ06LqwF_ds9WFPPSOP1GJgJ8s0ZFQ2CKDpmYbsJIuoCBmNXz5_s7BVJxSMa27nwexZ7XpNPkqP-oRy14VzoMuQ&ctm=1647592869.527000&screen=%281242%2C2208%29&patchver=&mlogid=2468481269&sesid=&co=&cuid=57d19e99fdade1ff12e0c3d25ada39ae&gid=&glv=&sv=15.6.0&mb=iPhone10%2C2&sinan=qhWotCultylL7N4ou1Fvos4eE&gk=1&oem=&channel=1008648b&resid=01&abtest=45313%2C44961%2C44950%2C45386%2C44872%2C101066%2C100795%2C101018%2C44845%2C44870%2C100897%2C101012%2C101003%2C101026%2C100999%2C100996%2C44855%2C100992%2C100528%2C100961%2C100852%2C100273%2C100789%2C100541%2C100810%2C100520%2C100903%2C100786%2C100557%2C100765%2C100785%2C101048%2C45117%2C100740%2C100773%2C100562%2C101050%2C100823%2C100543%2C101030%2C101044%2C100051%2C100975%2C100445%2C100800%2C101036%2C101058%2C100978%2C100783%2C100727%2C100919%2C100475%2C45378%2C100568&scene_code=1100000000110000&sub_ai_mode=0&os=iphone15.300000&dpi=%28489%2C489%29&isart=&cpu_abi=&ndid=&glr=Adreno&cpu=ARMv7&net=1&ver=1&bduid=cwgI1-bDfq4cJ&ai_mode=1&op_activity=&loc_x=12695268.602172&loc_y=2568418.016805&floor_id=&build_id=&ov=15.3.1&mapcenter=(12695268.602172,2568418.016805)&loc_cityname=%E6%B7%B1%E5%9C%B3%E5%B8%82&roam_c=340&roam_cityname=%E6%B7%B1%E5%9C%B3%E5%B8%82&roam_citytype=2&engine_version=40400&bbcuid=9B139D601F39D3F3030E0B0C63DB1AA7A04392C96OHACCNGGNF&miniapp_switch=1&ua=baidumap_IPHO&activity=pneumonia&point=(12695268.602172,2568418.016805)')
  if (resp.status === 200) {
    const data = await resp.json();
    console.log(data)
  }
})();
