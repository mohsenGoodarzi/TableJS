function ajax( options ) {
    options = {
        type: options.type || "POST",
        url: options.url || "",
        timeout: options.timeout || 5000,
        Completed: options.Completed || function () { },
        Failed: options.Failed || function(){},
        Success: options.Success || function(){},
        data: options.data || ""
    };
     var xml = new XMLHttpRequest();
    xml.open(options.type, options.url, true);
    var timeoutLength = options.timeout;
    var requestDone = false;
    setTimeout(function(){
        requestDone = true;
    }, timeoutLength);
      xml.onreadystatechange = function(){
        if ( xml.readyState === 4 && !requestDone && xml.status===200) {
   
            if ( httpSuccess( xml ) ) {
              
                options.Success( httpData( xml, options.type ) );
            } else {
                options.Failed();
            }
            options.Completed();
          
            xml = null;
        }
    };
 
    xml.send();

    function httpSuccess(r) {
        try {
            return !r.status && location.protocol === "file:" || ( r.status >= 200 && r.status < 300 ) ||
            // not modified
            r.status === 304 ||
            // Safari not modified
            navigator.userAgent.indexOf("Safari") >= 0
            && typeof r.status === "undefined";
        } catch(e){}
        return false;
    }
    function httpData(r,type) {
     
        var ct = r.getResponseHeader("content-type");
        var data = !type && ct && ct.indexOf("xml") >= 0;
        data = type === "xml" || data ? r.responseXML : r.responseText;
        if (type === "script")
            eval.call(window, data);
        return data;
    }
}