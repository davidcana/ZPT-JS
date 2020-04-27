/* 
    Class AbstractArrayAction
*/
var AbstractArrayAction = function( object ) {
    
    this.id = object.id;
    this.index = object.index;
    this.currentElement = object.currentElement;
};

AbstractArrayAction.prototype.getArrayValue = function( dictionary ){
    return dictionary[ this.id ];
};

AbstractArrayAction.prototype.getIndexToUse = function( dictionary ){

    if ( this.index === undefined && this.currentElement === undefined ){
        throw 'index or currentElement must be defined in ' + this.id + ' array action!';
    }
    
    if ( this.index !== undefined ){
        if ( this.index == '_first_' ){
            return 0;
        } else if ( this.index == '_last_' ){
            return arrayValue.length;
        } else {
            return this.index;
        }
    }
    
    // Must use newElement
    var arrayValue = this.getArrayValue( dictionary );
    
    for ( var i = 0; i < arrayValue.length; ++i ){
        var element = arrayValue[ i ];
        if ( element == this.currentElement ){
            return i;
        }
    }
    
    throw 'currentElement ' + this.currentElement + ' not found in ' + this.id + ' array action!';
};

AbstractArrayAction.prototype.updateDictionary = function( dictionary ){
    throw 'Error: updateDictionary must be implemented!';
};

module.exports = AbstractArrayAction;
