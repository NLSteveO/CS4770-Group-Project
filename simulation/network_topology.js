var networkList;
var deviceList;


function NetworkIterator(){
  // An iterator over networks in the simulation
  var pos = 0;

  this.first = function() {
    // Return the first element
    return networkList[pos];
  };

  this.next = function() {
    // Return the next element
    pos++;
    return networkList[pos-1];
  };

  this.hasNext = function() {
    // Determine if there are more elements to iterate
    return (pos+1 < networkList.length);
  };

  this.reset = function() {
    // Reset the iterator to its initial state so it can be re-used
    pos = 0;
  };

  this.each = function(callback) {
    // Invoke the callback function on each element
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}


function DeviceIterator(){
  // Similar to the NetworkIterator except the elements are devices
  var pos = 0;

  this.first = function() {
    return deviceList[pos];
  };

  this.next = function() {
    pos++;
    return deviceList[pos-1];
  };

  this.hasNext = function() {
    return (pos+1 < deviceList.length);
  };

  this.reset = function() {
    pos = 0;
  };

  this.each = function(callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}


function Network(networkName, networkKind){
  // Construct a network object

  this.networkName = networkName; // String
  this.networkKind = networkKind; // Constant: WiFi, GSM
  var connections = {};

  this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects

  this.addDevice = function(device){
    // Adds a device object to the network
    deviceList.push(device);
  };

  this.removeDevice = function(device){
    // Remove the device object from the network
    while(deviceList[0] != device)
      deviceList.push(deviceList.shift());
    deviceList.shift();
  };

  this.connectNetwork = function(network){
    // Connect the network to another
    connections.push(network);
  };

  this.disconnectNetwork = function(network){
    // Disconnect the network from another
    while(connections[0] != network)
      connections.push(connections.shift());
    connections.shift();
  };
}


function Device(deviceName){
  // Construct a device object

  this.deviceName = deviceName;
  var currentNetwork;
  var previousNetwork;

  this.joinNetwork = function(network){
    // Make the device join a network
    currentNetwork = network;
    network.addDevice(this);
  };

  this.leaveNetwork = function(){
    // Make the device leave connected network
    previousNetwork = currentNetwork;
    currentNetwork.removeDevice(this);
  };

  this.returnNetwork = function(){
    // Make the device re-join a previous network
    previousNetwork.addDevice(this);
  };

  this.replicateRDT = function(rdt){
    // Register a replicated data type in the device
    // Will add later
  };

  this.accessRDT = function(){
    // Access the previously registered replicated data type in the device
    // Will add later
  };
}


exports.NetworkIterator = NetworkIterator;
exports.DeviceIterator = DeviceIterator;
exports.Network = Network;
exports.Device = Device;