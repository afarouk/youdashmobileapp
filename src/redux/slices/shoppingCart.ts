import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderAPI, paymentAPI } from '../../services/api';
import { calculateDiscountedPrice } from '../../utils/helpers';

import { CheckoutMode, OrderStatus, TableDetails } from '../../types/shoppingCartTypes';
import { DeliveryType } from '../../config/constants';

enum CURRENCY {
  USD = 'USD',
}

type ShoppingCartItem = {
  itemId: number,
  itemVersion: number,
  priceId: number,
  uuid: string,
  itemIndex: number,
  versionIndex: number,
  vendorCode: string,
  shortDescription: string,
  longDescription: string,
  currency: CURRENCY,
  price: number,
  itemTag: string,
  itemName: string,
  comments: string,
  itemStatus: string, // TODO: enum
  hasVersions: boolean,
  version1Label: string,
  version1DisplayText: string,
  version1Value: string,
  version2Label: string,
  version2DisplayText: string,
  version2Value: string,
  version3Label: string,
  version3DisplayText: string,
  version3Value: string,
  hasSubItems: boolean,
  mustCustomize: boolean,
  attributes: any,
  taxationType: string, // TODO: enum
  ageRestrictionType: string, // TODO: enum
  typeInGroup: string, // TODO: enum
  inOrderAssociationTag: any,
  itemType: string, // TODO: enum
  quantity: number,
  weightPrice: number,
  weightType: string, // TODO: enum
  variablePriingAllowed: boolean,
  canSplitLeftRight: boolean,
  catalogId: string,
  groupId: string,
  versionSelected: any,
  okToAdd: boolean,
  itemOptionsString: string,
  itemOptions: Record<string, any>,  


}

// TODO: work on this type
type ShoppingCartState = {
  orderPickUp: {
    deliveryType: DeliveryType,
    date?: any,
    time?: string,
  },
  tableDetails: null | TableDetails,
  items: ShoppingCartItem[],
  itemsWithDiscounts: any[] | Record<string, any>,
  itemsWithGroupDiscounts: null | Record<string, any>,
  priceSubTotal: number,
  discounts: {
    byId: Record<string, any>,
    allIds: any[]
  },
  groupDiscounts: {
    byId: Record<string, any>,
    allIds: any[]
  },
  orderStatus: OrderStatus,
  loading: boolean,
  error: boolean | string,
  errorMessage: null | string,
  paymentTokenError: null | string ,
  checkoutMode: CheckoutMode,
}

const initialState: ShoppingCartState = {
  orderPickUp: {
    deliveryType: DeliveryType.PICK_UP,
  },
  tableDetails: null,
  items: [],
  itemsWithDiscounts: [],
  itemsWithGroupDiscounts: null,
  priceSubTotal: 0,
  discounts: {
    byId: {},
    allIds: []
  },
  groupDiscounts: {
    byId: {},
    allIds: []
  },
  orderStatus: null,
  loading: false,
  error: false,
  errorMessage: null,
  paymentTokenError: null,
  checkoutMode: CheckoutMode.USER_DATA,
};

export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue, getState }) => {
  try {
    const state: any = getState();

    const blockUUID = state.greenDining.blockUUID;
    const blockCount = state.greenDining.selectedCount;

    let additionalData;
    if (blockUUID && blockCount) {
      additionalData = {
        blockUUID,
        blockCount,
      }
    }

    const response = await orderAPI.createOrder(orderData, additionalData);
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

const getPriceSubTotal = (items: any[]) =>
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
    setDeliveryType: (state, action) => {
      state.orderPickUp.deliveryType = action.payload;
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
    clearCart: (state) => {
      state.items = [];
      state.priceSubTotal = 0;
    },
    addDiscount: (state, action) => {
      state.discounts.byId[action.payload.id] = action.payload.discount;
      state.discounts.allIds.push(action.payload.id);
    },
    removeDiscount: (state, action) => {
      delete state.discounts.byId[action.payload];
      state.discounts.allIds = state.discounts.allIds.filter(id => id !== action.payload);

      if (!Array.isArray(state.itemsWithDiscounts)) {
        Object.entries(state.itemsWithDiscounts).map(([itemId, discount]) => {
          if (discount.discountUUID === action.payload) {
            delete (state.itemsWithDiscounts as any)[itemId];
          }
        })
      }
    },
    addGroupDiscount: (state, action) => {
      state.groupDiscounts.byId[action.payload.id] = action.payload.discount;
      state.groupDiscounts.allIds.push(action.payload.id);
    },
    setTableDetails: (state, action) => {
      state.tableDetails = action.payload;
      state.orderPickUp.deliveryType = DeliveryType.DINE_IN;
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
      .addCase<any>(createOrder.rejected, (state, action) => {
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
        // state.orderStatus = action.payload;
      })
      .addCase<any>(getPaymentToken.rejected, (state, action) => {
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
        // state.orderStatus = action.payload;
      })
      .addCase(getNextOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('CartItem'),
        (state, action) => {
          const updateDiscounts = (
            item: any,
            itemDiscount: any,
            itemsWithDiscounts: any,
            isGroupDiscount = false
          ) => {
            if (itemDiscount) {
              const { title, discountUUID } = itemDiscount;
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
                  discountedPrice: calculateDiscountedPrice({ discountItem: itemDiscount, price: item.price }),
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
  setDeliveryType,
  addDiscount,
  addGroupDiscount,
  setTableDetails,
  resetOrderError,
  setCheckoutMode,
  removeDiscount,
} = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer;
