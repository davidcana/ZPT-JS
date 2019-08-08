# ZPT-JS

**Zenon Page Templates - JS (ZPT-JS)** is a Javascript API that makes it easy to modify the DOM of a HTML document with no Javascript programming, using only some custom attributes. **ZPT-JS** is a javascript implementation of Zope Page Templates (ZPT). It is not a fully compliant implementation: there are some differences. Take a look at [Zope2 book](http://docs.zope.org/zope2/zope2book/ZPT.html) to learn about Zope Page Templates.

Core features of **ZPT-JS** are:

*   Easy to learn; clean, simple and consistent syntax.
*   A rich and powerful group of expressions available (string, Jquery, logical, math, arrays, lists, ranges, function, method expressions...).
*   Don't break HTML! The HTML documents using ZPT-JS are valid HTML documents.
*   Makes it easy to designers maintain pages without having to abandon their tools.
*   Internal macro support; external asynchronous macro loading support.
*   I18n and L10n support using standards ([Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) and [ICU](http://userguide.icu-project.org/formatparse/messages)). External asynchronous i18n files loading support.

## ZPT-JS and ZPT: similar but not equal

ZPT-JS is based on ZPT but it does not implement it at 100%: there are some important differences between ZPT-JS and ZPT.

Using ZPT we have:

*   the ZPT template (a HTML file with the ZPT tags inside)
*   the data
*   the final HTML file (the ZPT template combined with the data)

Using ZPT-JS:

*   the ZPT template (a HTML file with the ZPT tags inside)
*   the data
*   the final HTML file is the ZPT template! The DOM of the HTML page is modified depending on the tags in the ZPT template.

A main goal of ZPT-JS is not to break a valid HTML document. So, as HTML5 allows, instead of using TAL attributes ZPT-JS uses data attributes. This way `tal:content` attribute is replaced by `data-content`. However, ZPT-JS also supports standard TAL attributes (setting a configuration option).

## Installation

**ZPT-JS** is registered as a package on [npm](https://www.npmjs.com/package/zpt). This is the recomended way of downloading it. You can install the latest version of ZPT-JS and its dependencies with the npm CLI command:

```bash
npm install zpt
```

## Usage

An example of ZPT-JS template:

*sample.js*
```javascript
    "use strict";

    var zpt = require( 'zpt' );

    var dictionary = { 
        number1: 1,
        number100: 100,
        user: {
            name: "Bob", 
            age: function( ){
                return 25;
            }
        },
        user2: {
            name: "Mary", 
            age: function( ){
                return 29;
            }
        },
        tools: [ 'tool0', 'tool1', 'tool2' ]
    };

    zpt.run({
        root: document.body,
        dictionary: dictionary
    });
```

*sample.html*
```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Some ZPT-JS examples</title>

            <script src="zpt.js"></script>
        </head>
        <body>
            <h1>Some ZPT-JS examples</h1>
    
            <h2>Some expressions</h2>
            <ol>
                <li data-content="user/name">a property expresion</li>
                <li data-content="string:help my ${user/name}">a string expression</li>
                <li>
                    <a data-attributes="href 'www.yoursite.org';
                                         title 'a title for your site'">A link using string literals in a data-attributes</a>
                </li>
                <li data-condition="eq: number1 number100">
                    a condition: change number1 or number100 to show this!
                </li>
                <li>
                    <span data-replace="user/name | 'no friends'">
                        any friends?
                    </span>
                </li>
                <li data-content="user2/name | 'no friends'">
                    any friends?
                </li>
                <li data-content="tools[0]">an item of an array</li>
                <li data-content="user/age()">a method invokation</li>
            </ol>
            
            <h2>Loops</h2>
            <table>
                <tr>
                    <th>Value</th>
                    <th>Index</th>
                    <th>Number</th>
                    <th>Even index</th>
                    <th>Odd index</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Length</th>
                    <th>Letter</th>
                    <th>Capital Letter</th>
                    <th>Roman</th>
                    <th>Capital Roman</th>
                </tr>
                <tr data-repeat="item tools">
                    <td data-content="item">the item</td>
                    <td data-content="item-repeat/index()">index</td>
                    <td data-content="item-repeat/number()">number</td>
                    <td data-content="item-repeat/even()">even</td>
                    <td data-content="item-repeat/odd()">odd</td>
                    <td data-content="item-repeat/start()">start</td>
                    <td data-content="item-repeat/end()">end</td>
                    <td data-content="item-repeat/length()">length</td>
                    <td data-content="item-repeat/letter()">letter</td>
                    <td data-content="item-repeat/Letter()">capital letter</td>
                    <td data-content="item-repeat/roman()">roman</td>
                    <td data-content="item-repeat/Roman()">capital roman</td>
                </tr>
            </table>
            
            <h2>Macros</h2>
            
            <h3>Macro invokation - Dynamic macro using 1 slot (items = [10 20 30])</h3>
            <div data-define="items [10 20 30]" data-use-macro="dynamicListWith1Slot">
                <em data-fill-slot="additional_info">
                    Make sure to check out our <a href="/specials">specials</a>.
                </em>
            </div>
            
            <h3>Macro definition - Dynamic macro using 1 slot</h3>
            <ul data-define-macro="dynamicListWith1Slot">
                <li data-repeat="item items">
                    <span data-content="item">An item</span>
                </li>
                <li>
                    <span data-define-slot="additional_info"></span>
                </li>
            </ul>
        </body>
    </html>
```

Please, take a look to [the ZPT-JS web](https://davidcana.github.io/ZPT-JS) for more information about ZPT-JS.

## License
[LGPL](http://www.gnu.org/licenses/lgpl.html)
