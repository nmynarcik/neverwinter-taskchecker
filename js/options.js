// Saves options to localStorage.
function save_options() {
  var cb = document.getElementById("nw-tc-cb");
  var showNotify = cb.checked;
  localStorage["nw-tc-notify"] = showNotify;
  // console.log('showNotify',showNotify);

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var notifySetting = (localStorage["nw-tc-notify"] == 'true') ? true : false;
  var cb = document.getElementById("nw-tc-cb");
  cb.checked = notifySetting;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
