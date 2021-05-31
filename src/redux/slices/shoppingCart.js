import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CHECKOUT_MODE } from '../../config/constants';
import { orderAPI, paymentAPI } from '../../services/api';
import { calculateDiscountedPrice } from '../../utils/helpers';

const initialState = {
  orderPickUp: {
    deliveryType: 'PICK_UP'
  },
  tablePath: null,
  items: [],
  itemsWithDiscounts: [],
  priceSubTotal: 0,
  discounts: {
    byId: {},
    allIds: []
  },
  groupDiscounts: {
    byId: {},
    allIds: []
  },
  orderStatus: null, //used to get data on order-status page without additional request
  loading: false,
  error: false,
  errorMessage: null,
  paymentTokenError: null,
  checkoutMode: CHECKOUT_MODE.USER_DATA,
};

export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue }) => {
  try {
    const response = await orderAPI.createOrder(orderData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getPaymentToken = createAsyncThunk('cc/getPaymentToken', async (_, { rejectWithValue }) => {
  try {
    return await paymentAPI.getPaymentToken();
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getNextOrderId = createAsyncThunk('order/getNextOrderId', async (data) => {
  const response = await orderAPI.getNextOrderId(data);
  return response.data;
});

const getPriceSubTotal = (items) =>
  items.reduce(
    (a, b) => a + (b.discountedPrice !== undefined ? b.discountedPrice : b.price) * b.quantity,
    0
  );
const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState: initialState,
  reducers: {
    setOrderPickUp: (state, action) => {
      state.orderPickUp = action.payload;
    },
    addCartItem: (state, action) => {
      state.items.push(action.payload);
    },
    editCartItem: (state, action) => {
      state.items[action.payload.itemIndex] = action.payload.item;
    },
    deleteCartItem: (state, action) => {
      state.items.splice(action.payload, 1);
    },
    clearCart: (state, action) => {
      state.items = [];
      state.priceSubTotal = 0;
    },
    addDiscount: (state, action) => {
      state.discounts.byId[action.payload.id] = action.payload.discount;
      state.discounts.allIds.push(action.payload.id);
    },
    addGroupDiscount: (state, action) => {
      state.groupDiscounts.byId[action.payload.id] = action.payload.discount;
      state.groupDiscounts.allIds.push(action.payload.id);
    },
    setTablePath: (state, action) => {
      state.tablePath = action.payload;
    },
    resetOrderError: (state, action) => {
      state.error = false;
      state.errorMessage = null;
      state.paymentTokenError = null;
    },
    setCheckoutMode: (state, action) => {
      state.checkoutMode = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
        state.paymentTokenError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        const errorText = action.payload;
        state.loading = false;
        state.error = errorText || true;
        state.errorMessage = errorText
      })
      .addCase(getPaymentToken.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
        state.paymentTokenError = null;
      })
      .addCase(getPaymentToken.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      })
      .addCase(getPaymentToken.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.paymentTokenError = action.payload;
      })
      .addCase(getNextOrderId.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
        state.paymentTokenError = null;
      })
      .addCase(getNextOrderId.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      })
      .addCase(getNextOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('CartItem'),
        (state, action) => {
          const updateDiscounts = (
            item,
            itemDiscount,
            itemsWithDiscounts,
            isGroupDiscount = false
          ) => {
            if (itemDiscount) {
              const { type, discount, title, discountUUID } = itemDiscount;
              //removing previous discount if itemVersion doesn't match
              //for example if discount was applied for a small pizza, then user changed it's size to large
              //in this case we need to update item and remove discount
              if (
                itemDiscount.priceItem &&
                itemDiscount.priceItem.itemVersion !== item.itemVersion
              ) {
                const { discountUUID, discountedPrice, promoCodeTitle, ...rest } = item;
                return { ...rest };
              }

              const checkAllowApplyDiscount = () => {
                return !isGroupDiscount
                  ? !itemsWithDiscounts[item.uuid]
                  : !itemsWithDiscounts[item.uuid] && !Object.keys(itemsWithDiscounts).length;
              };

              if (checkAllowApplyDiscount()) {
                //removing previous discount if terms were changed for an item
                //for example discount was applied for an item with quantity == 1
                //then user changed this item quantity to be 2+
                //so we need to update that item and remove discount
                if (item.discountUUID || +item.quantity > 1) {
                  if (+item.quantity > 1) {
                    const { discountUUID, discountedPrice, promoCodeTitle, ...rest } = item;
                    return { ...rest };
                  }

                  itemsWithDiscounts[item.uuid] = itemDiscount;
                  return { ...item };
                }

                itemsWithDiscounts[item.uuid] = itemDiscount;

                return {
                  ...item,
                  price: item.price,
                  discountedPrice: calculateDiscountedPrice(type, discount, item.price),
                  discountUUID,
                  promoCodeTitle: title
                };
              } else {
                //clear discount from item if terms aren't match
                //same as above, some terms were changed so we need to remove a discount from an item
                const { discountUUID, discountedPrice, promoCodeTitle, ...rest } = item;
                return { ...rest };
              }
            }

            return item;
          };

          //single item discounts
          if (state.items && state.items.length > 0 && state.discounts.allIds.length > 0) {
            let itemsWithDiscounts = {};
            state.items = state.items.map((item, index) => {
              const itemDiscountKey = Object.keys(state.discounts.byId).filter(
                (key) => state.discounts.byId[key].applicableItemUUID === item.uuid
              )[0];

              let itemDiscount = state.discounts.byId[itemDiscountKey];

              return updateDiscounts(item, itemDiscount, itemsWithDiscounts);
            });
            state.itemsWithDiscounts = itemsWithDiscounts;
          }

          //group discounts
          if (state.items && state.items.length > 0 && state.groupDiscounts.allIds.length > 0) {
            const itemsWithGroupDiscounts = {};
            state.items = state.items.map((item, index) => {
              const itemDiscountKey = Object.keys(state.groupDiscounts.byId).filter(
                (key) => state.groupDiscounts.byId[key].applicableGroup === item.groupId
              )[0];

              let itemDiscount = state.groupDiscounts.byId[itemDiscountKey];

              return updateDiscounts(item, itemDiscount, itemsWithGroupDiscounts, true);
            });
            state.itemsWithGroupDiscounts = itemsWithGroupDiscounts;
          }

          state.priceSubTotal = getPriceSubTotal(state.items);
        }
      )
  // and provide a default case if no other handlers matched
  // .addDefaultCase((state, action) => {})
});
export const {
  addCartItem,
  editCartItem,
  deleteCartItem,
  clearCart,
  setOrderPickUp,
  addDiscount,
  addGroupDiscount,
  setTablePath,
  resetOrderError,
  setCheckoutMode,
} = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer;
