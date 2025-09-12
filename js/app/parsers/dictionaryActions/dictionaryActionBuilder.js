/* 
    Class dictionaryActionBuilder 
*/

import { ArrayUpdate } from './arrayUpdate.js';
import { ArrayDelete } from './arrayDelete.js';
import { ArrayCreate } from './arrayCreate.js';
import { ObjectUpdate } from './objectUpdate.js';
import { ObjectDelete } from './objectDelete.js';

export const dictionaryActionBuilder = (function() {
    
    var build = function( object, dictionary ) {
        
        switch ( object.action ) {
        case 'updateArray':
            return new ArrayUpdate( object, dictionary );
        case 'deleteArray':
            return Array.isArray( object.index ) || Array.isArray( object.currentElement )? 
                ArrayDelete.buildMultiple( object, dictionary ):
                new ArrayDelete( object, dictionary );
        case 'createArray':
            return Array.isArray( object.newElement )? 
                ArrayCreate.buildMultiple( object, dictionary ):
                new ArrayCreate( object, dictionary );
        case 'updateObject':
            return object.editedProperties || object.deletedProperties?
                ObjectUpdate.buildMultiple( object, dictionary ):
                new ObjectUpdate( object, dictionary );
        case 'deleteObject':
            return new ObjectDelete( object, dictionary );
        default:
            throw 'Unknown dictionary action: ' + object.action;
        }
    };
    
    var self = {
        build: build
    };
    
    return self;
})();
