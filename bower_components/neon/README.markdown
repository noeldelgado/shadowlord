# Neon

## JavaScript DSL for Classical Inheritance

This files provides a DSL for the following design patterns: 

* inheritance
* interface
* module

Neon packs a DSL for Class creation, that helps in making programs following an object oriented design.

The philosophy is that it should not try to emulate other languages, so it preserves the JavaScript good parts,
but with a nicer syntax to create classes that ensure interfaces and include reusable functionality as modules.

## Why another Class System?

As the web applications are getting more complex these times, backend and frontend engineers work has fusioned, and they need to be able to establish a common language. It was created for people coming from OOP languages like Ruby to Javascript.

### Usage

    Interface('Editable')({
        constructor : ['x'],
        prototype   : ['x']
    });

    Module('Composition')({
        y : 5,
        prototype : {
            z : 3
        }
    });

    Module('Other')({
        a : 5,
        prototype : {
            b : 3
        }
    });

    Class('Overlay').inherits(Widget).ensures(Editable).includes(Composition, Other)({
        html : '<div></div>',
        prototype : {
            init : function (element){
                if(!element){
                    element = document.createElement('div');
                    element.innerHTML = 'hello';
                    document.body.appendChild(element);
                }
            },
            b : 5
        }
    });

## License

Copyright (c) 2009 Fernando Trasviña

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
