# ZPT-JS

**Zenon Page Templates - JS (ZPT-JS)** is a Javascript API that makes it easy to modify the DOM of a HTML document with no Javascript programming, using only some custom attributes. **ZPT-JS** is a javascript implementation of Zope Page Templates (ZPT). It is not a fully compliant implementation: there are some differences. Take a look at [Zope2 book](http://docs.zope.org/zope2/zope2book/ZPT.html) to learn about Zope Page Templates.

Core features of **ZPT-JS** are:

*   Easy to learn; clean, simple and consistent syntax.
*   A rich and powerful group of expressions available (string, query, logical, math, arrays, lists, ranges, function, method expressions...).
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

A main goal of ZPT-JS is not to break a valid HTML document. So, as HTML5 allows, instead of using TAL attributes ZPT-JS uses data attributes. This way `tal:content` attribute is replaced by `data-content`. However, ZPT-JS also supports standard TAL attributes (invoking `zpt.context.useOriginalTags()`).

## Installation

**ZPT-JS** is registered as a package on [npm](https://www.npmjs.com/package/zpt). This is the recomended way of downloading it. You can install the latest version of ZPT-JS and its dependencies with the npm CLI command:

```bash
npm install zpt
```

## Usage

A sample of template:

*gettingStarted.html*

```html
    <!DOCTYPE html>
    <html> 
        <head>
            <meta charset="utf-8">
            <title>Getting started</title>

            <script src="zpt.min.js" defer></script>
            <script src="gettingStarted.js" type="text/javascript" defer></script>
        </head>
        <body>
            <p data-content="message">
                the message
            </p>
        </body>
    </html>
```
Where **zpt.min.js** is the minimized version of ZPT-JS and **gettingStarted.js** is:

*gettingStarted.js*

```javascript
    "use strict";

    var dictionary = new zpt.ReactiveDictionary({
        message: "Hello, world!"
    });

    zpt.run({
        root: document.body,
        dictionary: dictionary
    });
```

The resulting **body** element is:

```html
    <body>
        <p data-content="message">
            Hello, world!
        </p>
    </body>
```

If we change some data in the dictionary this way:

```javascript
    dictionary.message = "Bye, world!";
```

We don't need to do anything else, the **body** element now is:

```html
    <body>
        <p data-content="message">
            Bye, world!
        </p>
    </body>
```

Please, take a look at [the ZPT-JS web](https://davidcana.github.io/ZPT-JS) for more information about ZPT-JS.

## License
[LGPL](http://www.gnu.org/licenses/lgpl.html)
