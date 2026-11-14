HTML is the structure and CSS is the look. **JavaScript** is behaviour: everything a page *does*. Every count-up, sortable table, period toggle and booking grid on a dashboard is JavaScript.

## Adding a script

JavaScript lives in its own file, loaded with a `script` tag. Put it at the end of the `body`, so the page's HTML exists before the script runs:

```html
    <script src="script.js"></script>
  </body>
```

## Talking to yourself

`console.log()` prints a message to the **console**, a log developers use to see what their code is doing. In this app the console shows up in the **Terminal** panel under the editor.

```js
console.log('Hello');      // text goes in quotes
console.log(4400 + 7700);  // numbers don't, and JavaScript does the maths
```

Text in quotes is called a **string**. Without quotes, JavaScript treats words as code and gets confused.

## Your turn

1. In **index.html**, add `<script src="script.js"></script>` just before `</body>`.
2. In **script.js**, log a greeting of your own. Any sentence will do.
3. Log the total of Larkfield's three yearly fees: `4400 + 7700 + 13200`. Let JavaScript do the sum.
4. Look in the Terminal panel. You should see both lines.

> In real Chrome, press F12 and open the **Console** tab to see the same log on any website. Try it on any site you like.
