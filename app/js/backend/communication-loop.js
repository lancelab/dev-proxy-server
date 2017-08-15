define( function()
{
        if( typeof global === 'undefined' ) {
            var glo = window;
        } else {
            var glo = global;
        }

        var beapp  = glo.beapp = glo.beapp || {};
        var beapp   = glo.beapp = glo.beapp || {};
        var queues;
        var backend;

        function ob2str( ob ) { return JSON.stringify( ob, null, "\t" ); };

        beapp.doCommunicationLoop = function( xhrArgs, successWrap )
        {
            var conf = glo.sharapp.conf;
            var emu = beapp.emu;

            if( emu.requests_limit-- < 1 ) {
                successWrap( '{ "type":"done" }' );
                return;
            }

            var sentData = xhrArgs.data;
            var action   = sentData.action;
            var json     = JSON.parse( sentData.json );

            switch( action )
            {
                case 'moomoo':
                    break;
                default :
                    return;
            }
            ///tracer for backend server console
            if( glo.beapp.beServer && respob.length && respob.type !== 'done' ) {
                var type = respob.length ? respob[ 0 ].type : respob.type;
                type = type || respob;
                ccc( 'sending: ', type );
            }
            successWrap( JSON.stringify( respob, null, "\t" ) );
        };
});

