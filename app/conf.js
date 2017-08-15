
define( function() {
    ///nodejs-server vs browser
    if( typeof global === 'undefined' ) {
        var glo = window;
    } else {
        var glo = global;
    }

    ///this is a configuration which can be shared between app-in-development and back-end-emulator
    var conf = {
        hey_i_am_a_base_application_config : "hey"
     };

    var sharapp = glo.sharapp = glo.sharapp || {};  //app shared between applications
    sharapp.conf = conf;
    return conf;
});
