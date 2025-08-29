/*
    IndirectionExpression class
*/

export const IndirectionExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope, parent ){
        return parent[ scope.get( name ) ];
    };
    
    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return '?' + name;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

IndirectionExpression.build = function( string ) {
    
    if ( string.charAt( 0 ) !== '?' ) {
        return undefined;
    }
    
    return new IndirectionExpression( string.substring( 1 ) );
};

//module.exports = IndirectionExpression;
