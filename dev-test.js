
    console.log( 'calling dev test ...' );


    // //\\ INSTRUCTIONS
    /*    
            In given configuration (below) the target domain is set to whirlio.com
            And proxy-server responses to http://localhost:8060
            In browser window, put local domain and target path, "/", for example
                http://localhost:8060/
            or, for example, path = /doc/guest_readme.htm
                http://localhost:8060/doc/guest_readme.htm
    */
    // \\// INSTRUCTIONS


    // //\\     CONFIGURATION
    ///         all parameters are optional
    var conf =
    {

        // ======================================================
        // site 1
        remoteHost   : 'whirlio.com',   //'microsoft.com', //'whirlio.com',
        remotePath   : '',
        httpX        : 'http:',         //'https:'; //remote server protocol
        doSaveSite   : true,            //false, //true;
        // ======================================================


        // ======================================================
        // site x
        //remoteHost   : 'www.politico.com',
        //remotePath   : '',
        //httpX        : 'http:',         //'https:'; //remote server protocol
        //doSaveSite   : true,            //false, //true;
        // call this path: /magazine/story/2016/02/rfk-jr-why-arabs-dont-trust-america-213601?o=0
        // ======================================================





        /*
        // ======================================================
        // site 2
        var remoteHost   = 'localhost';
        //. "savedSite" apparently has web sockets which perhaps are not implemented in text after these two lines
        //var remotePath = '/xb/back/3rd/sniffed/march13/dev/savedSite';

        //appar. this does not crash on WebSockets
        var remotePath = '/rb/back/3rd/sniffed/feb27/chok/savedSite';
        var httpX      = 'http:'; //'https:'; //remote server protocol
        // ======================================================
        */



        // ============================================
        // site 3
        //var remoteHost   = '.....xbone.com';
        //var remotePath   = '';
        //var httpX        = 'https:'; //'http:'; //'https:'; //remote server protocol
        // ============================================


        // ============================================
        // site 4
        //  dev server
        //var remoteHost   = '.....';
        //var remotePath   = '...';
        //var remotePort   = '..';
        // ============================================


        //:local settings
        port                    : 8060,
        js_pattern              : /\.js$/i,
        replace_query           : /\?[^\?]*$/,

                                               //should be folder where "node script.js" runs 
        rel_path_to_save        : 'savedSite', //inside of the parent of this file = in folder: "proxy/../"

        beappModule             : null //'../app/js/backend/beapp.js'; //set to falsy if there is no "beappModule"
    }
    // \\//     CONFIGURATION






    //.is there a way to test the module with relative path aka:
    //var test = require( "./beavertool_proxy_server" );
    //something like: https://docs.npmjs.com/cli/link



    //  //\\ when developing this module
    //.non-convenient way to develop, but relative path had no luck
    var test = require( "/var/www/html/sand/dev/platforms/nodejs/creating-node-modules/beavertool-proxy-server-root/beavertool-proxy-server/beavertool-proxy-server.js");
    //  \\// when developing this module




    //  //\\ when installed inside of other project:

    //use this if main : ... in package.json fails:
    //var test = require( "beavertool-proxy-server/beavertool-proxy-server/beavertool-proxy-server");

//    var test = require( "beavertool-proxy-server");
    //  \\// when installed inside of other project:

    test( conf );

