/* 
    Class ObjectDelete
*/
//var AbstractObjectAction = require( './abstractObjectAction.js' );
import { AbstractObjectAction } from './abstractObjectAction.js';

export const ObjectDelete = function( object, dictionary ) {
    AbstractObjectAction.call( this, object, dictionary );
};

ObjectDelete.prototype = Object.create( AbstractObjectAction.prototype );

ObjectDelete.prototype.updateDictionary = function( dictionary ){
    
    var objectValue = this.getValue( dictionary );
    delete objectValue[ this.property ];
};

//module.exports = ObjectDelete;
