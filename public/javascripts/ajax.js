var ajax = (function(){

function ajax_req(jax){
    var method = "GET";
    if ("method" in jax) method = jax.method;
    var url;
    if ("url" in jax) url = jax.url;
    else throw new Error("URL's bad");
    var doc = null;
    if ("doc" in jax) doc = jax.doc;
    var ok = null;
    if ("ok" in jax) ok = jax.ok;
    var error = null;
    if ("error" in jax) error = jax.error;
    var req = new XMLHttpRequest();
    req.open(method,url,true);
    req.onreadystatechange = function(){
        if (req.readyState == 4){
            if (req.status == 200){
                // This is the important part
                if (ok != null) ok(req);
            }
            else{
                if (error != null) error(req);
            }
        }
    };
    if ("mime" in jax){
        req.setRequestHeader('Content-Type',jax.mime);
    }
    req.send(doc);
    return req;
    }
    return{
        ajax_req:ajax_req
    };
}());
