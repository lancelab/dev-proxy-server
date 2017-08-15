
    //\\//  Runs server and links it to backend emulator
    //      Depends only on http.createServer; no express.js

    // ------------------------------------------------------------------------------------------------------------
    //      Architecture:
    //
    //        user(web-browser) -> backend-server (proxy)
    //                               V ^     V    ^ V 
    //                               | |     |    | |------------------->---------------------|
    //                               | |     |    |                                           V
    //                               | |     |--  | --------------------> remote server with JavaScript remote-app
    //                               | |          |                                           V  
    //                               | |          |                                      request-to-db 
    //                               | |          |                                           V
    //                               | |          |                                           | 
    //                               | |--------- | ----------------------------<-------------|
    //                               |            |
    //                               |            |
    //                               |            |
    //                               |            ^
    //                               |-------> back-end-db-emulator (local to back-end-server file system )     
    //                                         '../app/js/backend/beapp.js'
    // ------------------------------------------------------------------------------------------------------------


    /// //\\ beapp API //////////////
    /*
        beappModule is a flag. See how is it set in the code.
        If( beappModule ) is falsy, then beapp API is ignored

        beapp is called only in following statements in this file
            beapp.beServer.handleUserCommands( key );
            if( req.url.match( beapp.beServer.communLoopRegEx ) ) {
            beapp.beServer.communLoop( res, body );
            beapp.beServer.setUserCookiesSimple( cookiesList, pres, cookie );
    */
    /// \\// beapp API //////////////

    //// This appication can save files, but accepted approach has a flaw: it hits remote server twice for the same file.
    //// More: find this comment below.


module.exports = beavertool_proxy_server;

