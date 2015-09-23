// Adds network asynchronously
function addNetwork() {
  var Network = {
    Name: document.getElementById('networkName').value,
    Type: document.getElementById('networkType').value
  };
  var pack = JSON.stringify(Network);
  var r = '/admin/add/network';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      document.getElementById('networkName').value = "";
      document.getElementById('networkType').selectedIndex = 0;
      var table = document.getElementById('networkTable')
      var row = table.insertRow(-1);
      row.innerHTML = "<td>"+Network.Name+"</td><td>"+Network.Type+"<td><button name='delNetwork' onClick='delNetwork()'>Delete</button></td>";
    },
    error: function(res) {
      window.alert(res.status);
    }
  });
}

// Adds clients asynchronously
function addClients(){
  var num = Number(document.getElementById('clients').value);
  var table = document.getElementById('clientTable')
  var max;
  if (table.rows.length > 1)
    max = getMax()+1;
  else
    max = 0;
  var clients = [];
  for (var i = max; i < max+num; i++) {
    var n = i+"";
    while (n.length < 5) n = "0" + n;
    var tok = "c"+n;
    clients[i] = {Token: tok};
    var pack = JSON.stringify(clients[i]);
    var r = '/admin/add/clients';
    ajax.ajax_req({
      method: "POST",
      url: r,
      mime: 'application/json',
      doc: pack,
      ok: function(res) {},
      error: function(res) {
        window.alert(res.status);
      }
    });
  }
  document.getElementById('clients').value = "";
  for (var i = max; i < max+num; i++) {
    var row = table.insertRow(-1);
    row.innerHTML = "<td>"+clients[i].Token+"</td><td><input type='text' size='15' id='email"+clients[i].Token+"'/></td><td><button name='sendEmail' onClick='sendEmail()'>Send</button></td><td><button name='delClient' onClick='delClient()'>Delete</button></td>";
  }
}

// Gets max token number from client table
function getMax() {
  var rows = document.getElementById('clientTable').rows;
  var max = rows[1].cells[0].innerHTML;
  for (var i = 2; i < rows.length; i++) {
    if (max < rows[i].cells[0].innerHTML) {
      max = rows[i].cells[0].innerHTML;
    }
  }
  return Number(max.substring(1,6));
}

// Deletes network asynchronously
function delNetwork() {
  var confir = confirm("Are you sure?");
  if (confir == true) {
    var row = event.srcElement.parentNode.parentNode.rowIndex;
    var rowCells = document.getElementById('networkTable').rows[row].cells;
    var Network = {
      Name: rowCells[0].innerHTML,
      Type: rowCells[1].innerHTML,
    };
    var pack = JSON.stringify(Network);
    var r = '/admin/delete/network';
    ajax.ajax_req({
      method: "POST",
      url: r,
      mime: 'application/json',
      doc: pack,
      ok: function(res) {
        document.getElementById('networkTable').deleteRow(row);
      },
      error: function(res) {
        window.alert(res.status);
      }
    });
  }
}

// Deletes client device asynchronously
function delClient() {
  var confir = confirm("Are you sure?");
  if (confir == true) {
    var row = event.srcElement.parentNode.parentNode.rowIndex;
    var rowCells = document.getElementById('clientTable').rows[row].cells;
    var tok = {Token: rowCells[0].innerHTML};
    var pack = JSON.stringify(tok);
    var r = '/admin/delete/client';
    ajax.ajax_req({
      method: "POST",
      url: r,
      mime: 'application/json',
      doc: pack,
      ok: function(res) {
        document.getElementById('clientTable').deleteRow(row);
      },
      error: function(res) {
        window.alert(res.status);
      }
    });
  }
}

// Generates a preset email asynchronously with client registration url for admin to send
function sendEmail()
{
  var row = event.srcElement.parentNode.parentNode.rowIndex;
  var rowCells = document.getElementById('clientTable').rows[row].cells;
  var token = rowCells[0].innerHTML;
  var address = document.getElementById('email'+token).value;
  var sim = localStorage.getItem("cs4770.login.sim");
  var pack = JSON.stringify({Sim: sim, Token: token, Email: address});
  var r = '/admin/add/client/email';
  ajax.ajax_req({
    method: "POST",
    url: r,
    mime: 'application/json',
    doc: pack,
    ok: function(res) {
      alert("Email updated for "+token+"!");
    },
    error: function(res) {
      window.alert(res.status);
    }
  });
  
  var body = "Hello,\n\n\tWe would like you to join our simulation by being a test client.\nPlease use the token: "+token+
             " upon registration with this email address.\nOr you can copy & paste this link into your browsers address bar: \n\n"+
             "http://"+window.location.hostname+"/register/client?email="+address+"&token="+token+"&sim="+sim+"\n\nThank you!\n\nGroup 6";
  var sub = "Please be a test client."
  var link = 'mailto:' + escape(address) + '&subject=' + escape(sub) + '&body=' + escape(body);
  window.location.href = link;
}
