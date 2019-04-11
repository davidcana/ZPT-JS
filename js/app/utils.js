/*
    utils singleton class
*/
"use strict";

module.exports = (function() {
    
    var generateId = function ( len, _charSet ) {
        
        var charSet = _charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < len; i++ ) {
            var pos = Math.floor( Math.random() * charSet.length );
            result += charSet.substring( pos, pos + 1 );
        }
        return result;
    }
    
    return {
        generateId: generateId
    };
})();
