import { MENU_ONLY_QR_CODE } from "../config/constants";

export const useMenuOnlyQrCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const isMenuOnlyQrCode = searchParams.get(MENU_ONLY_QR_CODE.QUERY_PARAMETER) === MENU_ONLY_QR_CODE.PARAMETER_VALUE;

  return {
    isMenuOnlyQrCode,
  }
}