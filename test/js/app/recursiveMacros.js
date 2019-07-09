/* jshint esversion: 6 */
"use strict";

var $ = require('jquery');
var Qunit = require('qunit');
var zpt = require('../../../js/app/main.js');
var utils = require('./utils.js');

var dictionary = {
    items: [
        'item0',
        'item1',
        {
            type: 'list',
            id: 'item2',
            items: ['item21', 'item22']
        },
        'item3'
    ]
};

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary,
    //indexExpressions: false
});

// Run tests
QUnit.test("Simple macros test", function (assert) {

    var t1 = `
<div data-use-macro="'list'" data-id="1" style="display: none;">
    First macro call here
</div>
<ul data-mmacro="list" data-related-id="1" data-qdup="1">
    <li data-define="isList (eq: 'list' item/type)" data-repeat="item items" data-id="2" style="display: none;">
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
    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="3" data-related-id="2" data-tauto-define="item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,4,0)">
        <div data-condition="isList" data-id="4" style="display: none;">
            <span data-content="item/id">An item</span>
            <div data-define="items item/items">
                <div data-use-macro="'list'">
                    Nested macro call here
                </div>
            </div>
        </div>
        <div data-condition="not: isList" data-content="item" data-id="5">item0</div>
    </li>
    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="6" data-related-id="2" data-tauto-define="item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,4,0)">
        <div data-condition="isList" data-id="7" style="display: none;">
            <span data-content="item/id">An item</span>
            <div data-define="items item/items">
                <div data-use-macro="'list'">
                    Nested macro call here
                </div>
            </div>
        </div>
        <div data-condition="not: isList" data-content="item" data-id="8">item1</div>
    </li>
    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="9" data-related-id="2" data-tauto-define="item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,4,0)">
        <div data-condition="isList" data-id="10">
            <span data-content="item/id" data-id="11">item2</span>
            <div data-define="items item/items" data-id="12">
                <div data-use-macro="'list'" data-id="13" style="display: none;">
                    Nested macro call here
                </div>
                <ul data-mmacro="list" data-related-id="13" data-qdup="1">
                    <li data-define="isList (eq: 'list' item/type)" data-repeat="item items" data-id="14" style="display: none;">
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
                    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="15" data-related-id="14" data-tauto-define="item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,2,0)">
                        <div data-condition="isList" data-id="16" style="display: none;">
                            <span data-content="item/id">An item</span>
                            <div data-define="items item/items">
                                <div data-use-macro="'list'">
                                    Nested macro call here
                                </div>
                            </div>
                        </div>
                        <div data-condition="not: isList" data-content="item" data-id="17">item21</div>
                    </li>
                    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="18" data-related-id="14" data-tauto-define="item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,2,0)">
                        <div data-condition="isList" data-id="19" style="display: none;">
                            <span data-content="item/id">An item</span>
                            <div data-define="items item/items">
                                <div data-use-macro="'list'">
                                    Nested macro call here
                                </div>
                            </div>
                        </div>
                        <div data-condition="not: isList" data-content="item" data-id="20">item22</div>
                    </li>
                </ul>
            </div>
        </div>
        <div data-condition="not: isList" data-content="item" data-id="21" style="display: none;">An item</div>
    </li>
    <li data-define="isList (eq: 'list' item/type)" data-qdup="1" data-id="22" data-related-id="2" data-tauto-define="item-index 3;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,4,0)">
        <div data-condition="isList" data-id="23" style="display: none;">
            <span data-content="item/id">An item</span>
            <div data-define="items item/items">
                <div data-use-macro="'list'">
                    Nested macro call here
                </div>
            </div>
        </div>
        <div data-condition="not: isList" data-content="item" data-id="24">item3</div>
    </li>
</ul>
    `;
    utils.assertHtml(assert, '#t1', t1);
});
