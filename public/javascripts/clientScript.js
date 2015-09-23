// Fills out large portion of the client page dynamically to reflect database data
function fill() {
  document.getElementById('name').innerHTML = "Hello " + localStorage.getItem("cs4770.login.name");
  var topDiv = document.getElementById('top');
  var label = document.createElement('label');
  label.innerHTML = 'Network:';
  topDiv.appendChild(label);
  var menu = document.createElement('select');
  menu.id = 'networks';
  var option = document.createElement('option');
  option.value = 'none';
  option.text = 'No Network';
  topDiv.appendChild(menu);
  loadNetworks();
  menu.add(option);
  var button = document.createElement('button');
  button.innerHTML = 'Change';
  button.id = 'change';
  topDiv.appendChild(button);
  var net = localStorage.getItem("cs4770.login.network");
  counts();
  document.getElementById('change').onclick = function() {changeNetwork()};
}

// Increases global and local counters asynchronously
function increase() {
  var x = document.getElementById("loca").innerHTML;
  var y = document.getElementById("glob").innerHTML;
  y++;
  x++;
  if (net != 'none')
    localStorage.setItem("gcount"+net, y);
  localStorage.setItem("lcount", x);
  counts();
}

// Changes a clients network asynchronously
function changeNetwork() {
  var p = {
    Network: document.getElementById('networks').value,
    Token: localStorage.getItem("cs4770.login.token"),
    Sim: localStorage.getItem("cs4770.login.sim")
  };
  var pack = JSON.stringify(p);
  var r = '/client/update/network';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      if (net != undefined)
      document.getElementById(net).selected = false;
      document.getElementById(document.getElementById('networks').value).selected = true;
      net = document.getElementById('networks').value;
      localStorage.setItem("cs4770.login.network", net);
      counts();
    },
    error: function(res) {
      window.alert(res.status);
    }
  });
}
