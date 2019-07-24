(function(t){function e(e){for(var r,o,s=e[0],l=e[1],u=e[2],p=0,f=[];p<s.length;p++)o=s[p],a[o]&&f.push(a[o][0]),a[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);c&&c(e);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,s=1;s<n.length;s++){var l=n[s];0!==a[l]&&(r=!1)}r&&(i.splice(e--,1),t=o(o.s=n[0]))}return t}var r={},a={app:0},i=[];function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/chemtrails-tracker/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var c=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var r=n("64a9"),a=n.n(r);a.a},2567:function(t,e,n){"use strict";var r=n("7284"),a=n.n(r);a.a},"3bfc":function(t,e,n){"use strict";var r=n("44d9"),a=n.n(r);a.a},"44d9":function(t,e,n){},5629:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var r,a,i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Header",{attrs:{msg:"Chemtrails Tracker"}}),n("MapLoader")],1)},s=[],l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header"},[n("h1",[t._v(t._s(t.msg))])])},u=[],c={name:"Header",props:{msg:String}},p=c,f=(n("3bfc"),n("2877")),g=Object(f["a"])(p,l,u,!1,null,"6a461823",null),h=g.exports,d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{ref:"googleMap",staticClass:"map"}),t.flights.length>0?n("div",[t._l(t.flights,function(e){return n("MapMarker",{key:e.id,attrs:{flight:e,google:t.google,map:t.map}})}),t._l(t.flights,function(e){return n("HeatMap",{key:e.id,attrs:{emissionPoint:e.position,google:t.google,map:t.map}})})],2):n("Spinner")],1)},m=[],v=(n("96cf"),n("3b8d")),b=n("795b"),y=n.n(b),w="gmapsCallback",M=!!window.google,O=new y.a(function(t,e){r=t,a=e});function _(){if(M)return O;M=!0,window[w]=function(){return r(window.google)};var t=document.createElement("script");return t.async=!0,t.defer=!0,t.src="https://maps.googleapis.com/maps/api/js?key=".concat("AIzaSyAMVbh4uSxAyRGE1rRAmHCeWIOUCkUqY7w","&callback=").concat(w,"&libraries=visualization"),t.onerror=a,document.querySelector("head").appendChild(t),O}var j=n("bc3a"),k=n.n(j),x={GET_ALL:"https://opensky-network.org/api/states/all?lamin=49&lomin=15&lamax=55&lomax=25"};function S(){return P.apply(this,arguments)}function P(){return P=Object(v["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,k.a.get(x.GET_ALL);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}},t,this)})),P.apply(this,arguments)}var L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},C=[],E={name:"MapMarker",props:{google:{type:Object,required:!0},map:{type:Object,required:!0},flight:{type:Object,required:!0}},mounted:function(){new this.google.maps.Marker({position:this.flight.position,flight:this.flight,map:this.map,icon:{path:"M134.875,19.74c0.04-22.771,34.363-22.771,34.34,0.642v95.563L303,196.354v35.306l-133.144-43.821v71.424l30.813,24.072v27.923l-47.501-14.764l-47.501,14.764v-27.923l30.491-24.072v-71.424L3,231.66v-35.306l131.875-80.409V19.74z",scale:.1,fillColor:"#FFFFFF",fillOpacity:1,strokeWeight:2,rotation:this.flight.trueTrack}})}},F=E,T=Object(f["a"])(F,L,C,!1,null,"0c29ab5e",null),q=T.exports,H=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},$=[],z={name:"HeatMap",props:{google:{type:Object,required:!0},map:{type:Object,required:!0},emissionPoint:{type:Object,required:!0}},mounted:function(){new this.google.maps.visualization.HeatmapLayer({data:this.getPoint(),map:this.map})},methods:{getPoint:function(){return[new this.google.maps.LatLng(this.emissionPoint.lat,this.emissionPoint.lng)]}}},A=z,R=Object(f["a"])(A,H,$,!1,null,"3094b2a8",null),G=R.exports,D=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("img",{staticClass:"spinner rotate",attrs:{src:n("ed62"),alt:""}})},I=[],J={name:"Spinner"},U=J,V=(n("2567"),Object(f["a"])(U,D,I,!1,null,"4016c20a",null)),W=V.exports,Y={name:"Map",components:{MapMarker:q,Spinner:W,HeatMap:G},data:function(){return{google:null,map:null,heatMap:null,defaultMapsOptions:{zoom:6,center:{lat:52,lng:19}},flights:[],heatMaps:[]}},methods:{initializeMap:function(){var t=this.$refs.googleMap;this.map=new this.google.maps.Map(t,this.defaultMapsOptions)},mapFlightDataToFlights:function(t){var e=this;t.data.states.map(function(t){var n={id:t[0],callSign:t[1],originCountry:t[2],position:{lat:t[6],lng:t[5]},onGround:t[8],velocity:t[9],trueTrack:t[10]};e.flights.push(n)})}},mounted:function(){var t=Object(v["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,_();case 3:return this.google=t.sent,this.initializeMap(),t.next=7,S();case 7:e=t.sent,this.mapFlightDataToFlights(e),t.next=14;break;case 11:t.prev=11,t.t0=t["catch"](0),console.error(t.t0);case 14:case"end":return t.stop()}},t,this,[[0,11]])}));function e(){return t.apply(this,arguments)}return e}()},B=Y,K=(n("a3f6"),Object(f["a"])(B,d,m,!1,null,null,null)),N=K.exports,Q={name:"app",components:{Header:h,MapLoader:N}},X=Q,Z=(n("034f"),Object(f["a"])(X,o,s,!1,null,null,null)),tt=Z.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(tt)}}).$mount("#app")},"64a9":function(t,e,n){},7284:function(t,e,n){},a3f6:function(t,e,n){"use strict";var r=n("5629"),a=n.n(r);a.a},ed62:function(t,e,n){t.exports=n.p+"img/return.bdbbe344.svg"}});
//# sourceMappingURL=app.f3ed1c17.js.map