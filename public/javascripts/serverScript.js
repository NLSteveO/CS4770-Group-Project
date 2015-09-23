// Adds event listeners to selected divs
function setup() {
  var bottom = document.getElementById('bottom');
  bottom.addEventListener('dragenter', function(e){e.preventDefault();}, false);
  bottom.addEventListener('drop', dragDrop, false);
  bottom.addEventListener('dragover', function(e){e.preventDefault();}, false);
}

// Calls setup function when pages loads
window.addEventListener("load", setup, false);

// Inserts device into topo based on database info
function insertDevice(username, token, network) {//add new device
  var x= new Date().getTime().toString();
  var div = document.createElement('div');
  div.className = 'client';
  div.id = token;
  div.setAttribute('draggable', 'true');
  div.addEventListener('dragstart', dragStart, false);
  div.addEventListener('dragend', dragEnd, false);
  div.innerHTML = "<p>Token: "+ token +"</p>";
  if (network == 'none' || network == '')
    document.getElementById('bottom').appendChild(div);  
  else
    document.getElementById(network).appendChild(div);
}

// Inserts network into topo based on database info
function insertNetwork(name, type) {//add new network
  var div = document.createElement('div');
  div.className = 'networks';
  div.id = name;
  div.addEventListener('dragenter', function(e){e.preventDefault();}, false);
  div.addEventListener('drop', dragDrop, false);
  div.addEventListener('dragover', function(e){e.preventDefault();}, false);
  var htmlLine="<p>Network Name: "+name+"<br/>"+"Network Type: "+type+"</p>";
  div.innerHTML += htmlLine;
  document.getElementById('networkBox').appendChild(div);
  addDot(name);
}

// Topology functionality begins

function addDot(name) {
  var div = document.createElement('div');
  div.className = 'dots';
  div.id = name+'dot';
  div.setAttribute('draggable', 'true');
  div.addEventListener('dragstart', drag1);
  div.addEventListener('drop', drop1, false);
  div.addEventListener('dragover', function(e){e.preventDefault();}, false);
  div.innerHTML = '&nbsp;';
  document.getElementById(name).insertBefore(div, document.getElementById(name).childNodes[0]);
}

function dragStart(ev) {
  ev.dataTransfer.effectAllowed='move';
  ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
}

function dragEnd(ev) {
  ev.dataTransfer.clearData("Text");
  generate1();
}

function dragDrop(ev) {
  var idelt = ev.dataTransfer.getData("Text");
  var id = ev.target.getAttribute('id');
  if (idelt.substring(idelt.length-3, idelt.length) != 'dot') {
    ev.target.appendChild(document.getElementById(idelt));
    ev.stopPropagation();
    if (id === 'bottom')
      id = 'none';
    var p = {
      Network: id,
      Token: idelt,
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
        if (idelt === localStorage.getItem("cs4770.login.token"))
          localStorage.setItem("cs4770.login.network", id);
      },
      error: function(res) {
        window.alert(res.status);
      }
    });
  }
}

function point(x, y, name, net1, net2) {
  var oDiv = document.createElement('div');
  var att = document.createAttribute("name");
  att.value = name;
  oDiv.setAttributeNode(att);
  oDiv.ondblclick = function () {
    while(document.getElementsByName(name).length>0){
      var hh = document.getElementsByName(name);
      var i;
      for (i = 0; i < hh.length; i++) {
        hh[i].remove();
      }
    };
    var p = {
      Network1: net1,
      Network2: net2,
      Sim: localStorage.getItem("cs4770.login.sim")
    };
    var pack = JSON.stringify(p);
    var r = '/server/remove/connect';
    ajax.ajax_req({
      method: "POST",
      url: r,
      mime: 'application/json',
      doc: pack,
      ok: function(res) {
      },
      error: function(res) {
        window.alert(res.status);
      }
    });
    generate1();
  }
  oDiv.style.backgroundColor = 'red';			
  oDiv.style.position = 'absolute';
  oDiv.id = 'dLine';
  oDiv.style.height = '4px';
  oDiv.style.width = '4px';           
  oDiv.style.left = x + 'px';
  oDiv.style.top = y + 'px';        				                        		           			
  return oDiv;			
}

function drawLine(net1, x1, y1, net2, x2, y2) {
  var x = x2 - x1;
  var y = y2 - y1;
  var frag = document.createDocumentFragment();
  if (Math.abs(y) > Math.abs(x)) {
    if (y > 0) {
      for (var i = 0; i < y; i++) {
        var width = x / y * i;
        frag.appendChild(point(width+x1,i+y1,x1+"_"+y1+"_"+x2+"_"+y2, net1, net2));
      }
    }
    if (y < 0) {
      for (var i = 0; i > y; i--) {
        var width = x / y * i;
        frag.appendChild(point(width+x1,i+y1,x1+"_"+y1+"_"+x2+"_"+y2, net1, net2));
      }
    }
  }
  else {
    if (x > 0) {
      for (var i = 0; i < x; i++) {
        var height = y / x * i
        frag.appendChild(point(i+x1,height+y1,x1+"_"+y1+"_"+x2+"_"+y2, net1, net2));
      }
    }
    if (x < 0) {
      for (var i = 0; i > x; i--) {
        var height = y / x * i
        frag.appendChild(point(i+x1,height+y1,x1+"_"+y1+"_"+x2+"_"+y2, net1, net2));
      }
    }
  }
  document.getElementById('main').appendChild(frag);
}
var p1 = 0;
var p2 = 0;
function drag1(ev) {
  ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));			
  p1 = ev.target.offsetTop + 10;
  p2 = ev.target.offsetLeft + 10;
}

function drop1(ev) {
  ev.preventDefault();
  var X = ev.target.offsetTop + 10;
  var Y = ev.target.offsetLeft + 10;
  drawLine(ev.dataTransfer.getData("Text"), p2, p1, ev.target.getAttribute('id'), Y, X);
  generate1();
  var p = {
    Network1: ev.target.getAttribute('id'),
    Network2: ev.dataTransfer.getData("Text"),
    Sim: localStorage.getItem("cs4770.login.sim")
  };
  var pack = JSON.stringify(p);
    var r = '/server/connect/network';
    ajax.ajax_req({
      method: "POST",
      url: r,
      mime: 'application/json',
      doc: pack,
      ok: function(res) {
      },
      error: function(res) {
        window.alert(res.status);
      }
    });
}

// Topology functionality begins

// Makes connection between networks from database info
function connect(net1, net2) {
  p1 = document.getElementById(net1).offsetTop + 10;
  p2 = document.getElementById(net1).offsetLeft + 10;
  var X = document.getElementById(net2).offsetTop + 10;
  var Y = document.getElementById(net2).offsetLeft + 10;
  drawLine(net1, p2, p1, net2, Y, X);
}