function beavertool_proxy_server ( conf ) {

    //console.log( 'themodule is called ... ' );

    // //\\     CONFIGURATION
    var remoteHost   = conf.remoteHost  || 'some.site.com'; //'whirlio.com';
    var remotePath   = conf.remotePath  || '';
    var httpX        = conf.httpX       || 'http:'; //'https:'; //remote server protocol

    //:local settings
    var port                = conf.port             || 8060;
    var js_pattern          = conf.js_pattern       || /\.js$/i;
    var replace_query       = conf.replace_query    || /\?[^\?]*$/;
    var rel_path_to_save    = conf.rel_path_to_save || 'savedSite'; //inside of the parent of this file = in folder: "proxy/../"
    var doSaveSite          = conf.doSaveSite       || false; //true;
    var beappModule         = conf.beappModule      || null; //'../app/js/backend/beapp.js'; //set to falsy if there is no "beappModule"

    var binaryURL_match     = conf.binaryURL_match  || /\.(png|gif|ico|jpeg|jpg)$/i;    //with these extensions, files will be saved as binary
    var noWritesOutsideParent = true;
    // \\//     CONFIGURATION
    if( typeof remotePort === 'undefined') remotePort = 80;






    // //\\     Dependencies
    var http = require("http");
    if( httpX === 'http:' ) {
        var httpx = http;
    } else {
       //.http://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired
       //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  
       var httpx = require("https");
    }

    var cookie = require('cookie'); //https://www.npmjs.com/package/cookie
    var fs = require('fs')
    var savingPath = require( './do-save-path.js' );

    //  //\\ only to convert form-uri to obj
    //var bodyParser = require( 'body-parser' ); //only for express?

    //var parse = require( 'qs/lib/parser' );
    var queryString = require( 'qs' );

    //overkill?:
    //const parse = require( 'urlencoded-body-parser' ); //npm install urlencoded-body-parser --save
    //more: https://github.com/pillarjs/multiparty
    //  \\// only to convert form-uri to obj

    // \\//     Dependencies








    // //\\ user input to dynamic control of backend server
    if( beappModule ) {
        //https://nodejs.org/api/tty.html
        var stdin = process.stdin; //in Node.js v7.5.0, stdin is an instance of tty.ReadStream

        // ?: allows stream without pressing the "enter"
        stdin.setRawMode( true );

        // ?: resume stdin in the parent process (node app won't quit all by itself)
        // ?: unless an error or process.exit() happens)
        // All Readable streams begin in paused mode but can be switched to flowing mode in one of the following ways
        //      https://nodejs.org/api/stream.html#stream_two_modes
        stdin.resume();

        // ?: no binary
        stdin.setEncoding( 'utf8' );

        // ?: on any data into stdin
            stdin.on( 'data', function( key ){
          //c cc( 'hey, this is a key: ', key );
          if ( key === '\u0003' ) {
            //// ctrl-c ( end of text )
            process.exit();
          }
          beapp.beServer.handleUserCommands( key );
          //process.stdout.write( key ); // this normally writes the key to stdout
        });
    }
    // \\// user input to dynamic control of backend server








    //  //\\ way around missed Node.js functions
    //       this define is adopted to dojo style define
    //       should work when "node" command runs in ".." and deps have form [ "app/js/backend/communication-loop", ... ]
    global.define = function()
    {
        if( arguments.length === 2 ) {
            var deps = arguments[ 0 ];
            var fun  =  arguments[ 1 ];
        } else {
            var deps = [];
            var fun  =  arguments[ 0 ];
        }
        //.fake mods: node-require seems needs "export", but dojo-modules do not have it
        var mods = deps.map( function( dep ) { return require( '../' + dep + '.js' ); } );
        return fun.apply( global, mods );
    };
    global.ccc = console.log;
    //  \\// way around missed Node.js functions








    //  //\\ attaches backend app for data communiction //////////////////////////////////////////////////////////
    //       it is referenced as global.beapp
    //       in this file, it becomes referenced right after this statement
    beappModule && require( beappModule );
    //  \\// attaches backend app for data communiction //////////////////////////////////////////////////////////








    try {

        http.createServer( function( req, res ) {

            // //\\ parsing local request
            var headers = Object.assign( {}, req.headers );

            //.patch: forbids zipping up the response ... not sure, why Apache server decides to zip-up at all ...
            headers[ 'accept-encoding' ] = headers[ 'accept-encoding' ].replace( /(\s*gzip\s*,\s*|\s*gzip\s*$|,\s*gzip\s*)/i, '' );

            headers.host = remoteHost;
            if( remotePort !== 80 ) {
                headers.host += ':' + remotePort;
            }

            var options =
            {
                //protocol    : httpX, //TODM
                port        : remotePort,
                hostname    : remoteHost,
                method      : req.method,
                path        : remotePath + req.url,
                headers     : headers
            };


            //https://nodejs.org/api/https.html
            if( httpX === 'https:' ) {
                options.port = 443;
                //.http://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired
                options.rejectUnauthorized = false; //hack TODM
            }

            //...at current design, req.url is just a path starting with "/..."
            var noQuery     = req.url.replace( replace_query, '' );
            if( noQuery.charAt(0) !== '/' ) noQuery = '/' + noQuery; // protects against ../moo.htm ... possibly never happens bs domain.com../ never happens;
            var requestPath = noQuery;
            var cookies     = cookie.parse( req.headers.cookie || '');
            var cookiesList = cookies;
            var encoding    = req.url.match( binaryURL_match ) ? 'binary' : ''; //'utf8';
            // \\// parsing local request





            //  //\\    collecting request-post-body
            var body = '';
            var isPost = req.method.toLowerCase() === 'post';
            req.on( 'data', function( chunk ) {
                //https://medium.com/@jasnell/node-js-buffer-api-changes-3c21f1048f97#.z6rq8pplx
                body += ( chunk && chunk.toString() ) || '';
                //if( isPost ) { c cc( req.url + ' data chunk=', chunk, ' body=' + body ); }
            });
            req.on( 'end', function( chunk ) {
                body += ( chunk && chunk.toString() ) || '';
                endifyRequest( body );
            });
            //  \\//    collecting request-post-body
 


            function endifyRequest( body )
            {
                try {
                    if( beappModule && req.url.match( beapp.beServer.communLoopRegEx ) ) {
                        if( req.method === 'GET' ) {
                            res.end( 'fake body ... TODM ...' );
                        } else if( isPost ) {

                            //  //\\    processing backend server
                            //ccc( 'req keys=', Object.keys( req ), req.rawHeaders, 'body=' + body );
                            //ccc( req.uri + ' body=' + body );
                            body = queryString.parse( body );
                            beapp.beServer.communLoop( res, body );
                            //  \\//    processing backend server

                        }
                    } else {

                        //// This approach has a flaw: it hits remote server twice for the same file
                        ////    We could not make it better and use arg "respCallbackSave" for saving and
                        ////    respCallBackCore for normal processing.
                        if( doSaveSite && !isPost ) processResponse( options, respCallbackSave );
                        processResponse( options, respCallBackCore );
                    }
                } catch( err){
                    console.log( 'endifyRequest: ', err );
                    res.end( 'endifyRequest: ' + err );
                }
            }


            ///***************************************
            /// processing target (remote) server
            ///***************************************
            function processResponse( options, callB )
            {
                //here is the request to target server starts
                var preq = httpx.request( options, callB );
                preq.on( 'error', function( err ) {
                    console.log('problem with request: ' + err.message);
                });
                preq.end(); //super vital to have
            }


            function respCallbackSave( pres ) {
                pres.setEncoding( encoding );
                //fails: c cc( pres.encoding );
                respCallBackCore( pres, 'save' );
            }


            /// Input: arg "save" is defined only for "saving-scenario"
            function respCallBackCore( pres, save )
            {
                if( save ) {
                    var allChunks = '';
                } else {
                    //. used to bypass user login to simplify emulation of backen application
                    if( beappModule ) beapp.beServer.setUserCookiesSimple( cookiesList, pres, cookie );
                    res.writeHead( pres.statusCode, pres.headers );
                }
                pres.on( 'data', function( chunk ) {
                    if( save ) {
                        allChunks += chunk;
                    } else {
                        res.write( chunk );
                    }
                });
                pres.on( 'end', function ( chunk ) {
                    if( save ) {
                        chunk && ( allChunks += chunk );
                        var pathIndexFixed = requestPath.charAt( requestPath.length - 1 ) === '/' ? '/@@index.html' : requestPath;
                        //to test statement below: pathIndexFixed = '../';
                        if( noWritesOutsideParent && /\.\.\//.test( pathIndexFixed ) ) {
                            ccc( 'wrong path in url =' + pathIndexFixed );
                            return; //security check
                        }
                        savingPath.saveFile( rel_path_to_save + pathIndexFixed, allChunks, encoding );             
                    } else {
                        //c cc( 'pres.end: chunk.len=', ( chunk && chunk.length ) || 0 );
                        res.end( chunk ); 
                    }
                });
                pres.on( 'error', function( err ) {
                    console.log( 'problem with response: ' + err.message );
                });
            };


        }).listen( port ); //wrong: ( err ) => { ccc( err ); } );

    } catch ( err ) {
      console.log( err );
    }  




    console.log( '************ Server running at http://localhost:' + port + '/');
}

