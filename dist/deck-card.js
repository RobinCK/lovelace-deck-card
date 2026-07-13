function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,_=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,f?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,A=x.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+S,M=`<${P}>`,L=document,H=()=>L.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,T="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,N=/>/g,D=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,V=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),K=new WeakMap,Z=L.createTreeWalker(L,129);function F(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,c,d=-1,l=0;for(;l<i.length&&(o.lastIndex=l,c=o.exec(i),null!==c);)l=o.lastIndex,o===U?"!--"===c[1]?o=z:void 0!==c[1]?o=N:void 0!==c[2]?(V.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=D):void 0!==c[3]&&(o=D):o===D?">"===c[0]?(o=r??U,d=-1):void 0===c[1]?d=-2:(d=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?D:'"'===c[3]?j:I):o===j||o===I?o=D:o===z||o===N?o=U:(o=D,r=void 0);const h=o===D&&t[e+1].startsWith("/>")?" ":"";n+=o===U?i+M:d>=0?(s.push(a),i.slice(0,d)+E+i.slice(d)+S+h):i+S+(-2===d?e:h)}return[F(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,d]=X(t,e);if(this.el=G.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=d[n++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),Z.nextNode(),a.push({type:2,index:++r});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=R(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);Z.currentNode=s;let r=Z.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=Z.nextNode(),n++)}return Z.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),R(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(F(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new G(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Q(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Y(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Y(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),n||=!R(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??B)===W)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(G,Q),(x.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Q(e.insertBefore(H(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const ct=ot.litElementPolyfillSupport;ct?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},lt=(t=dt,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}function ut(t,e){return(e,i,s)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const gt=1,mt=t=>(...e)=>({_$litDirective$:t,values:e});let _t=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ft=mt(class extends _t{constructor(t){if(super(t),t.type!==gt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return W}}),vt="important",bt=" !"+vt,$t=mt(class extends _t{constructor(t){if(super(t),t.type!==gt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(bt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?vt:""):i[t]=s}}return W}}),yt="deck-card",wt="deck-card-editor";var xt="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",kt="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",At="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";const Ct={title:"Title",nav:"Navigation",breakpoint:"Mobile breakpoint",remember:"Remember last segment",swipe:"Swipe gestures",animation:"Animations",default_segment:"Default segment",name:"Name",icon:"Icon",badge:"Badge",columns:"Width (units)",rows:"Height (rows)",full:"Full width"},Et={breakpoint:'Viewport width (px) below which "Auto" switches to dots + swipe',badge:"Short static text or counter shown in the pill",remember:"Reopen the segment that was active last time on this device",columns:"12 units = one dashboard column (48 across a wide desktop)",rows:"One row ≈ 56px, like HA sections. Empty = natural height"},St={nav:"auto",breakpoint:640,remember:!1,swipe:!0,animation:!0},Pt=[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"badge",selector:{text:{}}}]}],Mt=[{type:"grid",name:"",schema:[{name:"columns",selector:{number:{min:1,max:48,mode:"box"}}},{name:"rows",selector:{number:{min:1,max:30,mode:"box"}}},{name:"full",selector:{boolean:{}}}]}];class Lt extends at{constructor(){super(...arguments),this._tab=0,this._adding=!1,this._haEditors=!1,this._haPicker=!1,this._onAddCard=()=>{this._haPicker?this._adding=!0:this._appendCard({type:"markdown",content:"New card"})},this._cardPicked=t=>{t.stopPropagation();const e=t.detail.config;e&&(this._adding=!1,this._appendCard(e))}}setConfig(t){this._config=t;const e=t.segments?.length??0;this._tab>=e&&(this._tab=Math.max(0,e-1))}firstUpdated(){this._loadHaEditorDeps()}async _loadHaEditorDeps(){if(this._detectHaEditors(),!this._haEditors||!this._haPicker){try{const t=await(window.loadCardHelpers?.());t?.createCardElement({type:"vertical-stack",cards:[]}),await customElements.whenDefined("hui-vertical-stack-card");const e=customElements.get("hui-vertical-stack-card");await(e?.getConfigElement?.())}catch{}this._detectHaEditors()}}_detectHaEditors(){this._haEditors=!!customElements.get("hui-card-element-editor"),this._haPicker=!!customElements.get("hui-card-picker")}render(){if(!this._config||!this.hass)return B;const t=this._config.segments??[],e=t[this._tab];return q`
      <ha-form
        .hass=${this.hass}
        .data=${this._options}
        .schema=${this._optionsSchema(t)}
        .computeLabel=${Ht}
        .computeHelper=${Rt}
        @value-changed=${this._optionsChanged}
      ></ha-form>

      <div class="tabs" role="tablist" aria-label="Segments">
        ${t.map((t,e)=>q`
            <button
              class=${ft({tab:!0,on:e===this._tab})}
              role="tab"
              aria-selected=${e===this._tab?"true":"false"}
              @click=${()=>this._openTab(e)}
            >
              ${t.icon?q`<ha-icon .icon=${t.icon}></ha-icon>`:B}
              <span>${t.name||`Segment ${e+1}`}</span>
            </button>
          `)}
        <button class="tab add" aria-label="Add segment" @click=${this._addSegment}>
          <ha-svg-icon .path=${At}></ha-svg-icon>
        </button>
      </div>

      ${e?this._renderSegment(e,this._tab,t.length):B}
    `}_renderSegment(t,e,i){const s=t.cards??[];return q`
      <div class="segment">
        <div class="segment-toolbar">
          <span class="segment-title">Segment ${e+1} of ${i}</span>
          <ha-icon-button
            .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
            label="Move segment left"
            .disabled=${0===e}
            @click=${()=>this._moveSegment(e,-1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"}
            label="Move segment right"
            .disabled=${e===i-1}
            @click=${()=>this._moveSegment(e,1)}
          ></ha-icon-button>
          <ha-icon-button
            class="danger"
            .path=${kt}
            label="Delete segment"
            .disabled=${i<=1}
            @click=${()=>this._removeSegment(e)}
          ></ha-icon-button>
        </div>

        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${Pt}
          .computeLabel=${Ht}
          .computeHelper=${Rt}
          @value-changed=${t=>this._segmentChanged(t,e)}
        ></ha-form>

        <div class="cards-header">
          <h4>Cards (${s.length})</h4>
        </div>

        ${s.map((t,e)=>this._renderCardRow(t,e,s.length))}

        ${this._renderAddCard()}
      </div>
    `}_renderCardRow(t,e,i){const s=this._editing===e;return q`
      <div class="card-row">
        <div class="card-head">
          <span class="card-title" title=${t.type}>${e+1}. ${function(t){const e=String(t.type??"?").replace(/^custom:/,""),i=t.name||t.title||t.entity||t.view||"";return i?`${e} · ${i}`:e}(t)}</span>
          <ha-icon-button
            .path=${"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"}
            label="Move up"
            .disabled=${0===e}
            @click=${()=>this._moveCard(e,-1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"}
            label="Move down"
            .disabled=${e===i-1}
            @click=${()=>this._moveCard(e,1)}
          ></ha-icon-button>
          <ha-icon-button
            class=${s?"accent":""}
            .path=${s?xt:"M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"}
            label=${s?"Close editor":"Edit card"}
            @click=${()=>{this._editing=s?void 0:e}}
          ></ha-icon-button>
          <ha-icon-button
            class="danger"
            .path=${kt}
            label="Delete card"
            @click=${()=>this._removeCard(e)}
          ></ha-icon-button>
        </div>
        <ha-form
          class="layout"
          .hass=${this.hass}
          .data=${function(t){const e=t.grid_options??{};return{columns:"number"==typeof e.columns?e.columns:void 0,rows:"number"==typeof e.rows?e.rows:void 0,full:"full"===e.columns}}(t)}
          .schema=${Mt}
          .computeLabel=${Ht}
          .computeHelper=${Rt}
          @value-changed=${t=>this._cardLayoutChanged(t,e)}
        ></ha-form>
        ${s?this._renderCardEditor(t,e):B}
      </div>
    `}_renderCardEditor(t,e){return this._haEditors?q`
      <div class="card-editor">
        <hui-card-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .value=${t}
          @config-changed=${t=>this._cardConfigChanged(t,e)}
          @GUI-mode-changed=${t=>t.stopPropagation()}
        ></hui-card-element-editor>
      </div>
    `:q`
        <ha-alert alert-type="info">
          The built-in card editor could not be loaded — edit this card in the YAML editor of
          the deck card.
        </ha-alert>
      `}_renderAddCard(){return this._adding&&this._haPicker?q`
        <div class="picker">
          <div class="picker-head">
            <span>Pick a card</span>
            <ha-icon-button
              .path=${xt}
              label="Cancel"
              @click=${()=>{this._adding=!1}}
            ></ha-icon-button>
          </div>
          <hui-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this._cardPicked}
          ></hui-card-picker>
        </div>
      `:q`
      <ha-button class="add-card" @click=${this._onAddCard}>
        <ha-svg-icon slot="start" .path=${At}></ha-svg-icon>
        Add card
      </ha-button>
    `}get _options(){const t=this._config;return{title:t.title??"",nav:t.nav??St.nav,breakpoint:t.breakpoint??St.breakpoint,remember:t.remember??St.remember,swipe:t.swipe??St.swipe,animation:t.animation??St.animation,default_segment:t.default_segment??""}}_optionsSchema(t){const e=t.filter(t=>t.name);return[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"nav",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto (pills → dots)"},{value:"pills",label:"Pills"},{value:"dots",label:"Dots"},{value:"hidden",label:"Hidden (swipe only)"}]}}},{name:"breakpoint",selector:{number:{min:200,max:1600,step:10,mode:"box",unit_of_measurement:"px"}}},...e.length?[{name:"default_segment",selector:{select:{mode:"dropdown",options:e.map(t=>({value:t.name,label:t.name}))}}}]:[]]},{type:"grid",name:"",schema:[{name:"remember",selector:{boolean:{}}},{name:"swipe",selector:{boolean:{}}},{name:"animation",selector:{boolean:{}}}]}]}_optionsChanged(t){if(t.stopPropagation(),!this._config)return;const e=t.detail.value,i={...this._config,...e};i.title||delete i.title,""!==i.default_segment&&null!=i.default_segment||delete i.default_segment;for(const[t,e]of Object.entries(St))i[t]===e&&delete i[t];this._emit(i)}_openTab(t){this._tab=t,this._editing=void 0,this._adding=!1}_segmentChanged(t,e){if(t.stopPropagation(),!this._config)return;const i=t.detail.value,s=[...this._config.segments],r={...s[e],...i,cards:s[e].cards??[]};r.name||delete r.name,r.icon||delete r.icon,""!==r.badge&&null!=r.badge||delete r.badge,s[e]=r,this._emit({...this._config,segments:s})}_addSegment(){if(!this._config)return;const t=[...this._config.segments,{name:`Page ${this._config.segments.length+1}`,cards:[]}];this._emit({...this._config,segments:t}),this._openTab(t.length-1)}_removeSegment(t){if(!this._config||this._config.segments.length<=1)return;const e=this._config.segments.filter((e,i)=>i!==t);this._emit({...this._config,segments:e}),this._openTab(Math.min(t,e.length-1))}_moveSegment(t,e){if(!this._config)return;const i=t+e;if(i<0||i>=this._config.segments.length)return;const s=[...this._config.segments];[s[t],s[i]]=[s[i],s[t]],this._emit({...this._config,segments:s}),this._openTab(i)}_updateCards(t){if(!this._config)return;const e=[...this._config.segments];e[this._tab]={...e[this._tab],cards:t},this._emit({...this._config,segments:e})}_cardLayoutChanged(t,e){t.stopPropagation();const i=this._config?.segments[this._tab];if(!i)return;const s=t.detail.value,r={};s.full?r.columns="full":"number"==typeof s.columns&&(r.columns=s.columns),"number"==typeof s.rows&&(r.rows=s.rows);const n=[...i.cards??[]],o={...n[e]};Object.keys(r).length?o.grid_options=r:delete o.grid_options,n[e]=o,this._updateCards(n)}_cardConfigChanged(t,e){t.stopPropagation();const i=this._config?.segments[this._tab];if(!i)return;const s=[...i.cards??[]],r=s[e],n={...t.detail.config};r.grid_options&&void 0===n.grid_options&&(n.grid_options=r.grid_options),s[e]=n,this._updateCards(s)}_appendCard(t){const e=this._config?.segments[this._tab];if(!e)return;const i=[...e.cards??[],t];this._updateCards(i),this._editing=i.length-1}_removeCard(t){const e=this._config?.segments[this._tab];e&&(this._editing=void 0,this._updateCards((e.cards??[]).filter((e,i)=>i!==t)))}_moveCard(t,e){const i=this._config?.segments[this._tab];if(!i)return;const s=[...i.cards??[]],r=t+e;r<0||r>=s.length||([s[t],s[r]]=[s[r],s[t]],this._editing===t?this._editing=r:this._editing===r&&(this._editing=t),this._updateCards(s))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}}function Ht(t){return Ct[t.name??""]??t.name??""}function Rt(t){return Et[t.name??""]}Lt.styles=o`
    :host {
      display: block;
    }

    ha-form {
      display: block;
    }

    /* ---------------------------------------------------------- tabs */

    .tabs {
      display: flex;
      gap: 4px;
      margin-top: 16px;
      padding: 4px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
      border-radius: 12px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      border-radius: 8px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
    }

    .tab:hover {
      color: var(--primary-text-color);
    }

    .tab.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .tab ha-icon {
      --mdc-icon-size: 16px;
      display: flex;
    }

    .tab.add {
      margin-left: auto;
      padding: 8px 10px;
    }

    .tab.add ha-svg-icon {
      width: 18px;
      height: 18px;
    }

    /* ------------------------------------------------------- segment */

    .segment {
      margin-top: 8px;
      padding: 8px 12px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .segment-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }

    .segment-title {
      flex: 1;
      font-size: 13px;
    }

    .cards-header h4 {
      margin: 16px 0 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    /* --------------------------------------------------------- cards */

    .card-row {
      margin-top: 8px;
      padding: 4px 10px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--card-background-color, transparent);
    }

    .card-head {
      display: flex;
      align-items: center;
      --mdc-icon-button-size: 34px;
      --mdc-icon-size: 17px;
      color: var(--secondary-text-color);
    }

    .card-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-weight: 500;
      font-size: 14px;
    }

    .layout {
      margin-top: 2px;
    }

    .card-editor {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--divider-color);
    }

    .add-card {
      margin-top: 12px;
    }

    .picker {
      margin-top: 12px;
      padding: 8px 12px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
    }

    .picker-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .danger {
      color: var(--error-color);
    }

    .accent {
      color: var(--primary-color);
    }

    ha-alert {
      display: block;
      margin-top: 8px;
    }
  `,t([ht({attribute:!1})],Lt.prototype,"hass",void 0),t([ht({attribute:!1})],Lt.prototype,"lovelace",void 0),t([pt()],Lt.prototype,"_config",void 0),t([pt()],Lt.prototype,"_tab",void 0),t([pt()],Lt.prototype,"_editing",void 0),t([pt()],Lt.prototype,"_adding",void 0),t([pt()],Lt.prototype,"_haEditors",void 0),t([pt()],Lt.prototype,"_haPicker",void 0),customElements.get(wt)||customElements.define(wt,Lt);const Ot=/slider|range|input|textarea|select|knob|dial|map|scrubber|swipe|carousel|gallery/,Tt="undefined"!=typeof window&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,Ut=t=>new Promise(e=>setTimeout(e,t));class zt extends at{constructor(){super(...arguments),this._active=0,this._narrow=!1,this._cards=[],this._dragging=!1,this._gridUnits=12,this._suppressClick=!1,this._indicatorInit=!1,this._buildId=0,this._animToken=0,this._hostRO=new ResizeObserver(()=>this._onHostResize()),this._cardRO=new ResizeObserver(t=>{for(const e of t)this._autoSizeRows(e.target)}),this._mqlListener=t=>{this._narrow=t.matches}}static getConfigElement(){return document.createElement(wt)}static getStubConfig(){return{segments:[{name:"Page 1",icon:"mdi:view-dashboard",cards:[]},{name:"Page 2",icon:"mdi:tune",cards:[]}]}}set hass(t){this._hass=t;for(const e of this._cards)for(const i of e)i.hass=t}get hass(){return this._hass}setConfig(t){if(!t||!Array.isArray(t.segments)||0===t.segments.length)throw new Error('deck-card: "segments" must be a non-empty list');t.segments.forEach((t,e)=>{if(!t||"object"!=typeof t)throw new Error(`deck-card: segment ${e+1} is invalid`);if(void 0!==t.cards&&!Array.isArray(t.cards))throw new Error(`deck-card: segment ${e+1}: "cards" must be a list`)});const e=!this._config;this._config=t,this._active=e?this._initialIndex(t):Math.min(this._active,t.segments.length-1),this._indicatorInit=!1,this.style.setProperty("--deck-card-duration",!1===t.animation?"0ms":""),this._setupMedia(),this._buildCards(t)}getGridOptions(){return{columns:"full",rows:"auto"}}async getCardSize(){const t=this._cards[this._active]??[];if(!t.length)return 3;return(await Promise.all(t.map(async t=>{try{return await(t.getCardSize?.())??4}catch{return 4}}))).reduce((t,e)=>t+e,0)}connectedCallback(){super.connectedCallback(),this._hostRO.observe(this),this._setupMedia()}disconnectedCallback(){super.disconnectedCallback(),this._hostRO.disconnect(),this._cardRO.disconnect(),this._mql?.removeEventListener("change",this._mqlListener)}get _animMode(){return!!this._transition||this._dragging}render(){if(!this._config)return B;const t=this._config,e=t.segments,i=t.nav??"auto",s=e.length>1,r=s&&("pills"===i||"auto"===i&&!this._narrow),n=s&&("dots"===i||"auto"===i&&this._narrow),o=this._animMode;return q`
      ${t.title?q`<h1 class="title">${t.title}</h1>`:B}
      ${r?this._renderPills(e):B}
      <div
        class=${ft({viewport:!0,anim:o,"no-swipe":!this._swipeEnabled})}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div class=${ft({track:!0,anim:o})}>
          ${e.map((e,i)=>{const s=function(t){if("number"==typeof t&&t>0)return`${t}px`;if("string"==typeof t&&t.trim())return t.trim();return}(e.min_card_width??t.min_card_width),r=!s&&this._sectionsMode(e);return q`
              <section
                class=${ft({panel:!0,active:i===this._active,columns:!!s||r,sections:r})}
                style=${$t(s?{"grid-template-columns":`repeat(auto-fill, minmax(min(${s}, 100%), 1fr))`}:r?{"grid-template-columns":`repeat(${this._gridUnits}, minmax(0, 1fr))`}:{})}
                role="tabpanel"
                aria-label=${e.name??`Segment ${i+1}`}
                ?inert=${i!==this._active}
              >
                ${this._cards[i]?.length?this._cards[i]:this._renderEmpty()}
              </section>
            `})}
        </div>
      </div>
      ${n?this._renderDots(e):B}
    `}_renderPills(t){return q`
      <nav
        class="pills"
        role="tablist"
        aria-label=${this._config?.title??"Deck"}
        @keydown=${this._onNavKeydown}
      >
        <div class="pill-indicator" aria-hidden="true"></div>
        ${t.map((t,e)=>q`
            <button
              class=${ft({pill:!0,active:e===this._active})}
              role="tab"
              aria-selected=${e===this._active?"true":"false"}
              tabindex=${e===this._active?0:-1}
              @click=${()=>this._select(e)}
            >
              ${t.icon?q`<ha-icon .icon=${t.icon}></ha-icon>`:B}
              ${t.name?q`<span class="label">${t.name}</span>`:B}
              ${void 0!==t.badge&&""!==t.badge?q`<span class="pill-badge">${t.badge}</span>`:B}
            </button>
          `)}
      </nav>
    `}_renderDots(t){return q`
      <nav class="dots" role="tablist" aria-label=${this._config?.title??"Deck"} @keydown=${this._onNavKeydown}>
        ${t.map((t,e)=>q`
            <button
              class=${ft({dot:!0,active:e===this._active})}
              role="tab"
              aria-selected=${e===this._active?"true":"false"}
              tabindex=${e===this._active?0:-1}
              aria-label=${t.name??`Segment ${e+1}`}
              title=${t.name??`Segment ${e+1}`}
              @click=${()=>this._select(e)}
            >
              <span></span>
            </button>
          `)}
      </nav>
    `}_renderEmpty(){return q`<div class="empty">Empty segment — add cards to it in the editor</div>`}firstUpdated(){this._viewport?.addEventListener("click",t=>{this._suppressClick&&(t.preventDefault(),t.stopPropagation(),this._suppressClick=!1)},{capture:!0})}updated(t){super.updated(t),this._animMode||(this._track&&(this._track.style.transform="",this._track.style.transition=""),this._viewport&&(this._viewport.style.height="",this._viewport.style.transition="")),this._syncIndicator(),this._applyGridSpans(),t.has("_active")&&this._scrollActivePillIntoView()}async _buildCards(t){const e=++this._buildId;this._cardRO.disconnect();const i=await(window.loadCardHelpers?.());e===this._buildId&&(i?this._cards=t.segments.map((t,e)=>(t.cards??[]).map((t,s)=>this._createCard(i,t,e,s))):console.error("deck-card: window.loadCardHelpers is unavailable"))}_createCard(t,e,i,s){const{deck_span:r,...n}=e,o=t.createCardElement(n);return"full"===r?o.style.gridColumn="1 / -1":"number"==typeof r&&Number.isInteger(r)&&r>1&&(o.style.gridColumn=`span ${r}`),this._hass&&(o.hass=this._hass),o.addEventListener("ll-rebuild",r=>{r.stopPropagation();const n=this._createCard(t,e,i,s),o=[...this._cards[i]??[]];o[s]=n;const a=[...this._cards];a[i]=o,this._cards=a}),o}_select(t){const e=this._config?.segments.length??0,i=Math.max(0,Math.min(e-1,t));if(i===this._active)return;const s=this._active;this._commitSelect(i),this._dragging||this._duration()<=0||this._animateTo(s,i)}_commitSelect(t){if(this._active=t,this._config?.remember)try{localStorage.setItem(this._storageKey,String(t))}catch{}window.dispatchEvent(new CustomEvent("haptic",{detail:"light"}))}async _animateTo(t,e){const i=++this._animToken,s=this._viewport?.offsetHeight??0;this._transition={from:t},await this.updateComplete;const r=this._track,n=this._viewport;if(!r||!n)return void(i===this._animToken&&(this._transition=void 0));const o=this._rtl?1:-1;r.style.transition="none",n.style.transition="none",r.style.transform=`translateX(${o*t*100}%)`,n.style.height=`${s}px`,r.offsetWidth,r.style.transition="",n.style.transition="",r.style.transform=`translateX(${o*e*100}%)`;const a=this.renderRoot.querySelectorAll(".panel")[e];a&&(n.style.height=`${a.offsetHeight}px`),await Ut(this._duration()+60),i===this._animToken&&(this._transition=void 0)}_duration(){if(Tt)return 0;const t=getComputedStyle(this).getPropertyValue("--deck-duration").trim(),e=parseFloat(t);return Number.isFinite(e)?t.endsWith("ms")||!t.endsWith("s")?e:1e3*e:250}_initialIndex(t){const e=t.segments.length;if(t.remember)try{const i=localStorage.getItem(this._storageKeyFor(t));if(null!==i){const t=Number.parseInt(i,10);if(Number.isInteger(t)&&t>=0&&t<e)return t}}catch{}const i=t.default_segment;if("number"==typeof i&&Number.isInteger(i))return Math.max(0,Math.min(e-1,i));if("string"==typeof i){const e=t.segments.findIndex(t=>t.name===i);if(e>=0)return e}return 0}get _storageKey(){return this._storageKeyFor(this._config)}_storageKeyFor(t){const e=t.key??String(function(t){let e=5381;for(let i=0;i<t.length;i++)e=(e<<5)+e+t.charCodeAt(i)>>>0;return e}(t.segments.map(t=>`${t.name??""}|${t.icon??""}`).join(",")));return`deck-card:${e}`}get _swipeEnabled(){return!1!==this._config?.swipe&&(this._config?.segments.length??0)>1}get _rtl(){return"rtl"===getComputedStyle(this).direction}_onPointerDown(t){if("mouse"!==t.pointerType&&this._swipeEnabled&&!(this._drag||this._dragging||this._transition)){for(const e of t.composedPath()){if(e===t.currentTarget)break;if(e instanceof Element&&Ot.test(e.localName))return}this._drag={id:t.pointerId,startX:t.clientX,startY:t.clientY,dx:0,t0:performance.now(),width:t.currentTarget.offsetWidth||1,height:0,active:!1,ready:!1}}}_onPointerMove(t){const e=this._drag;if(!e||t.pointerId!==e.id)return;const i=t.clientX-e.startX,s=t.clientY-e.startY;if(!e.active){if(Math.abs(i)<8)return;if(Math.abs(i)<=Math.abs(s))return void(this._drag=void 0);e.active=!0,t.currentTarget.setPointerCapture(e.id),e.height=this._viewport?.offsetHeight??0,this._dragging=!0,this.updateComplete.then(()=>{const t=this._drag,e=this._track,i=this._viewport;t?.active&&e&&i&&(e.style.transition="none",i.style.transition="none",i.style.height=`${t.height}px`,t.ready=!0,this._applyDragTransform(t.dx))})}const r=this._config?.segments.length??1,n=(i<0?1:-1)*(this._rtl?-1:1),o=this._active+n;e.dx=o<0||o>r-1?.25*i:i,e.ready&&this._applyDragTransform(e.dx)}_onPointerUp(t){const e=this._drag;if(!e||t.pointerId!==e.id)return;if(this._drag=void 0,!e.active)return;this._suppressClick=!0,window.setTimeout(()=>{this._suppressClick=!1},150);const i=this._config?.segments.length??1,s=Math.max(1,performance.now()-e.t0),r=e.dx/s,n=(e.dx<0?1:-1)*(this._rtl?-1:1),o=Math.abs(e.dx)>.2*e.width||Math.abs(r)>.35&&Math.abs(e.dx)>24,a=this._active+(o?n:0);this._settleDrag(o&&a>=0&&a<i?a:null)}_onPointerCancel(t){const e=this._drag;e&&t.pointerId===e.id&&(this._drag=void 0,e.active&&this._settleDrag(null))}async _settleDrag(t){null!==t&&t!==this._active&&this._commitSelect(t),await this.updateComplete;const e=this._track,i=this._viewport,s=this._duration();if(e&&i&&s>0){e.style.transition="",i.style.transition="";const t=this._rtl?1:-1;e.style.transform=`translateX(${t*this._active*100}%)`;const r=this.renderRoot.querySelectorAll(".panel")[this._active];r&&(i.style.height=`${r.offsetHeight}px`),await Ut(s+60)}this._dragging=!1}_applyDragTransform(t){if(!this._track)return;const e=this._rtl?1:-1;this._track.style.transform=`translateX(calc(${e*this._active*100}% + ${t}px))`}_onNavKeydown(t){const e=this._config?.segments.length??0;if(e<2)return;const i=this._rtl?-1:1;let s;switch(t.key){case"ArrowRight":s=this._active+i;break;case"ArrowLeft":s=this._active-i;break;case"Home":s=0;break;case"End":s=e-1;break;default:return}t.preventDefault(),this._select((s+e)%e),this.updateComplete.then(()=>{const t=this.renderRoot.querySelectorAll('[role="tab"]');t[this._active]?.focus()})}_onHostResize(){const t=12*Math.max(1,Math.floor(this.clientWidth/350));t!==this._gridUnits&&(this._gridUnits=t),this._syncIndicator()}_sectionsMode(t){return!(t.min_card_width??this._config?.min_card_width)&&(t.cards??[]).some(t=>!!t.grid_options)}_applyGridSpans(){const t=this._config;if(!t)return;const e=this._gridUnits;t.segments.forEach((t,i)=>{this._sectionsMode(t)&&(this._cards[i]??[]).forEach((i,s)=>{const r=t.cards?.[s],n=function(t){const e=t.getGridOptions;if("function"!=typeof e)return;try{const i=e.call(t);return i&&"object"==typeof i?i:void 0}catch{return}}(i);if(!r?.deck_span){const t=r?.grid_options?.columns??n?.columns;i.style.gridColumn="full"===t?"1 / -1":"number"==typeof t&&t>0?`span ${Math.min(Math.round(t),e)}`:`span ${Math.min(12,e)}`}const o=r?.grid_options?.rows??n?.rows;"number"==typeof o&&o>0?(this._cardRO.unobserve(i),i.style.gridRow=`span ${Math.min(Math.round(o),50)}`,i.style.alignSelf=""):(i.style.alignSelf="start",this._cardRO.observe(i),this._autoSizeRows(i))})})}_autoSizeRows(t){const e=t.parentElement;if(!e||!e.classList.contains("sections"))return;const i=getComputedStyle(e),s=parseFloat(i.getPropertyValue("--deck-card-row-height"))||56,r=parseFloat(i.rowGap)||8,n=t.getBoundingClientRect().height;if(!n)return;const o=`span ${Math.max(1,Math.round((n+r)/(s+r)))}`;t.style.gridRow!==o&&(t.style.gridRow=o)}_syncIndicator(){const t=this.renderRoot.querySelector(".pills"),e=t?.querySelector(".pill-indicator");if(!t||!e)return void(this._indicatorInit=!1);const i=t.querySelectorAll(".pill")[this._active];i&&(this._indicatorInit||(e.style.transition="none"),e.style.transform=`translate(${i.offsetLeft}px, ${i.offsetTop}px)`,e.style.width=`${i.offsetWidth}px`,e.style.height=`${i.offsetHeight}px`,this._indicatorInit||(e.offsetWidth,e.style.transition="",this._indicatorInit=!0))}_scrollActivePillIntoView(){const t=this.renderRoot.querySelector(".pills");if(!t||t.scrollWidth<=t.clientWidth+1)return;const e=t.querySelectorAll(".pill")[this._active];e?.scrollIntoView({block:"nearest",inline:"center",behavior:Tt?"auto":"smooth"})}_setupMedia(){this._mql?.removeEventListener("change",this._mqlListener);const t=this._config?.breakpoint??640;this._mql=window.matchMedia(`(max-width: ${t}px)`),this._narrow=this._mql.matches,this.isConnected&&this._mql.addEventListener("change",this._mqlListener)}}zt.styles=o`
    :host {
      display: block;
      --deck-ease: var(--deck-card-easing, cubic-bezier(0.19, 1, 0.22, 1));
      --deck-duration: var(--deck-card-duration, 250ms);
    }

    .title {
      margin: 0 4px 12px;
      color: var(--primary-text-color);
      font-size: var(--ha-card-header-font-size, 24px);
      font-weight: 400;
      line-height: 1.2;
    }

    /* ------------------------------------------------------------- pills */

    .pills {
      position: relative;
      display: flex;
      gap: 4px;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      margin: 0 auto 12px;
      padding: 4px;
      background: var(--deck-card-nav-background, var(--secondary-background-color, rgba(127, 127, 127, 0.14)));
      border-radius: var(--deck-card-nav-border-radius, 999px);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .pills::-webkit-scrollbar {
      display: none;
    }

    .pill-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-radius: 999px;
      background: var(--deck-card-pill-active-background, var(--primary-color));
      transition:
        transform var(--deck-duration) var(--deck-ease),
        width var(--deck-duration) var(--deck-ease),
        height var(--deck-duration) var(--deck-ease);
      will-change: transform;
    }

    .pill {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 999px;
      background: none;
      color: var(--deck-card-pill-color, var(--secondary-text-color));
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      transition: color var(--deck-duration) var(--deck-ease);
      -webkit-tap-highlight-color: transparent;
    }

    .pill:hover {
      color: var(--primary-text-color);
    }

    .pill:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .pill.active {
      color: var(--deck-card-pill-active-color, var(--text-primary-color, #fff));
    }

    .pill ha-icon {
      --mdc-icon-size: 18px;
      display: flex;
    }

    .pill-badge {
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--deck-card-badge-background, rgba(127, 127, 127, 0.22));
      font-size: 11px;
      font-weight: 600;
    }

    .pill.active .pill-badge {
      background: rgba(0, 0, 0, 0.18);
    }

    /* ---------------------------------------------------------- viewport */

    .viewport {
      touch-action: pan-y;
    }

    .viewport.anim {
      overflow: hidden;
      transition: height var(--deck-duration) var(--deck-ease);
    }

    .viewport.no-swipe {
      touch-action: auto;
    }

    /* Idle: only the active panel exists in flow — no transforms anywhere,
       so position:fixed dialogs from child cards are not affected. */
    .track:not(.anim) > .panel:not(.active) {
      display: none;
    }

    .track.anim {
      display: flex;
      align-items: flex-start;
      will-change: transform;
      transition: transform var(--deck-duration) var(--deck-ease);
    }

    .track.anim > .panel {
      flex: 0 0 100%;
      width: 100%;
      min-width: 100%;
    }

    .panel {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--deck-card-gap, 8px);
    }

    .panel.columns {
      display: grid;
      grid-auto-flow: dense;
      grid-auto-rows: min-content;
    }

    /* Sections-style grids use fixed row tracks (like HA sections), so a
       card's height is its row span — thin cards stay thin. */
    .panel.sections {
      grid-auto-rows: minmax(var(--deck-card-row-height, 56px), auto);
      align-items: stretch;
    }

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      border: 2px dashed var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: var(--ha-card-border-radius, 12px);
      color: var(--secondary-text-color);
      font-size: 14px;
      text-align: center;
      padding: 0 16px;
    }

    /* -------------------------------------------------------------- dots */

    .dots {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 10px 0 2px;
    }

    .dot {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .dot span {
      width: 7px;
      height: 7px;
      border-radius: 4px;
      background: var(--deck-card-dot-color, var(--secondary-text-color));
      opacity: 0.35;
      transition:
        width var(--deck-duration) var(--deck-ease),
        opacity var(--deck-duration) var(--deck-ease),
        background var(--deck-duration) var(--deck-ease);
    }

    .dot.active span {
      width: 20px;
      opacity: 1;
      background: var(--deck-card-dot-active-color, var(--primary-color));
    }

    .dot:focus-visible span {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        --deck-duration: 0ms;
      }
    }
  `,t([pt()],zt.prototype,"_config",void 0),t([pt()],zt.prototype,"_active",void 0),t([pt()],zt.prototype,"_narrow",void 0),t([pt()],zt.prototype,"_cards",void 0),t([pt()],zt.prototype,"_transition",void 0),t([pt()],zt.prototype,"_dragging",void 0),t([pt()],zt.prototype,"_gridUnits",void 0),t([ut(".viewport")],zt.prototype,"_viewport",void 0),t([ut(".track")],zt.prototype,"_track",void 0),t([ht({attribute:!1})],zt.prototype,"hass",null),customElements.get(yt)||customElements.define(yt,zt),window.customCards=window.customCards??[],window.customCards.push({type:yt,name:"Deck Card",description:"Adaptive segmented container: pill tabs on desktop, swipe + dots on mobile.",preview:!1,documentationURL:"https://github.com/RobinCK/lovelace-deck-card"}),console.info("%c DECK-CARD %c v1.4.1 ","background:#4f6cff;color:#fff;padding:2px 8px;border-radius:4px 0 0 4px;font-weight:700","background:#37474f;color:#fff;padding:2px 8px;border-radius:0 4px 4px 0");export{zt as DeckCard};
