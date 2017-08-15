
    console.log( 'calling dev test ...' );






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


    //non-convenient way to develop
    var test = require( "/var/www/html/sand/web-dev/platforms/backend/nodejs/creating-node-modules/second-project/beavertool-proxy-server/beavertool-proxy-server");

    test( conf );

