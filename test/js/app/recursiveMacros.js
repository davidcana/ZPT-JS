/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );

var dictionary = { 
    items: [ 
        'item0', 
        'item1', 
        {
            type: 'list',
            id: 'item2',
            items: [ 'item21', 'item22' ]
        },
        'item3'
    ],
    viewItems: [
        {
            type: 'fieldContainer',
            title: 'Container title',
            description: 'Container description',
            fields: [
                {
                    id: 'id'
                },
                {
                    id: 'name'
                },
                {
                    id: 'name2'
                }
            ]
        }
    ],
    record: {
        id: 'The id',
        name: 'The name'
    }
};

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests
QUnit.test( "Simple macros test", function( assert ) {
    
    var t1 = `
<div data-use-macro="'list'" style="display: none;">
    First macro call here
</div>
<ul data-mmacro="list">
	<li data-define="isList (eq: 'list' item/type)" data-repeat="item items" style="display: none;">
		<div data-condition="isList">
		    <span data-content="item/id">An item</span>
		    <div data-define="items item/items">
		        <div data-use-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-condition="not: isList" data-content="item">An item</div>
	</li>
	<li data-define="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-condition="isList" style="display: none;">
		    <span data-content="item/id">An item</span>
		    <div data-define="items item/items">
		        <div data-use-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-condition="not: isList" data-content="item">item0</div>
	</li>
	<li data-define="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-condition="isList" style="display: none;">
		    <span data-content="item/id">An item</span>
		    <div data-define="items item/items">
		        <div data-use-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-condition="not: isList" data-content="item">item1</div>
	</li>
	<li data-define="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-condition="isList">
		    <span data-content="item/id">item2</span>
		    <div data-define="items item/items">
		        <div data-use-macro="'list'" style="display: none;">
		            Nested macro call here
		        </div>
				<ul data-mmacro="list">
					<li data-define="isList (eq: 'list' item/type)" data-repeat="item items" style="display: none;">
						<div data-condition="isList">
							<span data-content="item/id">An item</span>
							<div data-define="items item/items">
								<div data-use-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-condition="not: isList" data-content="item">An item</div>
					</li>
					<li data-define="isList (eq: 'list' item/type)" data-qdup="1">
						<div data-condition="isList" style="display: none;">
							<span data-content="item/id">An item</span>
							<div data-define="items item/items">
								<div data-use-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-condition="not: isList" data-content="item">item21</div>
					</li>
					<li data-define="isList (eq: 'list' item/type)" data-qdup="1">
		
						<div data-condition="isList" style="display: none;">
							<span data-content="item/id">An item</span>
							<div data-define="items item/items">
								<div data-use-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-condition="not: isList" data-content="item">item22</div>
					</li>
				</ul>
			</div>
		</div>
		<div data-condition="not: isList" data-content="item" style="display: none;">An item</div>
	</li>
	<li data-define="isList (eq: 'list' item/type)" data-qdup="1">		
		<div data-condition="isList" style="display: none;">
		    <span data-content="item/id">An item</span>
		    <div data-define="items item/items">
		        <div data-use-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-condition="not: isList" data-content="item">item3</div>
	</li>
</ul>
    `;
    assertHtml( assert, '#t1', t1 );
});



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
