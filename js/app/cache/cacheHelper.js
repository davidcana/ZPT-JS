/*
    cacheHelper singleton class
*/
module.exports = (function() {
    "use strict";
    
    var hashCode = function( string ) {

        if ( Array.prototype.reduce ) {
            return string.split( "" ).reduce(
                function( a, b ){
                    a = ( ( a << 5 ) - a ) + b.charCodeAt( 0 );
                    return a&a
                },
                0 );
        }

        var hash = 0;
        if ( string.length === 0 ){
            return hash;
        }
        for ( var i = 0, len = string.length; i < len; i++ ) {
            var chr = string.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        
        return hash;
    };
    
    return {
        hashCode: hashCode
    };
})();
