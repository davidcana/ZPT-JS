"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );

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
    }
};
var zptParser = zpt.buildParser({
    root: document.body,
    dictionary: dictionary,
    declaredRemotePageUrls: [ 'externalMacros-definitions2.html', 'externalMacros-definitions3.html' ]
});

zptParser.init(
    function(){
        zptParser.run();
        runTests();
    }
);

function runTests(){

QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
<b data-muse-macro="'copyright-list@externalMacros-definitions4.html'" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright-list" data-tdefine="externalMacroUrl 'externalMacros-definitions4.html'">
    <b data-muse-macro="'copyright2'" style="display: none;">
        Macro copyright2 goes here
    </b>
    <p data-mmacro="copyright2">
Copyright 2 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
    <b data-muse-macro="'copyright1'" style="display: none;">
        Macro copyright1 goes here
    </b>
    <p data-mmacro="copyright1">
        Copyright 1 2009, <em>Foo, Bar, and Associates</em> Inc.
    </p>
</p>
        `;
    assertHtml( assert, '#t1', t1 );
    var t2 = `
<b data-muse-macro="'copyright-list2@externalMacros-definitions4.html'" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright-list2" data-tdefine="externalMacroUrl 'externalMacros-definitions4.html'">
    <b data-muse-macro="'copyright2'" style="display: none;">
        Macro copyright2 goes here
    </b>
    <p data-mmacro="copyright2">
        Copyright 2 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
    <b data-muse-macro="'copyright3'" style="display: none;">
        Macro copyright3 goes here
    </b>
    <p data-mmacro="copyright3">
        Copyright 3 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
</p>
`;
    assertHtml( assert, '#t2', t2 );
});

}

function getValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}

function assertHtml( assert, id1, id2 ){
    assert.equal( 
        $( id1 ).text().replace(/\s+/g, ""), 
        $( id2 ).text().replace(/\s+/g, ""), 
        "Passed!" ); 
}
