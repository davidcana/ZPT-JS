"use strict";

var zpt = require( '../../../js/app/main.js' );
var QUnit = require( 'qunit' );
var utils = require( './utils.js' );

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    //alert( errorsArray );
};
zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "Insert object nested element by index TALRepeat test", function( assert ) {

    var testNumber = 1;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber,
            action: 'createArray',
            index: '_first_',
            newElement: {
                id: 'object3',
                items: [
                    {
                        name: 'Helen',
                        description: 'The number 7'
                    }, 
                    {
                        name: 'Sara',
                        description: 'The number 8'
                    },
                    {
                        name: 'Alice',
                        description: 'The number 9'
                    }
                ]
            },
            animation: 'textColorChange 2s 3'
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'Helen/Sara/Alice/John/Peter/Luke/Michael/Chris/Lars', 'The number 7/The number 8/The number 9/The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
});

QUnit.test( "Insert item nested element by index TALRepeat test", function( assert ) {

    var testNumber = 2;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    id: 'object2'
                },
                'items'
            ],
            action: 'createArray',
            index: '_first_',
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            },
            animation: 'textColorChange 2s 3'
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Dave/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 7/The number 4/The number 5/The number 6' );
});

QUnit.test( "Update object nested element by index TALRepeat test", function( assert ) {

    var testNumber = 3;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber,
            action: 'updateArray',
            currentElement: {
                id: 'object2'
            },
            newElement: {
                id: 'object3',
                items: [
                    {
                        name: 'Helen',
                        description: 'The number 7'
                    }, 
                    {
                        name: 'Sara',
                        description: 'The number 8'
                    },
                    {
                        name: 'Alice',
                        description: 'The number 9'
                    }
                ]
            },
            animation: 'textColorChange 2s 3'
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Helen/Sara/Alice', 'The number 1/The number 2/The number 3/The number 7/The number 8/The number 9' );
});

QUnit.test( "Update item nested element by index TALRepeat test", function( assert ) {

    var testNumber = 4;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    id: 'object1'
                },
                'items'
            ],
            action: 'updateArray',
            currentElement: {
                name: 'Luke'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            },
            animation: 'textColorChange 2s 3'
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Dave/Michael/Chris/Lars', 'The number 1/The number 2/The number 7/The number 4/The number 5/The number 6' );
});

QUnit.test( "Delete object nested element by index TALRepeat test", function( assert ) {

    var testNumber = 5;
    var done = assert.async();
    
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ] );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    zpt.run({
        command: 'update',
        dictionaryActions: [
            {
                id: 'objectList' + testNumber,
                action: 'deleteArray',
                currentElement: {
                    id: 'object1'
                },
                animation: 'textColorChange 1s 3',
                animationCallback: function(){
                    testFunction( 'Michael/Chris/Lars', 'The number 4/The number 5/The number 6' );
                    done();
                }
            }
        ]
    });
});

QUnit.test( "Delete item nested element by index TALRepeat test", function( assert ) {

    var testNumber = 6;
    var done = assert.async();
    
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    zpt.run({
        command: 'update',
        dictionaryActions: [
            {
                search: [
                    'objectList' + testNumber,
                    {
                        id: 'object1'
                    },
                    'items'
                ],
                action: 'deleteArray',
                currentElement: {
                    name: 'Luke'
                },
                animation: 'textColorChange 1s 3',
                animationCallback: function(){
                    testFunction( 'John/Peter/Michael/Chris/Lars', 'The number 1/The number 2/The number 4/The number 5/The number 6' );
                    done();
                }
            }
        ]
    });
});
