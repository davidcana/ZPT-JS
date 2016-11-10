/* */
"use strict";

var dictionary = { 
    aString: "string",
    doggy: false,
    number1: 1,
    number100: 100,
    user: {
        name: "Bob", 
        age: function( ){
            return 25;
        }
    },
    items: [ 'item0', 'item1', 'item2' ]
};

zpt.run({
    root: document.body,
    dictionary: dictionary
});
