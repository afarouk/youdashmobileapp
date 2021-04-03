# readme

bootstrapped using cra [Create react app docs](./docs/cra.md)

## development

1. run middleware server on `./server/index.js`

```sh
cd server && yarn dev
```

2. Put this injection script on `build/index.html` to gain some agility on
react development.. pending for a better solution. Insert before closing
`</body>` tag.

```html
<script>
  let saslData = window.__SASL_DATA__;
  let services = saslData.siteletteDataModel.sasl.services;
  let paymentProcessor = services.onlineOrder.paymentProcessor;
  console.log(paymentProcessor);
</script>

```

