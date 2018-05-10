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
<div data-muse-macro="'list'" style="display: none;">
    First macro call here
</div>
<ul data-mmacro="list">
	<li data-tdefine="isList (eq: 'list' item/type)" data-trepeat="item items" style="display: none;">
		<div data-tcondition="isList">
		    <span data-tcontent="item/id">An item</span>
		    <div data-tdefine="items item/items">
		        <div data-muse-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-tcondition="not: isList" data-tcontent="item">An item</div>
	</li>
	<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-tcondition="isList" style="display: none;">
		    <span data-tcontent="item/id">An item</span>
		    <div data-tdefine="items item/items">
		        <div data-muse-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-tcondition="not: isList" data-tcontent="item">item0</div>
	</li>
	<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-tcondition="isList" style="display: none;">
		    <span data-tcontent="item/id">An item</span>
		    <div data-tdefine="items item/items">
		        <div data-muse-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-tcondition="not: isList" data-tcontent="item">item1</div>
	</li>
	<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">
		<div data-tcondition="isList">
		    <span data-tcontent="item/id">item2</span>
		    <div data-tdefine="items item/items">
		        <div data-muse-macro="'list'" style="display: none;">
		            Nested macro call here
		        </div>
				<ul data-mmacro="list">
					<li data-tdefine="isList (eq: 'list' item/type)" data-trepeat="item items" style="display: none;">
						<div data-tcondition="isList">
							<span data-tcontent="item/id">An item</span>
							<div data-tdefine="items item/items">
								<div data-muse-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-tcondition="not: isList" data-tcontent="item">An item</div>
					</li>
					<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">
						<div data-tcondition="isList" style="display: none;">
							<span data-tcontent="item/id">An item</span>
							<div data-tdefine="items item/items">
								<div data-muse-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-tcondition="not: isList" data-tcontent="item">item21</div>
					</li>
					<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">
		
						<div data-tcondition="isList" style="display: none;">
							<span data-tcontent="item/id">An item</span>
							<div data-tdefine="items item/items">
								<div data-muse-macro="'list'">
									Nested macro call here
								</div>
							</div>
						</div>
						<div data-tcondition="not: isList" data-tcontent="item">item22</div>
					</li>
				</ul>
			</div>
		</div>
		<div data-tcondition="not: isList" data-tcontent="item" style="display: none;">An item</div>
	</li>
	<li data-tdefine="isList (eq: 'list' item/type)" data-qdup="1">		
		<div data-tcondition="isList" style="display: none;">
		    <span data-tcontent="item/id">An item</span>
		    <div data-tdefine="items item/items">
		        <div data-muse-macro="'list'">
		            Nested macro call here
		        </div>
		    </div>
		</div>
		<div data-tcondition="not: isList" data-tcontent="item">item3</div>
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
