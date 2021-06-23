import { GREEN_DINING_LOCAL_STORAGE_KEY, GREEN_DINING_USED_DEALS_MAX_COUNT } from "../../config/constants";

type UsedDeal = {
  simpleOrderUUID: string,
  discountUUID: string,
}

type GreenDiningLocalStorageData = {
  usedDeals: UsedDeal[], 
}

export class GreenDiningLocalStorage {
  data: GreenDiningLocalStorageData;
      
  constructor() {
    try {
      const data = localStorage.getItem(GREEN_DINING_LOCAL_STORAGE_KEY)
      
      if (data) {
        this.data = JSON.parse(data);
      }
    } catch (error) {
      console.error('Unable to parse green dining local storage key');
    }

    if (!this.areUsedDealsConfigured()) {
      if (!this.data) {
        this.data = {
          usedDeals: [],
        };
      }
  
      if (!this.data.usedDeals) {
        this.data.usedDeals = [];
      }
    }
  }

  isDealAlreadyUsed = (simpleOrderUUID: string, discountUUID: string) => {
    if (!this.areUsedDealsConfigured()) {
      return false;
    }
    
    const usedDeal = this.data?.usedDeals.find(ud => ud.simpleOrderUUID === simpleOrderUUID && ud.discountUUID === discountUUID);

    return Boolean(usedDeal);
  }

  addUsedDeal = (simpleOrderUUID: string, discountUUID: string) => {
    const usedDeal: UsedDeal = {
      simpleOrderUUID,
      discountUUID,
    };

    this.data.usedDeals.unshift(usedDeal);

    if (this.data.usedDeals.length > GREEN_DINING_USED_DEALS_MAX_COUNT) {
      this.data.usedDeals.pop();
    }

    localStorage.setItem(GREEN_DINING_LOCAL_STORAGE_KEY, JSON.stringify(this.data));
  }

  areUsedDealsConfigured = () => {
    return this.data && Array.isArray(this.data.usedDeals);
  }
  
}