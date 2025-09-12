/*
    NumericLiteral class
*/

export const NumericLiteral = function( literalToApply ) {
    
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

NumericLiteral.build = function( string ) {
    
    if ( isFinite( string ) ){
        var integerValue = parseInt( string );
        if ( integerValue == string ){
            return new NumericLiteral( integerValue );
        }

        var floatValue = parseFloat( string );
        if ( floatValue == string ){
            return new NumericLiteral( floatValue );
        }
    }

    return undefined;
};

