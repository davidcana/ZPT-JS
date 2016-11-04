Zenon Page Templates - JS (ZPT-JS) is a Javascript implementation of Zope Page Templates (ZPT). Take a look at [Zope2 book](http://docs.zope.org/zope2/zope2book/ZPT.html) to learn about Zope Page Templates.

Zenon Page Templates - JS is a Javascript API that makes it easy to modify the DOM of a HTML document with no Javascript programming, using only some custom attributes.

*   Easy to learn; clean, simple and consistent syntax.
*   A rich and powerful group of expressions available (string, Jquery, logical, math, arrays, lists, ranges, function, method expressions...).
*   Don't break HTML! The HTML documents using ZPT-JS are valid HTML documents.
*   Makes it easy to designers maintain pages without having to abandon their tools.
*   Internal macro support; external asynchronous macro loading support.
*   I18n and L10n support using standards ([Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) and [ICU](http://userguide.icu-project.org/formatparse/messages)).

There are some important differences between ZPT-JS and ZPT.

Using ZPT we have:
*   the ZPT template (a HTML file with the ZPT tags inside)
*   the data
*   the final HTML file (the ZPT template combined with the data)

Using ZPT-JS:
*   the ZPT template (a HTML file with the ZPT tags inside)
*   the data
*   the final HTML file is the ZPT template! The DOM of the HTML page is modified depending on the tags in the ZPT template.
    
A main goal of ZPT-JS is not to break a valid HTML document. So, as HTML5 allows, instead of using TAL attributes ZPT-JS uses data attributes. This way `tal:content` attribute is replaced by `data-tcontent`.

An example of ZPT-JS template:

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Some ZPT-JS examples</title>

            <script src="https://code.jquery.com/jquery-2.0.3.js"></script>
            <script src="../dist/zpt.js"></script>
            <script>

    $(function () {
        "use strict";

        var dictionary = { 
            aString: "string",
            number1: 1,
            number100: 100,
            user: {
                name: "Bob", 
                age: function( ){
                    return 25;
                }
            },
            items: [ 'item0', 'item1', 'item2' ],
            tools: [ 
                {name: "tool A", rent_url: "rent?id=1000"}, 
                {name: "tool B", rent_url: "rent?id=1002"}, 
                {name: "tool C", rent_url: "rent?id=1004"},
                {name: "tool D", rent_url: "rent?id=1006"}
            ]
        };

        ZPT.run({
            root: document.body,
            dictionary: dictionary
        });
    });

            </script>
        </head>
        <body>
            <h1>Some expressions</h1>
            <ol>
                <li data-tcontent="user/name">a name</li>
                <li data-tcontent="string:help my ${user/name}">message with the same name</li>
                <li>
                    <a data-tattributes="href string:www.yoursite.org;
                                         title 'a title for your site'">A link</a>
                </li>
                <li data-tcondition="eq: number1 number100">
                    change number1 or number100 to show this!
                </li>
                <li>
                    <span data-treplace="user/name | string:no friends">
                        any friends?
                    </span>
                </li>
                <li data-tcontent="user2/name | string:no friends">
                    any friends?
                </li>
                <li data-tcontent="items[0]">an item</li>
                <li data-tcontent="user/age()">user/age()</li>
            </ol>
            
            <h1>Loops</h1>
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
                <tr data-trepeat="item tools">
                    <td class="value" data-tcontent="item/name">value</td>
                    <td class="index" data-tcontent="repeat/item/index()">index</td>
                    <td class="number" data-tcontent="repeat/item/number()">number</td>
                    <td class="isEven" data-tcontent="repeat/item/even()">even</td>
                    <td class="isOdd" data-tcontent="repeat/item/odd()">odd</td>
                    <td class="isStart" data-tcontent="repeat/item/start()">start</td>
                    <td class="isEnd" data-tcontent="repeat/item/end()">end</td>
                    <td class="getLength" data-tcontent="repeat/item/length()">length</td>
                    <td class="getLetter" data-tcontent="repeat/item/letter()">letter</td>
                    <td class="getCapitalLetter" data-tcontent="repeat/item/Letter()">capital letter</td>
                    <td class="getRoman" data-tcontent="repeat/item/roman()">roman</td>
                    <td class="getCapitalRoman" data-tcontent="repeat/item/Roman()">capitalRoman</td>
                </tr>
            </table>
            
            <h1>Macros</h1>
            
            <h2>Macro invokation - Dynamic macro using 1 slot (items = [10 20 30])</h2>
            <div data-tdefine="items [10 20 30]" data-muse-macro="dynamicListWith1Slot">
                <em data-mfill-slot="additional_info">
                    Make sure to check out our <a href="/specials">specials</a>.
                </em>
            </div>
            
            <h2>Macro definition - Dynamic macro using 1 slot</h2>
            <ul data-mdefine-macro="dynamicListWith1Slot">
                <li data-trepeat="item items">
                    <span data-tcontent="item">An item</span>
                </li>
                <li>
                    <span data-mdefine-slot="additional_info"></span>
                </li>
            </ul>
        </body>
    </html>

Please, take a look to [the ZPT-JS wiki](https://github.com/davidcana/ZPT-JS/wiki) for more information about ZPT-JS.
