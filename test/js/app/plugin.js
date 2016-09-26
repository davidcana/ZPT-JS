$(function () {
    "use strict";

    var dictionary = { 
        nullValue: null,
        aString: "string",
        yes: "yes",
        no: "no",
        doggy: false,
        number1: 1,
        otherNumber1: 1,
        number100: 100,
        user: {
            name: "Bob", 
            profile_url: "/profile?id=12345",
            age: function( ){
                return 25;
            },
            add1Method: function( a ){
                return a + 1;
            },
            addMethod: function( a, b ){
                return a + b;
            },
            fireError: function( ){
                //return 1 / 0;
                document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
            }
        }, 
        tools: [ 
            {name: "tool A", rent_url: "rent?id=1000"}, 
            {name: "tool B", rent_url: "rent?id=1002"}, 
            {name: "tool C", rent_url: "rent?id=1004"},
            {name: "tool D", rent_url: "rent?id=1006"}
        ], 
        rented: { 
            items: [
                {name: "Spanner", cost: 45, days: 3}
            ], 
            total_days: 3,
            total_cost: 45
        } ,
        items: [ 'item0', 'item1', 'item2' ],
        from1To3: [ 1, 2, 3 ],
        add: function( a, b ){
            return a + b;
        },
        function3: function( ){
            return 3;
        },
        divBy0: function( ){
            return 1 / 0;
        },
        someNumbers: [ 10, 20, 30, 40 ]
    };

    /* zpt.run( document.body, dictionary ); */
    /*
    $( 'body' ).zpt({
        dictionary: dictionary
    });*/
    $( '#search' ).zpt({
        dictionary: dictionary
    });
});
