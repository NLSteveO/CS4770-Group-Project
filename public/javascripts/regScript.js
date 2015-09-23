window.addEventListener('load', loadNetworks);

// Takes admin registration info and updates the admin on database
function addadmin() {
  var admin = {
    Name: document.getElementById('name').value,
    Username: document.getElementById('username').value,
    Password: document.getElementById('password').value,
    Email: document.getElementById('email').value,
    Token: document.getElementById('token').value,
  };
  var pack = JSON.stringify(admin);
  var r = '/register/admin/new';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      var resobj = res.responseText;
      if (resobj.length > 0) {
        storeUser(JSON.parse(resobj));
      }
      window.location.replace('/admin');
    },
    error: function(res) {
      window.alert(res.status);
    }
  });
}

// Takes clients registration info and updates the client on database
function addclient() {
  var sim = {
    Sim: document.getElementById('sims').value,
    Name: document.getElementById('name').value,
    Username: document.getElementById('username').value,
    Password: document.getElementById('password').value,
    Email: document.getElementById('email').value,
    Token: document.getElementById('token').value,
    Network: document.getElementById('networks').value
  };
  var pack = JSON.stringify(sim);
  var r = '/register/client/new';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      storeUser(sim);
      window.location.replace('/client');
    },
    error: function(res) {
      window.alert("Sorry, user not found");
    }
  });
}

// Stores user info into localStorage for easy access
function storeUser(user) {
  if (!localStorage) {
        alert("Local storage not supported");
        return;
  }
  localStorage.setItem("cs4770.login.name", user.Name);
  localStorage.setItem("cs4770.login.user", user.Username);
  localStorage.setItem("cs4770.login.password", user.Password);
  localStorage.setItem("cs4770.login.email", user.Email);
  localStorage.setItem("cs4770.login.token", user.Token);
  localStorage.setItem("cs4770.login.network", user.Network);
  localStorage.setItem("cs4770.login.sim", user.Sim);
  localStorage.setItem("cs4770.login.loggedIn", "true");
  localStorage.setItem("cs4770.login.remember", "false");
  
}

// Loads new clients network options based on simulation asynchronously
function loadNetworks() {
  var tok = {Sim: document.getElementById('sims').value};
  var pack = JSON.stringify(tok);
  var r = '/register/client/networks';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      var resobj = JSON.parse(res.responseText);
      var menu = document.getElementById('networks');
      var size = menu.length;
      for (var i = size; i > 0; i--) {
        menu.remove(i);
      }
      if (resobj.length > 0) {
        for (var i = 0; i < resobj.length; i++) {
          var option = document.createElement('option');
          option.value = resobj[i].Name;
          option.text = resobj[i].Name;
          menu.add(option);
        }
      }
    },
    error: function(res) {
      window.alert(res.status);
    }
  });
}
