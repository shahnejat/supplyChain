export const UNIT_PRICE_A = 15;
export const UNIT_PRICE_B = 12;

export const STORAGE_UNIT_COST_A = 0.075;
export const STORAGE_UNIT_COST_B = 0.06;
export const STORAGE_UNIT_COST_C = 0.01;

const companyCatalogue = {
  KW:
    {
      supplierId: "KW",
      DISCOUNT_UNIT_THRESHOLD: 100,
      TYPICAL_SHIPPING_COST: 80,
      FREE_SHIPPING_THRESHOLD: 1000,
      UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD: 4,
      UNIT_PRICE_A_BELOW_DISCOUNT_THRESHOLD: 5,
      UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD: 2.5,
      UNIT_PRICE_B_BELOW_DISCOUNT_THRESHOLD: 3,
      UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD: 1,
      UNIT_PRICE_C_BELOW_DISCOUNT_THRESHOLD: 1,
      DELAY_IN_WEEKS: 1,
      RECEPTION_COST: 80,
    },
  WWR: 
    {
      supplierId: "WWR",
      DISCOUNT_UNIT_THRESHOLD: 300,
      TYPICAL_SHIPPING_COST: 200,
      FREE_SHIPPING_THRESHOLD: 3000,
      UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD: 3,
      UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD: 2,
      UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD: 0.5,
      DELAY_IN_WEEKS: 4,
      RECEPTION_COST: 80,
    },
  ADD:
    {
      supplierId: "ADD",
      UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD: 7,
      DELAY_IN_WEEKS: 0,
      RECEPTION_COST: 80,
    },
  IP:
    {
      supplierId: "IP",
      UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD: 6,
      DELAY_IN_WEEKS: 0,
      RECEPTION_COST: 80,
    },
  DP:
    {
      supplierId: "DP",
      UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD: 2,
      DELAY_IN_WEEKS: 0,
      RECEPTION_COST: 80,
    }
};
export default companyCatalogue;