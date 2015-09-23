// Checks if browser is logged in and if not redirects to login.
function loginCheck() {
  var isLoggedIn = localStorage.getItem('cs4770.login.loggedIn');
  if (isLoggedIn != 'true') {
    window.location.replace('/login');
  }
}

// Logs the user out clearing part of local storage
function logout() {
  if (localStorage.getItem("cs4770.login.remember") != "true") {
    localStorage.clear();
  }
  else {
    localStorage.removeItem('cs4770.login.name');
    localStorage.removeItem('cs4770.login.email');
    localStorage.removeItem('cs4770.login.token');
    localStorage.removeItem('cs4770.login.network');
    localStorage.setItem('cs4770.login.loggedIn', 'false');
    localStorage.setItem('lcount', '0');
  }
}

// This piece is added to easily clear my localStorage
function valid(){
  localStorage.clear();
  alert("   /\n\\/");
}

// Checks if the information is remembered and auto fills the inputs 
function auotFill(){
  if (localStorage.getItem("cs4770.login.remember") == "true") {
    username.value = localStorage.getItem("cs4770.login.user");
    password.value = localStorage.getItem("cs4770.login.password");
    remember.checked = true;
  }
}

// Loads some javascripts into the head section of some views
function loadScripts() {
  var path = window.location.pathname;
  var head = document.getElementsByTagName('head').item(0);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (path.indexOf('/register') > -1) {
    script.src = '/javascripts/regScript.js';
    head.appendChild(script);
  }
  else if (path.indexOf('/client') > -1) {
    script.src = '/javascripts/clientScript.js';
    head.appendChild(script);
  }
  else if (path.indexOf('/') > -1 || path.indexOf('/login') > -1) {
    script.src = '/javascripts/loginScript.js';
    head.appendChild(script);
  }
}
