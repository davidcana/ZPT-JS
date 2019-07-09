/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var utils = require( './utils.js' );

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

zpt.run({
    command: 'preload',
    root: document.body,
    dictionary: dictionary,
    declaredRemotePageUrls: [ 'externalMacros-definitions2.html', 'externalMacros-definitions3.html' ],
    callback: function(){
        zpt.run();
        runTests();
    }
});

function runTests(){

QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
<b data-use-macro="'copyright-list1@externalMacros-definitions4.html'" data-id="1" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright-list1" data-tauto-define="_externalMacroUrl 'externalMacros-definitions4.html'" data-related-id="1" data-qdup="1">
    <b data-use-macro="'copyright2'" data-id="2" style="display: none;">
        Macro copyright2 goes here
    </b>
    <p data-mmacro="copyright2" data-related-id="2" data-qdup="1">
        Copyright 2 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
    <b data-use-macro="'copyright1'" data-id="3" style="display: none;">
        Macro copyright1 goes here
    </b>
    <p data-mmacro="copyright1" data-related-id="3" data-qdup="1">
        Copyright 1 2009, <em>Foo, Bar, and Associates</em> Inc.
    </p>
</p>
        `;
    utils.assertHtml( assert, '#t1', t1 );
    var t2 = `
<b data-use-macro="'copyright-list2@externalMacros-definitions4.html'" data-id="4" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright-list2" data-tauto-define="_externalMacroUrl 'externalMacros-definitions4.html'" data-related-id="4" data-qdup="1">
    <b data-use-macro="'copyright2'" data-id="5" style="display: none;">
        Macro copyright2 goes here
    </b><p data-mmacro="copyright2" data-related-id="5" data-qdup="1">
        Copyright 2 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
    <b data-use-macro="'copyright3'" data-id="6" style="display: none;">
        Macro copyright3 goes here
    </b>
    <p data-mmacro="copyright3" data-related-id="6" data-qdup="1">
        Copyright 3 2022, <em>Foo, Bar, and Associates</em> Inc. (remote)
    </p>
</p>
`;
    utils.assertHtml( assert, '#t2', t2 );
});

}
