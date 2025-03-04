import{_ as b,bx as g,r as o,o as d,c as u,w as n,g as t,x as m,j as i,t as r,a as c,F as w,e as V,b as y}from"./index.0bd43ae6.js";import{L as k}from"./Window.29575377.js";import{L as v,a as S}from"./InputSearch.67222a0d.js";import{L as x}from"./VTable.d9109990.js";import{V as L}from"./VAlert.dbb0530d.js";import"./VTextField.a62d9ad0.js";import"./VInput.95ec174b.js";const C={name:"Hymnal1996Module",components:{LWindow:k,LTable:v,LSearch:S,LMusicMenuTable:x},data:()=>({search:"",data:[],scroll:{},has_scroll:!1}),computed:{module_id(){return g.id},module(){return this.$modules.get(this.module_id)},classform(){return{group:"d-flex flex-wrap",group_item:"flex-shrink-1 flex-grow-1 d-flex flex-wrap justify-space-around"}},compact:function(){return this.$vuetify.display.width<=800}},methods:{t(e){return this.$t(`modules.${this.module_id}.${e}`)},onScroll(e){this.scroll=e},hasScroll(e){this.has_scroll=e},close(){this.search=""}}},z={class:"text-right"},B={class:"text-left"},M={class:"text-right"},j={class:"text-right"},H={class:"text-right"},N={class:"d-flex justify-end"},T={class:"w-100"},U={class:"text-right"};function F(e,s,A,D,E,l){const h=o("l-search"),_=o("l-music-menu-table"),f=o("l-table"),p=o("l-window");return d(),u(p,{modelValue:l.module.show,"onUpdate:modelValue":s[2]||(s[2]=a=>l.module.show=a),title:l.t("title"),icon:l.module.icon,closable:"",minimizable:"",compact:"",onClose:s[3]||(s[3]=a=>{l.close(),e.$modules.close(l.module_id)}),onMinimize:s[4]||(s[4]=a=>e.$modules.minimize(l.module_id)),onScroll:l.onScroll,onHasScroll:l.hasScroll,index:e.data.count},{header:n(()=>[t("div",{class:m(l.classform.group)},[t("div",{class:m(l.classform.group_item),style:{"flex-basis":"600px"}},[i(h,{modelValue:e.search,"onUpdate:modelValue":s[0]||(s[0]=a=>e.search=a),label:l.t("inputs.search"),error:e.data.filter_count<=0},null,8,["modelValue","label","error"])],2)],2)]),footer:n(()=>[t("div",T,[t("div",U,[t("small",null,r(l.t("data.records"))+": "+r(e.data.filter_count),1)])])]),default:n(()=>[i(f,{modelValue:e.data,"onUpdate:modelValue":s[1]||(s[1]=a=>e.data=a),search:e.search,letter:"",searchable_fields:{track:!0,name:!0},scroll:e.scroll,has_scroll:e.has_scroll,sort_by:"track",file:`${e.$i18n.locale}_hymnal_1996`},{default:n(()=>[t("thead",null,[t("tr",null,[t("th",z,r(l.t("table.track")),1),t("th",B,r(l.t("table.music_name")),1),t("th",M,r(l.t("table.duration")),1),s[5]||(s[5]=t("th",null,null,-1))])]),t("tbody",null,[(d(!0),c(w,null,V(e.data.data,a=>(d(),c("tr",{key:a.id_music},[t("td",j,r(a.track),1),t("td",null,r(a.name),1),t("td",H,r(e.$datetime.shortTime(a.duration)),1),t("td",null,[t("div",N,[i(_,{id_music:a.id_music,has_instrumental_music:a.has_instrumental_music},null,8,["id_music","has_instrumental_music"])])])]))),128))])]),_:1},8,["modelValue","search","scroll","has_scroll","file"]),e.search&&e.data.filter_count<=0?(d(),u(L,{key:0,type:"error",text:l.t("data.not_found"),variant:"tonal",border:"start",class:"ma-2"},null,8,["text"])):y("",!0)]),_:1},8,["modelValue","title","icon","onScroll","onHasScroll","index"])}const P=b(C,[["render",F]]);export{P as default};
