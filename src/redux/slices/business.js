import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessAPI } from '../../services/api';
import { getDayNameByIndex } from '../../utils/helpers';
import { isDemo } from '../../services/request';

const initialState = {
  data: {
    isDemo: false,
    catalogId: null,
    serviceAccommodatorId: null,
    serviceLocationId: null,
    urlKey: '',
    saslName: '',
    bannerImageURL: null,
    saslIcon: null,
    themeColors: null,
    serviceStatus: null,
    ogTags: null,
    openingHours: [],
    priorityBox: {
      priority: null,
      notification: null,
      polls: [],
      highLightedItem: null
    },
    pickUp: {
      futureDays: [],
      pickUpTimes: [],
      isOpen: null,
      isOpenWarningMessage: null,
      address: {
        telephoneNumber: null,
        city: null,
        country: null,
        state: null,
        street: null,
        street2: '',
        timeZone: null,
        locale: null,
        zip: null
      }
    },
    onlineOrder: {
      tips: [],
      acceptCreditCards: null,
      paymentProcessor: null,
      allowItemComments: false,
      allowOrderComments: false
    },
    mapCoordinates: {
      latitude: null,
      longitude: null
    },
    extraFees: null,
    groups: [],
    groupsById: {},
    itemsById: null,

    hasGroupsBasedOnDay: false,
    catalogs: [],
    mobileOrderStatuses: {},
    promotions: [],
    discounts: [],
    defaultImageURL: null,
    loyaltyProgram: null,
    loyaltyProgramData: null
  },
  loading: false,
  error: false
};

const getCatalog = (catalogs) => {
  const validOneDayOnlyFalse = catalogs.filter(
    ({ isValidOneDayOnly }) => isValidOneDayOnly === false
  );
  if (validOneDayOnlyFalse && validOneDayOnlyFalse.length > 0) {
    return {
      hasGroupsBasedOnDay: false,
      catalog: validOneDayOnlyFalse[0]
    };
  }
  const validOneDayOnly = catalogs.filter(({ isValidOneDayOnly }) => isValidOneDayOnly === true);
  if (validOneDayOnly && validOneDayOnly.length > 0) {
    const days = validOneDayOnly.filter(
      ({ validDay }) => validDay.toLowerCase() === getDayNameByIndex(new Date().getDay())
    );
    if (days && days.length > 0) {
      return {
        hasGroupsBasedOnDay: true,
        catalog: days[0]
      };
    }
  }
};

const mapUnSubgroupedItems = (items, groupId) => {
  let itemsObject = {}; //needed for itemsById dictionary
  const itemsArray = items.map((item) => {
    const { thumbnailBase64, ...rest } = item;
    if (rest.canSplitLeftRight && rest.itemOptions && rest.itemOptions.subItems) {
      rest.itemOptions = {
        ...rest.itemOptions,
        subItemsLeft: {...rest.itemOptions.subItems},
      }
    }
    
    if (!rest.quantity) {
      rest.quantity = 1;
    }

    /* Needed for correct re-order from Order History of item version different from 1
     * because UUID of orderItem is changed and we need to handle that and put each version
     * as a separate item to make possible of quick check itemsById[itemUUID]
     */
    if (item.hasVersions && item.itemVersions.length) {
      item.itemVersions.map((itemVersion) => {
        const { thumbnailBase64, ...restItem } = itemVersion;
        itemsObject[itemVersion.uuid] = {
          ...rest,
          ...restItem,
          groupId
        };
      });
    }

    itemsObject[item.uuid] = {
      ...rest,
      groupId
    };

    return {
      ...rest,
      groupId
    };
  });
  return {
    itemsArray,
    itemsObject
  };
};

const mapGroups = (groupsSrc) => {
  let groups = [];
  let itemsById = {};
  let groupsById = {};
  if (groupsSrc !== undefined && groupsSrc && groupsSrc.length) {
    groups = groupsSrc
      .filter((g) => g.groupType.enumText !== 'DISCOUNT_ONLY' && g.groupType.enumText !== 'ADHOC')
      .map((g, i) => {
        groupsById[g.groupId] = g;
        const { indexInCatalog, groupDisplayText, unSubgroupedItems, groupId } = g;
        const { itemsArray, itemsObject } = mapUnSubgroupedItems(unSubgroupedItems, groupId);
        itemsById = {
          ...itemsById,
          ...itemsObject
        };
        return {
          indexInCatalog,
          groupDisplayText,
          unSubgroupedItems: itemsArray
        };
      });
  }
  return {
    groups,
    groupsById,
    itemsById
  };
};

