/* 
    Class ObjectUpdate
*/
//var AbstractObjectAction = require( './abstractObjectAction.js' );
//var ObjectDelete = require( './objectDelete.js' );
//var utils = require( '../../utils.js' );
import { AbstractObjectAction } from './abstractObjectAction.js';
import { ObjectDelete } from './objectDelete.js';
import { utils } from '../../utils.js';

export const ObjectUpdate = function( object, dictionary ) {
    AbstractObjectAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ObjectUpdate.prototype = Object.create( AbstractObjectAction.prototype );

ObjectUpdate.prototype.updateDictionary = function( dictionary ){
    
    var objectValue = this.getValue( dictionary );
    objectValue[ this.property ] = this.newElement;
};

ObjectUpdate.buildMultiple = function( object, dictionary ){

    var actions = [];
    var clonedObject = utils.deepExtend( object );
    
    // Copy editedProperties and deletedProperties
    var editedProperties = clonedObject.editedProperties;
    var deletedProperties = clonedObject.deletedProperties;
    
    // Delete them
    delete clonedObject.editedProperties;
    delete clonedObject.deletedProperties;
        
    // Build actions list for editedProperties
    if ( editedProperties ){
        clonedObject.action = 'updateObject';
        for ( var editedPropertiesId in editedProperties ){
            var editedPropertiesValue = editedProperties[ editedPropertiesId ];

            // Clone the object and configure property and newElement
            var newObject = utils.deepExtend( clonedObject );
            newObject.property = editedPropertiesId;
            newObject.newElement = editedPropertiesValue;

            // Instance the action instance and add it to the list
            var newActionInstance = new ObjectUpdate( newObject, dictionary );
            actions.push( newActionInstance );
        }
    }
    
    // Build actions list for deletedProperties
    if ( deletedProperties ){
        clonedObject.action = 'deleteObject';
        for ( var i = 0; i < deletedProperties.length; ++i ){
            var deletedPropertiesItem = deletedProperties[ i ];

            // Clone the object and configure property
            newObject = utils.deepExtend( clonedObject );
            newObject.property = deletedPropertiesItem;

            // Instance the action instance and add it to the list
            newActionInstance = new ObjectDelete( newObject, dictionary );
            actions.push( newActionInstance );
        }
    }
    
    return actions;
};

//module.exports = ObjectUpdate;
