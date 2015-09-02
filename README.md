# Azure Mobile Apps - Node SDK

The Azure Mobile Apps Node.js SDK is designed to make it as easy as possible to get up and running while not preventing advanced scenarios from extending and changing our core SDK. Our SDK is an [Express](http://expressjs.com/) middleware module. If you are not familiar with Express, Express is a lightweight, highly composable web application framework for Node.js. You don't need to be familiar with Express to use our SDK, but to extend or customize our SDK, it will be helpful to review their documentation.

```
var app = require('express')(); // Create an instance of an Express app
var mobileApp = require('azure-mobile-apps')(); // Create an instance of a Mobile App with default settings

mobileApp.tables.add('foo'); // Create a Table for 'foo' with all default settings

mobileApp.attach(app); // Attach the mobileApp to
app.listen(process.env.PORT || 3000);
```

## Installation