const mapMobileOrderStatuses = (mobileOrderStatuses) => {
  const statuses = {};
  if (mobileOrderStatuses && mobileOrderStatuses.length) {
    mobileOrderStatuses.map((status) => {
      statuses[status.enumText] = status.mobileDisplayText;
    });
  }
  return statuses;
};

const mapPollsById = (polls) => {
  let pollsById = {};
  if (polls.length > 0) {
    polls.map((p) => (pollsById[p.contestUUID] = p));
  }
  return pollsById;
};

const mapBusinessData = (urlKey, data) => {
  const {
    serviceAccommodatorId,
    serviceLocationId,
    saslName,
    themeColors,
    appleTouchIcon192URL,
    city,
    country,
    number,
    state,
    street,
    timeZone,
    locale,
    zip,
    discounts,
    promotions,
    services,
    latitude,
    longitude,
    ogTags
  } = data?.siteletteDataModel?.sasl;

  const {
    serviceStatus,
    saBannerImageURL,
    defaultImageURL,
    futureDays,
    pickUpTimes,
    extraFees,
    loyaltyProgram,
    loyaltyProgramData,
    mobileOrderStatuses,
    openingHours,
    highLightedItem,
    notification,
    priority,
    polls
  } = data.siteletteDataModel;

  const { catalog, hasGroupsBasedOnDay } = getCatalog(data.catalogs);
  const groupsSrc = catalog.groups;
  const { isOpen, isOpenWarningMessage, catalogId } = catalog;

  const {
    tips,
    showTips,
    acceptCreditCards,
    paymentProcessor,
    allowItemComments,
    allowOrderComments
  } = services.onlineOrder;

  // let onlineOrder = {
  //   tips,
  //   showTips,
  //   acceptCreditCards,
  //   paymentProcessor,
  //   allowItemComments,
  //   allowOrderComments
  // };

  let onlineOrder = services.onlineOrder;

  let mapCoordinates = {
    latitude,
    longitude
  };

  let pickUp = {
    futureDays,
    pickUpTimes,
    isOpen,
    isOpenWarningMessage,
    address: {
      city,
      country,
      number,
      state,
      street,
      timeZone,
      locale,
      zip
    }
  };

  let priorityBox = {
    highLightedItem,
    notification,
    priority,
    polls,
    pollsById: mapPollsById(polls)
  };
  const { groups, groupsById, itemsById } = mapGroups(groupsSrc);

  return {
    priorityBox,
    openingHours: openingHours?.shiftPolicies ? openingHours.shiftPolicies : [],
    ogTags,
    serviceStatus: serviceStatus.enumText ? serviceStatus.enumText : null,
    isDemo: isDemo,
    mapCoordinates,
    mobileOrderStatuses: mapMobileOrderStatuses(mobileOrderStatuses),
    onlineOrder,
    loyaltyProgram,
    loyaltyProgramData,
    promotions,
    discounts,
    extraFees,
    catalogId,
    serviceAccommodatorId,
    serviceLocationId,
    themeColors,
    urlKey,
    saslName,
    saslIcon: appleTouchIcon192URL,
    bannerImageURL: saBannerImageURL,
    defaultImageURL,
    pickUp,
    groups,
    groupsById,
    itemsById,
    hasGroupsBasedOnDay,
    catalogs: data.catalogs
  };
};

export const getBusinessData = createAsyncThunk('business/getBusinessData', async (urlKey) => {
  const response = await businessAPI.getBusinessData(urlKey);
  return mapBusinessData(urlKey, response.data);
});

const businessSlice = createSlice({
  name: 'business',
  initialState: initialState,
  reducers: {
    updateGroups: (state, action) => {
      const result = mapGroups(action.payload);
      state.data.groups = result.groups;
      state.data.groupsById = result.groupsById;
      state.data.itemsById = result.itemsById;
    },
    hydrateBusinessData: (state, action) => {
      state.data = mapBusinessData(action.payload.businessUrlKey, action.payload.businessData);
      state.loading = false;
    }
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [getBusinessData.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [getBusinessData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [getBusinessData.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    }
  }
});

export const { updateGroups, hydrateBusinessData } = businessSlice.actions;
export const businessReducer = businessSlice.reducer;
