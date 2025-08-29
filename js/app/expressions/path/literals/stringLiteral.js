/*
    StringLiteral class
*/

export const StringLiteral = function( literalToApply ) {

    var literal = literalToApply;
    
    var evaluate = function( scope ){
        return literal;
    };
    
    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return literal;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

StringLiteral.build = function( string ) {
    
    if ( string.charAt( 0 ) === "'" && string.charAt( string.length - 1 ) ===  "'" ) {
        return new StringLiteral( 
            string.substring( 1, string.length - 1 ) );
    }

    return undefined;
};

//module.exports = StringLiteral;
