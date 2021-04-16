# reduxstore process flow

---
$$ -> redux action

---

1. [Layout.js] useHook `useBusinessData`
  |
  |- [hook] dispatch `$$hydrateBusinessData`
  |--- [slice] calls `mapBusinessData` returns `businessUrlKey`
  |- [hook] dispatch `$$getBusinessData(businessUrlKey)`
  |--- [slice] calls `businessApi.getBusinessData`
  |----- [api] http get `/apptsvc/rest/sasl/getCatalogAndSiteletteDataModelByURLkey`


2. [Layout.js] useHook `useGetUserSASLSummary`
  |- ..
  |- [api] http get `/apptsvc/rest/usersasl/getCommunityExpressUserSASLSummary?&UID=LWU2fPZeSwuTB17HbQ6wcA&serviceAccommodatorId=DEMFFF1&serviceLocationId=DEMFFF1`


3. [order-details page]
  | ..
  |- [<OrderDetails>/<Pickup>]
  |
  |- [<Home>/<Pickup>] `$$shoppingCart/setOrderPickUp`

4. [Layout.js] useHook `useAuthActions`
