/*
    PropertyExpression class
*/

export const PropertyExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope, parent ){
        return parent[ name ];
    };
    
    var dependsOn = function( parent ){
        return '.' + name;
    };
    
    var toString = function(){
        return name;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

PropertyExpression.build = function( string ) {
    return new PropertyExpression( string );
};

