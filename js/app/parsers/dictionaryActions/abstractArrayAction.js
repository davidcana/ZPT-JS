/* 
    Class AbstractArrayAction
*/
var utils = require( '../../utils.js' );
//var evaluateHelper = require( '../../expressions/evaluateHelper.js' );

var AbstractArrayAction = function( object, dictionary ) {
    
    this.id = object.id;
    this.var = object.var;
    this.index = object.index;
    this.currentElement = object.currentElement;
    if ( object.search ){
        if ( this.id || this.var ){
            throw 'Error in array action: you can not set a search and then an id or var: if you set a search ZPT-JS will set the id and var for you!'
        }
        this.initializeUsingSearch( object.search, dictionary );
    }
};

AbstractArrayAction.prototype.initializeUsingSearch = function( search, dictionary ){

    this.id = '';
    this.var = dictionary;
    
    // Iterate search items and build id and var
    for ( var i = 0; i < search.length; ++i ){
        var item = search[ i ];
        
        if ( utils.isPlainObject( item ) ){
            item = this.search( this.var, item );
        }
        
        if ( Number.isInteger( item ) ){
            this.id += '[' + item + ']';
        } else {
            var separator = i === 0? '': '.';
            this.id += separator + item;
        }
        
        this.var = this.var[ item ];
    }
/*
            id: 'objectList[1].items',
            var: dictionary["objectList"][1]["items"],
            search: [
                'objectList',
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
*/
};

AbstractArrayAction.prototype.search = function( list, criteria ){

    for ( var i = 0; i < list.length; ++i ){
        var record = list[ i ];
        var thisRecordValue = record[ criteria.name ];
        if ( utils.deepEqual( thisRecordValue, criteria.value ) ){
            return i;
        }
    }
    
    throw 'No record found matching your criteria!'
};

AbstractArrayAction.prototype.getArrayValue = function( dictionary ){
    return this.var === undefined?
        dictionary[ this.id ]:
        this.var;
};

AbstractArrayAction.prototype.getIndexToUse = function( dictionary ){

    if ( this.index === undefined && this.currentElement === undefined ){
        throw 'index or currentElement must be defined in ' + this.id + ' array action!';
    }
    
    if ( this.index !== undefined ){
        if ( this.index == '_first_' ){
            return 0;
        } else if ( this.index == '_last_' ){
            return -1; // This means it is the last
        } else {
            return this.index;
        }
    }
    
    // Must use newElement
    var arrayValue = this.getArrayValue( dictionary );
    
    for ( var i = 0; i < arrayValue.length; ++i ){
        var element = arrayValue[ i ];
        //if ( element == this.currentElement ){
        if ( utils.deepEqual( element, this.currentElement ) ){
            return i;
        }
    }
    
    throw 'currentElement ' + this.currentElement + ' not found in ' + this.id + ' array action!';
};

AbstractArrayAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    return attributeInstance.type === 'tal:repeat';
};

AbstractArrayAction.prototype.updateDictionary = function(){
    throw 'Error: updateDictionary must be implemented!';
};

AbstractArrayAction.prototype.updateHTML = function(){
    throw 'Error: updateHTML must be implemented!';
};

AbstractArrayAction.prototype.resolveChildNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return this.indexToUse === -1?
        null:
        node.parentNode.children[ 1 + this.indexToUse ]; // The first is always the tal:repeat
};

AbstractArrayAction.prototype.resolveThisNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return node;
};

module.exports = AbstractArrayAction;
