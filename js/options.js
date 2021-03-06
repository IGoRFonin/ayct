// Saves options to chrome.storage.sync.
function save_options() {
  var userName = document.getElementById('username').value;
  chrome.storage.sync.set({
    userName: userName,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    userName: ''
  }, function(items) {
    document.getElementById('username').value = items.userName;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
