!function e(t,n,i){function s(o,a){if(!n[o]){if(!t[o]){var u="function"==typeof require&&require;if(!a&&u)return u(o,!0);if(r)return r(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var h=n[o]={exports:{}};t[o][0].call(h.exports,function(e){var n=t[o][1][e];return s(n?n:e)},h,h.exports,e,t,n,i)}return n[o].exports}for(var r="function"==typeof require&&require,o=0;o<i.length;o++)s(i[o]);return s}({1:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=function(){function e(t,n){var s=this;return i(this,e),this._stateChangeCb=t,this._subscriptionUpdate=n,this._state={UNSUPPORTED:{id:"UNSUPPORTED",interactive:!1,pushEnabled:!1},INITIALISING:{id:"INITIALISING",interactive:!1,pushEnabled:!1},PERMISSION_DENIED:{id:"PERMISSION_DENIED",interactive:!1,pushEnabled:!1},PERMISSION_GRANTED:{id:"PERMISSION_GRANTED",interactive:!0},PERMISSION_PROMPT:{id:"PERMISSION_PROMPT",interactive:!0,pushEnabled:!1},ERROR:{id:"ERROR",interactive:!1,pushEnabled:!1},STARTING_SUBSCRIBE:{id:"STARTING_SUBSCRIBE",interactive:!1,pushEnabled:!0},SUBSCRIBED:{id:"SUBSCRIBED",interactive:!0,pushEnabled:!0},STARTING_UNSUBSCRIBE:{id:"STARTING_UNSUBSCRIBE",interactive:!1,pushEnabled:!1},UNSUBSCRIBED:{id:"UNSUBSCRIBED",interactive:!0,pushEnabled:!1}},"serviceWorker"in navigator&&"PushManager"in window&&"showNotification"in ServiceWorkerRegistration.prototype?void navigator.serviceWorker.ready.then(function(){s._stateChangeCb(s._state.INITIALISING),s.setUpPushPermission()}):void this._stateChangeCb(this._state.UNSUPPORTED)}return s(e,[{key:"_permissionStateChange",value:function(e){switch(e){case"denied":this._stateChangeCb(this._state.PERMISSION_DENIED);break;case"granted":this._stateChangeCb(this._state.PERMISSION_GRANTED);break;case"default":this._stateChangeCb(this._state.PERMISSION_PROMPT);break;default:console.error("Unexpected permission state: ",e)}}},{key:"setUpPushPermission",value:function(){var e=this;return this._permissionStateChange(Notification.permission),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){t&&(e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t))})["catch"](function(t){console.log(t),e._stateChangeCb(e._state.ERROR,t)})}},{key:"subscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_SUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.subscribe({userVisibleOnly:!0})}).then(function(t){e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t)})["catch"](function(t){e._permissionStateChange(Notification.permission),"denied"!==Notification.permission&&"default"!==Notification.permission&&e._stateChangeCb(e._state.ERROR,t)})}},{key:"unsubscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_UNSUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){return t?t.unsubscribe().then(function(e){e||console.error("We were unable to unregister from push")}):(e._stateChangeCb(e._state.UNSUBSCRIBED),void e._subscriptionUpdate(null))}).then(function(){e._stateChangeCb(e._state.UNSUBSCRIBED),e._subscriptionUpdate(null)})["catch"](function(e){console.error("Error thrown while revoking push notifications. Most likely because push was never registered",e)})}}]),e}(),o=function(){function e(){var t=this;i(this,e),this._PUSH_SERVER_URL="",this._API_KEY="AIzaSyBBh4ddPa96rQQNxqiq_qQj7sq1JdsNQUQ",this._sendPushOptions=document.querySelector(".js-send-push-options");var n=document.querySelector(".js-push-toggle-switch");n.classList.contains("is-upgraded")?(this.ready=Promise.resolve(),this._uiInitialised(n.MaterialSwitch)):this.ready=new Promise(function(e){var i=function s(){n.classList.contains("is-upgraded")&&(t._uiInitialised(n.MaterialSwitch),document.removeEventListener(s),e())};document.addEventListener("mdl-componentupgraded",i)})}return s(e,[{key:"_uiInitialised",value:function(e){var t=this;this._stateChangeListener=this._stateChangeListener.bind(this),this._subscriptionUpdate=this._subscriptionUpdate.bind(this),this._toggleSwitch=e,this._pushClient=new r(this._stateChangeListener,this._subscriptionUpdate),document.querySelector(".js-push-toggle-switch > input").addEventListener("click",function(e){e.target.checked?t._pushClient.subscribeDevice():t._pushClient.unsubscribeDevice()})}},{key:"registerServiceWorker",value:function(){var e=this;"serviceWorker"in navigator?navigator.serviceWorker.register("./service-worker.js")["catch"](function(){e.showErrorMessage("Unable to Register SW","Sorry this demo requires a service worker to work and it was didn't seem to install - sorry :(")}):this.showErrorMessage("Service Worker Not Supported","Sorry this demo requires service worker support in your browser. Please try this demo in Chrome or Firefox Nightly.")}},{key:"_stateChangeListener",value:function(e,t){switch("undefined"!=typeof e.interactive&&(e.interactive?this._toggleSwitch.enable():this._toggleSwitch.disable()),"undefined"!=typeof e.pushEnabled&&(e.pushEnabled?this._toggleSwitch.on():this._toggleSwitch.off()),e.id){case"ERROR":this.showErrorMessage("Ooops a Problem Occurred",t)}}},{key:"_subscriptionUpdate",value:function(e){var t=this;if(!e)return void(this._sendPushOptions.style.opacity=0);var n;n=0===e.endpoint.indexOf("https://android.googleapis.com/gcm/send")?this.produceGCMProprietaryCURLCommand(e):this.produceWebPushProtocolCURLCommand(e);var i=document.querySelector(".js-curl-code");i.innerHTML=n;var s=document.querySelector(".js-send-push-button");s.addEventListener("click",function(){t.sendPushMessage(e)}),this._sendPushOptions.style.opacity=1}},{key:"sendPushMessage",value:function(e){0===e.endpoint.indexOf("https://android.googleapis.com/gcm/send")?this.useGCMProtocol(e):this.useWebPushProtocol(e)}},{key:"useGCMProtocol",value:function(e){var t=this;console.log("Sending XHR to GCM Protocol endpoint");var n=new Headers;n.append("Content-Type","application/json"),n.append("Authorization","key="+this._API_KEY);var i=e.endpoint.split("/"),s=i[i.length-1];fetch("https://android.googleapis.com/gcm/send",{method:"post",headers:n,body:JSON.stringify({registration_ids:[s]})}).then(function(e){return e.json()}).then(function(e){if(0!==e.failure)throw console.log("Failed GCM response: ",e),new Error("Failed to send push message via GCM")})["catch"](function(e){t.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"useWebPushProtocol",value:function(e){var t=this;console.log("Sending XHR to Web Push Protocol endpoint"),fetch(e.endpoint,{method:"post"}).then(function(e){if(e.status>=400&&e.status<500)throw console.log("Failed web push response: ",e,e.status),new Error("Failed to send push message via web push protocol")})["catch"](function(e){t.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"produceGCMProprietaryCURLCommand",value:function(e){var t="https://android.googleapis.com/gcm/send",n=e.endpoint.split("/"),i=n[n.length-1],s='curl --header "Authorization: key='+this._API_KEY+'" --header Content-Type:"application/json" '+t+' -d "{\\"registration_ids\\":[\\"'+i+'\\"]}"';return s}},{key:"produceWebPushProtocolCURLCommand",value:function(e){var t=e.endpoint,n="curl --request POST "+t;return n}},{key:"showErrorMessage",value:function(e,t){var n=document.querySelector(".js-error-message-container"),i=n.querySelector(".js-error-title"),s=n.querySelector(".js-error-message");i.textContent=e,s.textContent=t,n.style.opacity=1;var r=document.querySelector(".js-send-push-options");r.style.display="none"}}]),e}();window.onload=function(){var e=new o;e.ready.then(function(){e.registerServiceWorker()})}},{}]},{},[1]);
//# sourceMappingURL=main.js.map
