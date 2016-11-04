/*
    run function
    External dependencies: None
*/
var ZPT = ZPT || {};

ZPT.run = function( options ){
    "use strict";
    
    var parser =  new ZPT.Parser( options );
    parser.run();
};

/* Support RequireJS module pattern */
if ( typeof define == "function" && define.amd ) {
    define( "ZPT.run", function() {
        return ZPT.run;
    });
}
