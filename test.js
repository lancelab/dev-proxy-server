
    console.log( 'calling dev test ...' );


    // //\\ INSTRUCTIONS
    /*    
            In default configuration (below) the target domain
            is set to whirlio.com

            And proxy-server responses to http://localhost:8060

            In browser window, put local domain and target path, "/",
                for example
                http://localhost:8060/

            or, for example, path = /doc/guest_readme.htm
                http://localhost:8060/doc/guest_readme.htm
    */
    // \\// INSTRUCTIONS




    // //\\     CONFIGURATION

    var MODE = "PRODUCTION"; // "DEVELOPMENT";

    var conf =
    {
        //// all parameters are optional

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
        //. "savedSite" apparently has web sockets which perhaps are not implemented
        //in text after these two lines
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
        // dev server
        //var remoteHost   = '.....';
        //var remotePath   = '...';
        //var remotePort   = '..';
        // ============================================


        //:local settings
        port                    : 8060,
        js_pattern              : /\.js$/i,
        replace_query           : /\?[^\?]*$/,

        //.place where cloned site will be saved
        //sibling to dev-test.js
        rel_path_to_save        : 'savedSite',

        //usually emulates back end server
        beappModule             : null //null or '../app/js/backend/beapp.js'; 
    }
    // \\//     CONFIGURATION









    if( MODE === "DEVELOPMENT" ) {

        //// use this code when developing this module
        //// non-convenient way to develop, but relative path had no luck
        var test = require( "/var/www/html/sand/dev/platforms/nodejs/creating-node-modules/beavertool-proxy-server-root/beavertool-proxy-server/beavertool-proxy-server.js");

        //.is there a way to test the module with relative path aka:
        //var test = require( "./beavertool_proxy_server" );
        //something like: https://docs.npmjs.com/cli/link

    } else {

        //// use this code when installed from npm
        var test = require( "beavertool-proxy-server");

        //  use this if main : ... in package.json fails:
        //  var test = require( "beavertool-proxy-server/beavertool-proxy-server/beavertool-proxy-server");
    }

    test( conf );

