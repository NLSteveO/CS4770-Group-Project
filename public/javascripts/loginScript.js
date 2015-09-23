// Checks login info against database and logs user in if correct
function login() {
  var login = {
    user: document.getElementById('username').value,
    pass: document.getElementById('password').value
  };
  var pack = JSON.stringify(login);
  var r = '/login';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      var resobj = res.responseText;
      resobj = JSON.parse(resobj);
      storeUser(resobj);
      window.location.replace('/admin');
    },
    error: function(res) {
      if (res.status === 401)
        document.getElementById('wrong').removeAttribute('hidden');
      else
        window.alert(res.status);
    }
  });
}

// Takes the user information and stores into localStorage for easy access when needed
function storeUser(user) {
  var remember = document.getElementById("remember").checked;
  if (!localStorage) {
        alert("Local storage not supported");
        return;
  }
  if (remember == true) {
    localStorage.setItem("cs4770.login.remember", "true");
  } else {
    localStorage.setItem("cs4770.login.remember", "false");
  }
  localStorage.setItem("cs4770.login.name", user.Name);
  localStorage.setItem("cs4770.login.user", user.Username);
  localStorage.setItem("cs4770.login.password", user.Password);
  localStorage.setItem("cs4770.login.email", user.Email);
  localStorage.setItem("cs4770.login.token", user.Token);
  localStorage.setItem("cs4770.login.network", user.Network);
  localStorage.setItem("cs4770.login.sim", user.Sim);
  localStorage.setItem("cs4770.login.loggedIn", "true");
  
}
