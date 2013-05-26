chrome.extension.onMessage.addListener(
     function(request, sender, sendResponse) {
                    // chrome.extension.getBackgroundPage().console.log(request.tasks);
                    if (request.method == "getLocalStorage"){
                      sendResponse({data: localStorage[request.key]});
                      return;
                    }else{
                      // sendResponse({data: true}); // snub them.
                    }

                    if(request.type == "update"){
                        // chrome.extension.getBackgroundPage().console.log('UPDATE', request.tasks, sender);
                            chrome.browserAction.setBadgeText({text: request.tasks}); //set number of tasks completed in badge
                            if(request.tasks > 0){
                                chrome.browserAction.setBadgeBackgroundColor({color: '#a80400'}); //set badge bg to red
                            }else{
                                chrome.browserAction.setBadgeBackgroundColor({color: '#00a814'}); // set it to green
                            }
                            return;
                    }

                    // Create a simple text notification:
                    var notify = webkitNotifications.createNotification(
                      request.img,  // icon url - can be relative
                      request.title,  // notification title
                      request.msg  // notification body text
                    );

                    notify.show();

                    notify.onclick = function () {
                        chrome.tabs.update(sender.tab.id,{selected:true});
                    }

                    chrome.browserAction.setBadgeText({text: request.tasks}); //set number of tasks completed in badge
                    if(request.tasks > 0){
                        chrome.browserAction.setBadgeBackgroundColor({color: '#a80400'}); //set badge bg to red
                    }else{
                        chrome.browserAction.setBadgeBackgroundColor({color: '#00a814'}); // set it to green
                    }

                    setTimeout(function(){
                        notify.cancel();
                    },5000);
                    // sendResponse({returnMsg: "All good!"}); // optional response
     }
);

chrome.browserAction.onClicked.addListener(function(tab) { //bind clicking of the icon in toolbar
    onClickAction();
});
function onClickAction() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGatewayUrl(tab.url)) {
        chrome.tabs.update(tab.id, {selected: true});
        return;
      }
    }
    chrome.tabs.create({url: 'http://gateway.playneverwinter.com'});
  });
};

function isGatewayUrl(url) {
  return url.indexOf('gateway.playneverwinter.com') != -1 ? true : false;
};
