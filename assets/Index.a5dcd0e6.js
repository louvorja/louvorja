import{_,by as k,r as h,o as i,c as f,w,a as l,F as b,e as p,t as y,b as x,y as V}from"./index.0bd43ae6.js";import{L}from"./Window.29575377.js";import{V as v}from"./VSkeletonLoader.d4bc4e4b.js";const C={name:"LyricModule",components:{Window:L},computed:{module_id(){return k.id},module(){return this.$modules.get(this.module_id)},config(){var t;return(t=this.module)==null?void 0:t.config},lyric(){var t,r,a;return(a=(r=(t=this.module)==null?void 0:t.data)==null?void 0:r.lyric)==null?void 0:a.slice().sort((d,s)=>d.order-s.order)}},methods:{t(t){return this.$t(`modules.${this.module_id}.${t}`)}}},W={key:1},B={key:0};function F(t,r,a,d,s,e){var m,n,c,u;const g=h("Window");return i(),f(g,{modelValue:e.module.show,"onUpdate:modelValue":r[0]||(r[0]=o=>e.module.show=o),title:(m=e.config)==null?void 0:m.title,subtitle:((n=e.config)==null?void 0:n.subtitle)+(((c=e.config)==null?void 0:c.track)>0?" | "+e.t("track")+" "+e.config.track:""),image:(u=e.config)!=null&&u.image?t.$path.file(e.config.image):"",closable:"",size:"small",onClose:r[1]||(r[1]=o=>t.$media.closeLyric())},{default:w(()=>[e.module.loading?(i(),f(v,{key:0,type:"text@5"})):(i(),l("div",W,[(i(!0),l(b,null,p(e.lyric,o=>(i(),l("div",{key:o.id_lyric},[o.aux_lyric?(i(),l("b",B,y(o.aux_lyric),1)):x("",!0),V(" "+y(o.lyric)+"\xA0 ",1)]))),128))]))]),_:1},8,["modelValue","title","subtitle","image"])}const D=_(C,[["render",F]]);export{D as default};
