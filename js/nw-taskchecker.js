var notified = 0,
    completedTasks = '0',
    timeout = 5*1000,
    timeoutKeepAlive = 60*1000,
    profImg = 'http://gateway.playneverwinter.com/tex/Crafting_Profession_Generic.png',
    showNotify = 'true';

function keepAlive() {
    http_request = new XMLHttpRequest();
    http_request.open('GET', "/bundle");
    http_request.send(null);
};

function init(){
        // sendMessage("App Loaded","The app is loaded and monitoring this page","load");
        updateSettings();
        sendMessage(profImg,'NeverWinter', 'TaskChecker Initiated', 'load');
        checkTasks();
        setInterval(function(){
            keepAlive();
        },timeoutKeepAlive);
        // setInterval(function(){checkTasks();}, timeout);
}

function checkTasks(){

        // console.log('checking tasks');
    setInterval(function () {
        updateSettings();
        completedTasks = document.getElementsByClassName('professions-tab-info')[0].getElementsByTagName('span')[0].innerHTML;
      if(completedTasks > notified){ //if there are any and we have not notified
        var els = evaluateXpath("//*[@id=\"update-content-professions-overview-0\"]/span/div/div/ul/li/span/div/div[4]/h6");
        var diff = completedTasks - notified;
        for(var i = 0;i<els.length;i++){
                var html = els[i].innerHTML;
                if(html == "Task Complete!"){
                        var desc = els[i].parentNode.getElementsByTagName("h4")[0];
                        var img = els[i].parentNode.getElementsByClassName('icon-slot')[0].getElementsByTagName('img')[0].src;
                        sendMessage(img,html,desc.innerHTML,"app");
                        notified++;
                }
        }
      }else if(completedTasks == 0){ //if user cleared tasks, lets start it over
        notified = 0;
      }else if(notified > completedTasks){ //lets just make sure we are staying sync
        notified = completedTasks;
      }
      sendMessage(null,null,null,'update');
    }, 5000);
}

function evaluateXpath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

function updateSettings(){
    chrome.extension.sendMessage({method: "getLocalStorage", key: "nw-tc-notify"}, function(response) {
      // console.log('updating settings:',response.data);
      showNotify = response.data;
    });
}

function sendMessage(img,title,msg,type){
    if(showNotify === 'true' || type == 'update'){
        // console.log('sending',showNotify);
        chrome.extension.sendMessage({img: img, msg: msg, title: title, type: type, tasks: completedTasks }, function(response) { // optional callback - gets response
            // console.log(response.returnMsg);
        });
    }
}

init();
