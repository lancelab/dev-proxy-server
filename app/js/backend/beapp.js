
define(
[
    "app/conf", 
    "app/js/backend/communication-loop"
],
function()
{
    //http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
    if( typeof global === 'undefined' ) {
        var urlPars = window.location.search;
        var glo = window;
        var doExtend = function( deep, obj, target ) { return $.extend( deep, obj, target ) };
        var beServer = null; //flag
    } else {
        var urlPars = '';
        var glo = global;
        var doExtend  = require( 'extend' );
        var beServer = {};
    }

    
    var sharapp       = glo.sharapp = glo.sharapp || {};  //app shared between applications
    var conf          = sharapp.conf;

    var beapp         = glo.beapp = glo.beapp || {};
    var self          = beapp;
    beapp.dtb         = {};
    beapp.beServer    = beServer;
    var emu           = beapp.emu = beapp.emu || {};

    





    // //\\ CONFIGURATION  ///////////////////////////////////////////////////
    emu.user =
    {
        username        : "demo@landkey.com",
        userid          : "-1",
        fname           : "Empty",
        lname           : "User",
        sessiontoken    : '1234567890'
    };
    // \\// CONFIGURATION  ///////////////////////////////////////////////////






    ///add-on for case if running inside of backend-server.js
    if( beServer ) {

        ///here is how backend server knows how to generate response to db-request; request which comes from user's
        ///web-browser to backend(proxy)
        beServer.communLoopRegEx = /^\/database-backend-folder\//;

        beServer.communLoop = function( res, reqBody ) { 
            beapp.doCommunicationLoop( 
                { data : reqBody }, //req.body in "express.js server"
                function( result ) { res.end( result ); }
            );
        }


        ///http://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework
        beServer.setUserCookies = function( req, res, next )
        {
            beServer.setUserCookies_withExpress( req.cookies, res, next )
            next();
        };

        ///used with express.js
        beServer.setUserCookies_withExpress = function( existingCookiesList, res )
        {
            var euser = emu.user;
            Object.keys( euser ).forEach( function( key ) {
                var prop = euser[ key ];
                var cookie = existingCookiesList[ key ];
                if( typeof cookie === 'undefined' )
                {
                    //ccc( 'setting cookie ' + key + ' ... ' );
                    res.cookie( key, prop, { maxAge: 900000, httpOnly: false }); //TODM study this
                }
            });
        };


        ///no dependency on express.js
        beServer.setUserCookiesSimple = function( existingCookiesList, res, cookieObj )
        {
            var euser = emu.user;
            Object.keys( euser ).forEach( function( key ) {
                var prop = euser[ key ];
                var cookie = existingCookiesList[ key ];
                if( typeof cookie === 'undefined' )
                {
                    //ccc( 'setting cookie ' + key + ' ... ' );
                    var newCookie = cookieObj.serialize( 
                        key,
                        prop,
                        {
                          httpOnly: false,
                          maxAge: 60 * 60 * 24 * 7 // 1 week 
                        }
                    );
                    res.headers[ 'Set-Cookie' ] = res.headers[ 'Set-Cookie' ] || [];
                    res.headers[ 'Set-Cookie' ].push( newCookie );
                    //res.setHeader( 'Set-Cookie', newCookie ); //seems wrong
                }
            });
            ccc( res.headers[ 'Set-Cookie' ] );
        };
        beServer.handleUserCommands = function( key ) { handleUserCommands( key ); };
    }


    function handleUserCommands( key )
    {
        var em = beapp.emu;
        switch( key )
        {
            case '>': em.requests_limit = em.requests_limit < 1 ? 1 : em.requests_limit + 1;
                      //ccc( 'adding responses = ' + em.requests_limit );
            break;
        }
    };
    //ccc( 'emu done' );
    return self;
});

