import{_ as w,i as x,r as g,o as s,c as u,w as F,n as d,g as t,t as a,a as b,F as V,e as C,j as M,b as f,V as L}from"./index.0bd43ae6.js";import{L as T}from"./Window.29575377.js";import{L as p,V as v}from"./VTable.d9109990.js";const B={name:"AlbumModule",components:{Window:T,MusicMenuTable:p},computed:{module_id(){return x.id},module(){return this.$modules.get(this.module_id)},loading(){return this.$appdata.get("modules.album.loading")}},methods:{t(o){return this.$t(`modules.${this.module_id}.${o}`)}}},W={class:"text-right"},N={class:"text-right"},j={class:"d-flex justify-end"};function z(o,r,A,S,D,e){var m,n,c,i,h,_;const k=g("MusicMenuTable"),y=g("Window");return s(),u(y,{modelValue:e.module.show,"onUpdate:modelValue":r[0]||(r[0]=l=>e.module.show=l),title:(n=(m=e.module)==null?void 0:m.data)==null?void 0:n.name,image:(i=(c=e.module)==null?void 0:c.data)!=null&&i.url_image?o.$path.file(e.module.data.url_image):"",closable:"",compact:"","title-class":"text-h4 font-weight-light","image-size":125,color:(_=(h=e.module)==null?void 0:h.data)==null?void 0:_.color,onClose:r[1]||(r[1]=l=>o.$media.closeAlbum()),"slot-left-class":"w-100"},{left:F(()=>[e.loading?f("",!0):(s(),u(v,{key:0,"fixed-header":"",hover:"",class:"w-100 h-100",style:d({backgroundColor:e.module.data.color,color:"#FFF"})},{default:F(()=>[t("thead",null,[t("tr",null,[t("th",{class:"text-right",style:d({backgroundColor:e.module.data.color,color:"#FFF"})},a(e.t("table.track")),5),t("th",{class:"text-left",style:d({backgroundColor:e.module.data.color,color:"#FFF"})},a(e.t("table.music_name")),5),t("th",{class:"text-right",style:d({backgroundColor:e.module.data.color,color:"#FFF"})},a(e.t("table.duration")),5),t("th",{style:d({backgroundColor:e.module.data.color,color:"#FFF"})},null,4)])]),t("tbody",null,[(s(!0),b(V,null,C(e.module.data.musics,l=>(s(),b("tr",{key:l.id_music},[t("td",W,a(l.track),1),t("td",null,a(l.name),1),t("td",N,a(o.$datetime.shortTime(l.duration)),1),t("td",null,[t("div",j,[M(k,{color:"#FFF",id_music:l.id_music,has_instrumental_music:l.has_instrumental_music},null,8,["id_music","has_instrumental_music"])])])]))),128))])]),_:1},8,["style"])),e.loading?(s(),u(L,{key:1,color:"white",indeterminate:""})):f("",!0)]),_:1},8,["modelValue","title","image","color"])}const U=w(B,[["render",z]]);export{U as default};
