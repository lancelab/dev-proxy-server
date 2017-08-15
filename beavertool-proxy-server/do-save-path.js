
//Saving file to a path.
//Copyright (c) 2017 Konstantin Kirillov.
//License MIT.

//making a module: http://fredkschott.com/post/2014/06/require-and-the-module-system/

    var self = {};

    //https://nodejs.org/api/fs.html

    var fs = require( 'fs' );
    //test: fs.mkdirSync( 'moo' );

    ///synchronous function
    var makeDirPath = self.makeDirPath = function( path, index, prefix )
    {
        index = index || 0;
        prefix = ( prefix ? prefix + '/' : '') + path[ index ];
        if( !fs.existsSync( prefix ) ) {
            //c onsole.log( 'mkdirSync=' + prefix );
            fs.mkdirSync( prefix );
        //} else {
            //c onsole.log( 'this dir already exists: ' + prefix );
        }
        index++;
        if( index < path.length ) makeDirPath( path, index, prefix )
    } 

    //makeDirPath( 'oneB/two/three/four'.split( '/' ) );


    //mixed-synchronous/asynchronous function
    var saveFile = self.saveFile = function saveFile( path, text, encoding )
    {
        //c onsole.log( 'path=' + path );
        var pathAr = path.split( '/' );
        var len1 = pathAr.length - 1;
        var file = pathAr[ len1 ];
        pathAr.length = len1;

        if( len1 ) makeDirPath( pathAr );
        ///asynchronous
        if( encoding ) {
            fs.writeFile( path, text, encoding, function ( err ) {
                if( err ) return console.log( err );
                console.log( path + ' ...saved as ' + encoding ); //+ ' text=' + text );
            });
        } else {
            fs.writeFile( path, text, function ( err ) {
                if( err ) return console.log( err );
                console.log( path + ' ...saved' ); //+ ' text=' + text );
            });
        }
    }


    //test
    //saveFile( 'moo/boo/boo-file.txt', 'my text' );
    //saveFile( 'moo/moo-file.txt', 'my text' );

    module.exports = self;

