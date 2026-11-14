Dashboards don't hard-code their numbers. They ask a server for data, and the server answers in **JSON**. Dashboards like the Ashgrove and Brightwater ones all work this way.

## JSON

JSON (JavaScript Object Notation) looks almost exactly like the arrays and objects you've written, with two rules: keys go in double quotes, and there are no comments. Open **bookings.json** in the Explorer to see one.

## fetch and await

```js
const response = await fetch('bookings.json');   // ask for the file
const data = await response.json();              // read the body as JSON
```

Asking a server takes time. `await` pauses *this function* until the answer arrives, without freezing the page. A function that uses `await` must be marked `async`:

```js
async function loadArrivals() { ... }
```

## Things go wrong

Networks fail, servers fall over, files get renamed. Professional code always plans for it:

```js
try {
  const response = await fetch('bookings.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  // ...use the data
} catch (error) {
  console.error(error);
  status.textContent = "Couldn't load today's arrivals.";
}
```

`fetch` only throws when the network fails. A missing file still "succeeds" with a 404 status, which is why you check `response.ok` yourself.

## Your turn

Fill in `loadArrivals()`:

1. Fetch `bookings.json` and read it as JSON, inside a `try`.
2. For each arrival, add an `li` like **M. Okafor, Ocean Room, 3 nights**. Use **night** (not nights) when it's 1.
3. Set the status to **4 arrivals today**, using the array's length.
4. In the `catch`, log the error and set the status to **Couldn't load today's arrivals.**

Then test the failure: rename the fetch to `'missing.json'`, check the status, and change it back.
