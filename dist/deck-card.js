function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",f=m.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),y={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,f?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,k=x.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,M=`<${P}>`,H=document,O=()=>H.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,T="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,N=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,D=/"/g,q=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),K=new WeakMap,Z=H.createTreeWalker(H,129);function X(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=L;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,c=o.exec(i),null!==c);)h=o.lastIndex,o===L?"!--"===c[1]?o=I:void 0!==c[1]?o=N:void 0!==c[2]?(q.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=j):void 0!==c[3]&&(o=j):o===j?">"===c[0]?(o=n??L,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?j:'"'===c[3]?D:z):o===D||o===z?o=j:o===I||o===N?o=L:(o=j,n=void 0);const d=o===j&&t[e+1].startsWith("/>")?" ":"";r+=o===L?i+M:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[X(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=F.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[r++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),Z.nextNode(),a.push({type:2,index:++n});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=H.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=R(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??H).importNode(e,!0);Z.currentNode=s;let n=Z.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=Z.nextNode(),r++)}return Z.currentNode=H,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),R(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=F.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new F(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Q(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=J(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=J(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),r||=!R(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??B)===W)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(F,Q),(x.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Q(e.insertBefore(O(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const ct=ot.litElementPolyfillSupport;ct?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const lt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:b},ht=(t=lt,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function dt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return dt({...t,state:!0,attribute:!1})}function ut(t,e){return(e,i,s)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const mt=1,_t=t=>(...e)=>({_$litDirective$:t,values:e});let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ft=_t(class extends gt{constructor(t){if(super(t),t.type!==mt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return W}}),vt="important",$t=" !"+vt,bt=_t(class extends gt{constructor(t){if(super(t),t.type!==mt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith($t);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?vt:""):i[t]=s}}return W}}),yt="deck-card",wt="deck-card-editor";const xt={title:"Title",nav:"Navigation",breakpoint:"Mobile breakpoint",remember:"Remember last segment",swipe:"Swipe gestures",animation:"Animations",default_segment:"Default segment",min_card_width:"Min card width",name:"Name",icon:"Icon",badge:"Badge"},At={breakpoint:'Viewport width (px) below which "Auto" switches to dots + swipe',badge:"Short static text or counter shown in the pill",remember:"Reopen the segment that was active last time on this device",min_card_width:"Lay cards out in responsive columns at least this wide (px). Empty = single column"},kt={nav:"auto",breakpoint:640,remember:!1,swipe:!0,animation:!0},Et=[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"badge",selector:{text:{}}},{name:"min_card_width",selector:{number:{min:0,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}}]}];class St extends at{setConfig(t){this._config=t}render(){if(!this._config||!this.hass)return B;const t=this._config.segments??[];return V`
      <ha-form
        .hass=${this.hass}
        .data=${this._options}
        .schema=${this._optionsSchema(t)}
        .computeLabel=${Ct}
        .computeHelper=${Pt}
        @value-changed=${this._optionsChanged}
      ></ha-form>

      <div class="segments-header">
        <h3>Segments</h3>
        <ha-icon-button .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"} label="Add segment" @click=${this._addSegment}></ha-icon-button>
      </div>

      ${t.map((e,i)=>this._renderSegment(e,i,t.length))}

      <ha-alert alert-type="info">
        Cards inside each segment are edited in YAML for now — open the code editor and fill
        <code>segments → cards</code>.
      </ha-alert>
    `}_renderSegment(t,e,i){return V`
      <div class="segment">
        <div class="segment-toolbar">
          <span class="segment-title">
            ${t.name||`Segment ${e+1}`}
            <span class="segment-meta">· ${(t.cards??[]).length} card(s)</span>
          </span>
          <ha-icon-button
            .path=${"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"}
            label="Move up"
            .disabled=${0===e}
            @click=${()=>this._moveSegment(e,-1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"}
            label="Move down"
            .disabled=${e===i-1}
            @click=${()=>this._moveSegment(e,1)}
          ></ha-icon-button>
          <ha-icon-button
            class="danger"
            .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
            label="Delete segment"
            .disabled=${i<=1}
            @click=${()=>this._removeSegment(e)}
          ></ha-icon-button>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${Et}
          .computeLabel=${Ct}
          .computeHelper=${Pt}
          @value-changed=${t=>this._segmentChanged(t,e)}
        ></ha-form>
      </div>
    `}get _options(){const t=this._config;return{title:t.title??"",nav:t.nav??kt.nav,breakpoint:t.breakpoint??kt.breakpoint,remember:t.remember??kt.remember,swipe:t.swipe??kt.swipe,animation:t.animation??kt.animation,default_segment:t.default_segment??"",min_card_width:t.min_card_width??""}}_optionsSchema(t){const e=t.filter(t=>t.name);return[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"nav",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto (pills → dots)"},{value:"pills",label:"Pills"},{value:"dots",label:"Dots"},{value:"hidden",label:"Hidden (swipe only)"}]}}},{name:"breakpoint",selector:{number:{min:200,max:1600,step:10,mode:"box",unit_of_measurement:"px"}}},{name:"min_card_width",selector:{number:{min:0,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}},...e.length?[{name:"default_segment",selector:{select:{mode:"dropdown",options:e.map(t=>({value:t.name,label:t.name}))}}}]:[]]},{type:"grid",name:"",schema:[{name:"remember",selector:{boolean:{}}},{name:"swipe",selector:{boolean:{}}},{name:"animation",selector:{boolean:{}}}]}]}_optionsChanged(t){if(t.stopPropagation(),!this._config)return;const e=t.detail.value,i={...this._config,...e};i.title||delete i.title,""!==i.default_segment&&null!=i.default_segment||delete i.default_segment,i.min_card_width||delete i.min_card_width;for(const[t,e]of Object.entries(kt))i[t]===e&&delete i[t];this._emit(i)}_segmentChanged(t,e){if(t.stopPropagation(),!this._config)return;const i=t.detail.value,s=[...this._config.segments],n={...s[e],...i,cards:s[e].cards??[]};n.name||delete n.name,n.icon||delete n.icon,""!==n.badge&&null!=n.badge||delete n.badge,n.min_card_width||delete n.min_card_width,s[e]=n,this._emit({...this._config,segments:s})}_addSegment(){if(!this._config)return;const t=[...this._config.segments,{name:`Page ${this._config.segments.length+1}`,cards:[]}];this._emit({...this._config,segments:t})}_removeSegment(t){if(!this._config||this._config.segments.length<=1)return;const e=this._config.segments.filter((e,i)=>i!==t);this._emit({...this._config,segments:e})}_moveSegment(t,e){if(!this._config)return;const i=t+e;if(i<0||i>=this._config.segments.length)return;const s=[...this._config.segments];[s[t],s[i]]=[s[i],s[t]],this._emit({...this._config,segments:s})}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}}function Ct(t){return xt[t.name??""]??t.name??""}function Pt(t){return At[t.name??""]}St.styles=o`
    :host {
      display: block;
    }

    ha-form {
      display: block;
    }

    .segments-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
    }

    .segments-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .segment {
      margin-top: 8px;
      padding: 4px 12px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }

    .segment-toolbar {
      display: flex;
      align-items: center;
      gap: 0;
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }

    .segment-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .segment-meta {
      color: var(--secondary-text-color);
      font-weight: 400;
    }

    .danger {
      color: var(--error-color);
    }

    ha-alert {
      display: block;
      margin-top: 16px;
    }

    code {
      font-size: 12px;
    }
  `,t([dt({attribute:!1})],St.prototype,"hass",void 0),t([pt()],St.prototype,"_config",void 0),customElements.get(wt)||customElements.define(wt,St);const Mt=/slider|range|input|textarea|select|knob|dial|map|scrubber|swipe|carousel|gallery/,Ht="undefined"!=typeof window&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;class Ot extends at{constructor(){super(...arguments),this._active=0,this._narrow=!1,this._cards=[],this._suppressClick=!1,this._heightInit=!1,this._indicatorInit=!1,this._buildId=0,this._hostRO=new ResizeObserver(()=>{this._syncHeight(),this._syncIndicator()}),this._panelRO=new ResizeObserver(()=>this._syncHeight()),this._mqlListener=t=>{this._narrow=t.matches}}static getConfigElement(){return document.createElement(wt)}static getStubConfig(){return{segments:[{name:"Page 1",icon:"mdi:view-dashboard",cards:[]},{name:"Page 2",icon:"mdi:tune",cards:[]}]}}set hass(t){this._hass=t;for(const e of this._cards)for(const i of e)i.hass=t}get hass(){return this._hass}setConfig(t){if(!t||!Array.isArray(t.segments)||0===t.segments.length)throw new Error('deck-card: "segments" must be a non-empty list');t.segments.forEach((t,e)=>{if(!t||"object"!=typeof t)throw new Error(`deck-card: segment ${e+1} is invalid`);if(void 0!==t.cards&&!Array.isArray(t.cards))throw new Error(`deck-card: segment ${e+1}: "cards" must be a list`)});const e=!this._config;this._config=t,this._active=e?this._initialIndex(t):Math.min(this._active,t.segments.length-1),this._heightInit=!1,this._indicatorInit=!1,this.style.setProperty("--deck-card-duration",!1===t.animation?"0ms":""),this._setupMedia(),this._buildCards(t)}async getCardSize(){const t=this._cards[this._active]??[];if(!t.length)return 3;return(await Promise.all(t.map(async t=>{try{return await(t.getCardSize?.())??4}catch{return 4}}))).reduce((t,e)=>t+e,0)}connectedCallback(){super.connectedCallback(),this._hostRO.observe(this),this._setupMedia()}disconnectedCallback(){super.disconnectedCallback(),this._hostRO.disconnect(),this._panelRO.disconnect(),this._mql?.removeEventListener("change",this._mqlListener)}render(){if(!this._config)return B;const t=this._config,e=t.segments,i=t.nav??"auto",s=e.length>1,n=s&&("pills"===i||"auto"===i&&!this._narrow),r=s&&("dots"===i||"auto"===i&&this._narrow),o=this._rtl?1:-1;return V`
      ${t.title?V`<h1 class="title">${t.title}</h1>`:B}
      ${n?this._renderPills(e):B}
      <div
        class=${ft({viewport:!0,"no-swipe":!this._swipeEnabled})}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div
          class="track"
          style=${bt({transform:`translateX(${o*this._active*100}%)`})}
        >
          ${e.map((e,i)=>{const s=function(t){if("number"==typeof t&&t>0)return`${t}px`;if("string"==typeof t&&t.trim())return t.trim();return}(e.min_card_width??t.min_card_width);return V`
              <section
                class=${ft({panel:!0,columns:!!s})}
                style=${bt(s?{"grid-template-columns":`repeat(auto-fill, minmax(min(${s}, 100%), 1fr))`}:{})}
                role="tabpanel"
                aria-label=${e.name??`Segment ${i+1}`}
                ?inert=${i!==this._active}
              >
                ${this._cards[i]?.length?this._cards[i]:this._renderEmpty()}
              </section>
            `})}
        </div>
      </div>
      ${r?this._renderDots(e):B}
    `}_renderPills(t){return V`
      <nav
        class="pills"
        role="tablist"
        aria-label=${this._config?.title??"Deck"}
        @keydown=${this._onNavKeydown}
      >
        <div class="pill-indicator" aria-hidden="true"></div>
        ${t.map((t,e)=>V`
            <button
              class=${ft({pill:!0,active:e===this._active})}
              role="tab"
              aria-selected=${e===this._active?"true":"false"}
              tabindex=${e===this._active?0:-1}
              @click=${()=>this._select(e)}
            >
              ${t.icon?V`<ha-icon .icon=${t.icon}></ha-icon>`:B}
              ${t.name?V`<span class="label">${t.name}</span>`:B}
              ${void 0!==t.badge&&""!==t.badge?V`<span class="pill-badge">${t.badge}</span>`:B}
            </button>
          `)}
      </nav>
    `}_renderDots(t){return V`
      <nav class="dots" role="tablist" aria-label=${this._config?.title??"Deck"} @keydown=${this._onNavKeydown}>
        ${t.map((t,e)=>V`
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
    `}_renderEmpty(){return V`<div class="empty">Empty segment — add cards to it in the editor</div>`}firstUpdated(){this._viewport?.addEventListener("click",t=>{this._suppressClick&&(t.preventDefault(),t.stopPropagation(),this._suppressClick=!1)},{capture:!0})}updated(t){super.updated(t),this._observeActivePanel(),this._syncHeight(),this._syncIndicator(),t.has("_active")&&this._scrollActivePillIntoView()}async _buildCards(t){const e=++this._buildId,i=await(window.loadCardHelpers?.());e===this._buildId&&(i?this._cards=t.segments.map((t,e)=>(t.cards??[]).map((t,s)=>this._createCard(i,t,e,s))):console.error("deck-card: window.loadCardHelpers is unavailable"))}_createCard(t,e,i,s){const{deck_span:n,...r}=e,o=t.createCardElement(r);return"full"===n?o.style.gridColumn="1 / -1":"number"==typeof n&&Number.isInteger(n)&&n>1&&(o.style.gridColumn=`span ${n}`),this._hass&&(o.hass=this._hass),o.addEventListener("ll-rebuild",n=>{n.stopPropagation();const r=this._createCard(t,e,i,s),o=[...this._cards[i]??[]];o[s]=r;const a=[...this._cards];a[i]=o,this._cards=a}),o}_select(t){const e=this._config?.segments.length??0,i=Math.max(0,Math.min(e-1,t));if(i!==this._active){if(this._active=i,this._config?.remember)try{localStorage.setItem(this._storageKey,String(i))}catch{}window.dispatchEvent(new CustomEvent("haptic",{detail:"light"}))}}_initialIndex(t){const e=t.segments.length;if(t.remember)try{const i=localStorage.getItem(this._storageKeyFor(t));if(null!==i){const t=Number.parseInt(i,10);if(Number.isInteger(t)&&t>=0&&t<e)return t}}catch{}const i=t.default_segment;if("number"==typeof i&&Number.isInteger(i))return Math.max(0,Math.min(e-1,i));if("string"==typeof i){const e=t.segments.findIndex(t=>t.name===i);if(e>=0)return e}return 0}get _storageKey(){return this._storageKeyFor(this._config)}_storageKeyFor(t){const e=t.key??String(function(t){let e=5381;for(let i=0;i<t.length;i++)e=(e<<5)+e+t.charCodeAt(i)>>>0;return e}(t.segments.map(t=>`${t.name??""}|${t.icon??""}`).join(",")));return`deck-card:${e}`}get _swipeEnabled(){return!1!==this._config?.swipe&&(this._config?.segments.length??0)>1}get _rtl(){return"rtl"===getComputedStyle(this).direction}_onPointerDown(t){if("mouse"!==t.pointerType&&this._swipeEnabled&&!this._drag){for(const e of t.composedPath()){if(e===t.currentTarget)break;if(e instanceof Element&&Mt.test(e.localName))return}this._drag={id:t.pointerId,startX:t.clientX,startY:t.clientY,dx:0,t0:performance.now(),width:t.currentTarget.offsetWidth||1,active:!1}}}_onPointerMove(t){const e=this._drag;if(!e||t.pointerId!==e.id)return;const i=t.clientX-e.startX,s=t.clientY-e.startY;if(!e.active){if(Math.abs(i)<8)return;if(Math.abs(i)<=Math.abs(s))return void(this._drag=void 0);e.active=!0,t.currentTarget.setPointerCapture(e.id),this._track&&(this._track.style.transition="none")}const n=this._config?.segments.length??1,r=(i<0?1:-1)*(this._rtl?-1:1),o=this._active+r;e.dx=o<0||o>n-1?.25*i:i,this._applyTransform(e.dx)}_onPointerUp(t){const e=this._drag;if(!e||t.pointerId!==e.id)return;if(this._drag=void 0,!e.active||!this._track)return;this._suppressClick=!0,window.setTimeout(()=>{this._suppressClick=!1},150),this._track.style.transition="";const i=this._config?.segments.length??1,s=Math.max(1,performance.now()-e.t0),n=e.dx/s,r=(e.dx<0?1:-1)*(this._rtl?-1:1),o=Math.abs(e.dx)>.2*e.width||Math.abs(n)>.35&&Math.abs(e.dx)>24,a=this._active+(o?r:0);o&&a>=0&&a<i?this._select(a):this._applyTransform(0)}_onPointerCancel(t){const e=this._drag;e&&t.pointerId===e.id&&(this._drag=void 0,e.active&&this._track&&(this._track.style.transition="",this._applyTransform(0)))}_applyTransform(t){if(!this._track)return;const e=this._rtl?1:-1;this._track.style.transform=`translateX(calc(${e*this._active*100}% + ${t}px))`}_onNavKeydown(t){const e=this._config?.segments.length??0;if(e<2)return;const i=this._rtl?-1:1;let s;switch(t.key){case"ArrowRight":s=this._active+i;break;case"ArrowLeft":s=this._active-i;break;case"Home":s=0;break;case"End":s=e-1;break;default:return}t.preventDefault(),this._select((s+e)%e),this.updateComplete.then(()=>{const t=this.renderRoot.querySelectorAll('[role="tab"]');t[this._active]?.focus()})}_panel(t){return this.renderRoot.querySelectorAll(".panel")[t]}_observeActivePanel(){this._panelRO.disconnect();const t=this._panel(this._active);t&&this._panelRO.observe(t)}_syncHeight(){const t=this._viewport,e=this._panel(this._active);if(!t||!e||!this._cards.length)return;const i=e.offsetHeight;return i?this._heightInit?void(t.style.height=`${i}px`):(t.style.transition="none",t.style.height=`${i}px`,t.offsetHeight,t.style.transition="",void(this._heightInit=!0)):void 0}_syncIndicator(){const t=this.renderRoot.querySelector(".pills"),e=t?.querySelector(".pill-indicator");if(!t||!e)return void(this._indicatorInit=!1);const i=t.querySelectorAll(".pill")[this._active];i&&(this._indicatorInit||(e.style.transition="none"),e.style.transform=`translate(${i.offsetLeft}px, ${i.offsetTop}px)`,e.style.width=`${i.offsetWidth}px`,e.style.height=`${i.offsetHeight}px`,this._indicatorInit||(e.offsetWidth,e.style.transition="",this._indicatorInit=!0))}_scrollActivePillIntoView(){const t=this.renderRoot.querySelector(".pills");if(!t||t.scrollWidth<=t.clientWidth+1)return;const e=t.querySelectorAll(".pill")[this._active];e?.scrollIntoView({block:"nearest",inline:"center",behavior:Ht?"auto":"smooth"})}_setupMedia(){this._mql?.removeEventListener("change",this._mqlListener);const t=this._config?.breakpoint??640;this._mql=window.matchMedia(`(max-width: ${t}px)`),this._narrow=this._mql.matches,this.isConnected&&this._mql.addEventListener("change",this._mqlListener)}}Ot.styles=o`
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
      overflow: hidden;
      touch-action: pan-y;
      transition: height var(--deck-duration) var(--deck-ease);
    }

    .viewport.no-swipe {
      touch-action: auto;
    }

    .track {
      display: flex;
      align-items: flex-start;
      transition: transform var(--deck-duration) var(--deck-ease);
      will-change: transform;
    }

    .panel {
      flex: 0 0 100%;
      width: 100%;
      min-width: 100%;
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
  `,t([pt()],Ot.prototype,"_config",void 0),t([pt()],Ot.prototype,"_active",void 0),t([pt()],Ot.prototype,"_narrow",void 0),t([pt()],Ot.prototype,"_cards",void 0),t([ut(".viewport")],Ot.prototype,"_viewport",void 0),t([ut(".track")],Ot.prototype,"_track",void 0),t([dt({attribute:!1})],Ot.prototype,"hass",null),customElements.get(yt)||customElements.define(yt,Ot),window.customCards=window.customCards??[],window.customCards.push({type:yt,name:"Deck Card",description:"Adaptive segmented container: pill tabs on desktop, swipe + dots on mobile.",preview:!1,documentationURL:"https://github.com/RobinCK/lovelace-deck-card"}),console.info("%c DECK-CARD %c v1.1.0 ","background:#4f6cff;color:#fff;padding:2px 8px;border-radius:4px 0 0 4px;font-weight:700","background:#37474f;color:#fff;padding:2px 8px;border-radius:0 4px 4px 0");export{Ot as DeckCard};
