import update from "immutability-helper";
import { UNIT_PRICE_A, UNIT_PRICE_B } from "./constants.js";
import {
  STORAGE_UNIT_COST_A,
  STORAGE_UNIT_COST_B,
  STORAGE_UNIT_COST_C,
} from "./constants";
import companyCatalogue from "./constants.js";

export class Core {
  constructor() {
    this.weeks = [];
  }

  createWeek() {
    return {
      simInput: {
        demands: { a: 0, b: 0, c: 0 },
        sells: { a: 0, b: 0, c: 0 },
        orders: [
          { supplierId: "KW", a: 0, b: 0, c: 0 },
          { supplierId: "WWR", a: 0, b: 0, c: 0 },
          { supplierId: "ADD", a: 0, b: 0, c: 0 },
          { supplierId: "IP", a: 0, b: 0, c: 0 },
          { supplierId: "DP", a: 0, b: 0, c: 0 },
        ],
      },
      simOutput: {
        weekStart: {
          stockA: 0,
          stockB: 0,
          stockC: 0,
        },
        weekEnd: {
          stockA: 0,
          stockB: 0,
          stockC: 0,
        },
        results: {
          income: 0,
          storageCost: 0,
          ordersCost: 0,
          profit: 0,
          accumulatedProfit: 0,
        },
      },
    };
  }

  updateIncome(newState, sellsA, sellsB) {
    const newIncome = sellsA * UNIT_PRICE_A + sellsB * UNIT_PRICE_B;

    return update(newState, {
      week: {
        simOutput: {
          results: {
            income: {
              $set: newIncome,
            },
          },
        },
      },
    });
  }

  updateWeekendStock(newState, startStock, sells) {
    return update(newState, {
      week: {
        simOutput: {
          weekEnd: {
            $set: {
              stockA: startStock.stockA - sells.a,
              stockB: startStock.stockB - sells.b,
              stockC: startStock.stockC - sells.c,
            },
          },
        },
      },
    });
  }

  updateStorageCost(newState, weekstartStock, weekendStock) {
    const weeklyStorageCost1 =
      ((weekstartStock.stockA + weekendStock.stockA) / 2) * STORAGE_UNIT_COST_A;
    const weeklyStorageCost2 =
      ((weekstartStock.stockB + weekendStock.stockB) / 2) * STORAGE_UNIT_COST_B;
    const weeklyStorageCost3 =
      ((weekstartStock.stockC + weekendStock.stockC) / 2) * STORAGE_UNIT_COST_C;
    const totalWeeklyStorageCost = (
      weeklyStorageCost1 +
      weeklyStorageCost2 +
      weeklyStorageCost3
    ).toFixed(2);
    return update(newState, {
      week: {
        simOutput: {
          results: { storageCost: { $set: totalWeeklyStorageCost } },
        },
      },
    });
  }

  updateProfit(newState) {
    const income = newState.week.simOutput.results.income;
    const totalWeeklyStorageCost = newState.week.simOutput.results.storageCost;
    const totalOrderCost = newState.week.simOutput.results.ordersCost;
    const profit = income - totalWeeklyStorageCost - totalOrderCost;

    return update(newState, {
      week: {
        simOutput: {
          results: { profit: { $set: profit } },
        },
      },
    });
  }

  currentWeekIndex() {
    return (
      this.weeks.length -
      1 +
      1 /* current week is not pushed yet */ -
      1 /* previous week */
    );
  }

  updateAccumulatedProfit(newState) {
    // Compute the accumulated profit
    const index = this.currentWeekIndex();
    let cumulativeProfit;
    console.log(index);
    if (index >= 0) {
      cumulativeProfit =
        newState.week.simOutput.results.profit +
        this.weeks[index].simOutput.results.accumulatedProfit;
    } else {
      cumulativeProfit = newState.week.simOutput.results.profit;
    }
    return update(newState, {
      week: {
        simOutput: {
          results: { accumulatedProfit: { $set: cumulativeProfit } },
        },
      },
    });
  }

  updateProfitSubTree(newState) {
    return this.updateAccumulatedProfit(this.updateProfit(newState));
  }

  updateSells(state, event) {
    const sells = state.week.simInput.sells;
    const sellsProduct2 = event.name === "A" ? sells.b : sells.a;
    const sellsProduct1 = isNaN(parseInt(event.value))
      ? 0
      : parseInt(event.value);

    // Update the state with the new input.
    let newState = update(state, {
      week: {
        simInput: {
          sells: {
            [event.name.toLowerCase()]: {
              $set: sellsProduct1,
            },
          },
        },
      },
    });

    // Compute the new sells of C and update the state.
    newState = update(newState, {
      week: {
        simInput: {
          sells: {
            c: {
              $set: sellsProduct1 + sellsProduct2,
            },
          },
        },
      },
    });

    // Compute and update the new income.
    // TODO: Error check (=IF(OR((G4>E4),(H4>F4)),"ERROR",G4*$'Prix de vente'.$A$2+H4*$'Prix de vente'.$B$2))
    newState =
      event.name === "A"
        ? this.updateIncome(newState, sellsProduct1, sellsProduct2)
        : this.updateIncome(newState, sellsProduct2, sellsProduct1);

    // Update week end stock.
    const startStock = newState.week.simOutput.weekStart;
    newState = this.updateWeekendStock(
      newState,
      startStock,
      newState.week.simInput.sells
    );

    // Compute the storage cost.
    newState = this.updateStorageCost(
      newState,
      newState.week.simOutput.weekStart,
      newState.week.simOutput.weekEnd
    );

    // Compute the profit and accumulated profit
    newState = this.updateProfitSubTree(newState);

    return newState;
  }

  updateDemands(state, event) {
    const demandsProduct1 = isNaN(parseInt(event.value))
      ? 0
      : parseInt(event.value);

    // Update the state with the new input.
    let newState = update(state, {
      week: {
        simInput: {
          demands: {
            [event.name.toLowerCase()]: {
              $set: demandsProduct1,
            },
          },
        },
      },
    });

    return newState;
  }

  updateOrders(state, event) {
    const supplierId = state.supplier.info.id;
    const indexSupplier = state.week.simInput.orders.findIndex(
      (ele) => ele.supplierId === supplierId
    );
    const value = isNaN(parseInt(event.value)) ? 0 : parseInt(event.value);

    // Update the state with the new input.
    let newState = update(state, {
      week: {
        simInput: {
          orders: {
            [indexSupplier]: {
              [event.name.toLowerCase()]: { $set: value },
            },
          },
        },
      },
    });

    // Compute the net order cost of units for KW excluding the shipping cost
    let computedOrderCostForAKW = 0;
    let computedOrderCostForBKW = 0;
    let computedShippingCostByKW = 0;
    let computedShippingCostByWWR = 0;
    let orderCostFromADD = 0;
    let orderCostFromIP = 0;
    let orderCostFromDP = 0;
    let receptionCostForKW = 0;
    let receptionCostForWWR = 0;
    let receptionCostForADD = 0;
    let receptionCostForIP = 0;
    let receptionCostForDP = 0;

    let new_OrderCost_AWWR = 0;
    let new_OrderCost_BWWR = 0;
    let new_OrderCost_CWWR = 0;
    let new_OrderCost_ABCWWR = 0;
    let new_OrderCost_AKW = 0;
    let new_OrderCost_BKW = 0;
    let new_OrderCost_CKW = 0;
    let new_OrderCost_ABCKW = 0;

    if (
      newState.week.simInput.orders[0].a >
      companyCatalogue.KW.DISCOUNT_UNIT_THRESHOLD
    ) {
      new_OrderCost_AKW =
      newState.week.simInput.orders[0].a *
        companyCatalogue.KW.UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD;
      //computedOrderCostForAKW =
      //companyCatalogue.KW.UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD;
    } else {
      new_OrderCost_AKW =
      newState.week.simInput.orders[0].a *
        companyCatalogue.KW.UNIT_PRICE_A_BELOW_DISCOUNT_THRESHOLD;
      //computedOrderCostForAKW =
      //companyCatalogue.KW.UNIT_PRICE_A_BELOW_DISCOUNT_THRESHOLD;
    }

    if (
      newState.week.simInput.orders[0].b >
      companyCatalogue.KW.DISCOUNT_UNIT_THRESHOLD
    ) {
      new_OrderCost_BKW =
      newState.week.simInput.orders[0].b *
        companyCatalogue.KW.UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD;
      //computedOrderCostForBKW =
      //companyCatalogue.KW.UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD;
    } else {
      new_OrderCost_BKW =
      newState.week.simInput.orders[0].b *
        companyCatalogue.KW.UNIT_PRICE_B_BELOW_DISCOUNT_THRESHOLD;
      //computedOrderCostForBKW =
      //companyCatalogue.KW.UNIT_PRICE_B_BELOW_DISCOUNT_THRESHOLD;
    }
    new_OrderCost_CKW =
    newState.week.simInput.orders[0].c *
      companyCatalogue.KW.UNIT_PRICE_C_BELOW_DISCOUNT_THRESHOLD;
    new_OrderCost_ABCKW =
      new_OrderCost_AKW + new_OrderCost_BKW + new_OrderCost_CKW;
    // Compute the shipping cost for KW
    if (newState.week.simInput.orders[0].a + newState.week.simInput.orders[0].c > 0) {
      if (new_OrderCost_ABCKW > companyCatalogue.KW.FREE_SHIPPING_THRESHOLD) {
        //state.week.simInput.orders[0].a * computedOrderCostForAKW +
        //state.week.simInput.orders[0].b * computedOrderCostForBKW +
        //state.week.simInput.orders[0].c *
        //companyCatalogue.KW.UNIT_PRICE_C_BELOW_DISCOUNT_THRESHOLD >
        //companyCatalogue.KW.FREE_SHIPPING_THRESHOLD
        //) {
        computedShippingCostByKW = 0;
      } else
        computedShippingCostByKW = companyCatalogue.KW.TYPICAL_SHIPPING_COST;
    } else {
      computedShippingCostByKW = 0;
    }
/////adel
    new_OrderCost_AWWR =
    newState.week.simInput.orders[1].a *
      companyCatalogue.WWR.UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD;
    new_OrderCost_BWWR =
    newState.week.simInput.orders[1].b *
      companyCatalogue.WWR.UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD;
    new_OrderCost_CWWR =
    newState.week.simInput.orders[1].c *
      companyCatalogue.WWR.UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD;
    new_OrderCost_ABCWWR =
      new_OrderCost_AWWR + new_OrderCost_BWWR + new_OrderCost_CWWR;

    // Compute the shipping cost for WWR
    if (newState.week.simInput.orders[1].a + newState.week.simInput.orders[1].c > 0) {
      if (
        new_OrderCost_ABCWWR > companyCatalogue.WWR.FREE_SHIPPING_THRESHOLD
        //state.week.simInput.orders[1].a *
        //companyCatalogue.WWR.UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD +
        //state.week.simInput.orders[1].b *
        //companyCatalogue.WWR.UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD +
        //state.week.simInput.orders[1].c *
        //companyCatalogue.WWR.UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD >
        //companyCatalogue.WWR.FREE_SHIPPING_THRESHOLD
      ) {
        computedShippingCostByWWR = 0;
      } else {
        computedShippingCostByWWR = companyCatalogue.WWR.TYPICAL_SHIPPING_COST;
      }
    } else {
      computedShippingCostByWWR = 0;
    }

    // Compute the net oder cost of units for ADD, IP, and DP respectively, excluding the shipping cost
    orderCostFromADD =
    newState.week.simInput.orders[2].a *
      companyCatalogue.ADD.UNIT_PRICE_A_ABOVE_DISCOUNT_THRESHOLD;
    orderCostFromIP =
    newState.week.simInput.orders[3].b *
      companyCatalogue.IP.UNIT_PRICE_B_ABOVE_DISCOUNT_THRESHOLD;
    orderCostFromDP =
    newState.week.simInput.orders[4].c *
      companyCatalogue.DP.UNIT_PRICE_C_ABOVE_DISCOUNT_THRESHOLD;

    // Compute the reception cost for KW, WWR, ADD, IP, and DP respectively
    if (newState.week.simInput.orders[0].a + newState.week.simInput.orders[0].c > 0) {
      receptionCostForKW = companyCatalogue.KW.RECEPTION_COST;
    }
    if (newState.week.simInput.orders[1].a + newState.week.simInput.orders[1].c > 0) {
      receptionCostForWWR = companyCatalogue.WWR.RECEPTION_COST;
    }
    if (newState.week.simInput.orders[2].a > 0) {
      receptionCostForADD = companyCatalogue.ADD.RECEPTION_COST;
    }
    if (newState.week.simInput.orders[3].b > 0) {
      receptionCostForIP = companyCatalogue.IP.RECEPTION_COST;
    }
    if (newState.week.simInput.orders[4].c > 0) {
      receptionCostForDP = companyCatalogue.DP.RECEPTION_COST;
    }
    const totalOrderCost =
      new_OrderCost_ABCKW +
      new_OrderCost_ABCWWR +
      computedShippingCostByKW +
      computedShippingCostByWWR +
      orderCostFromADD +
      orderCostFromIP +
      orderCostFromDP +
      receptionCostForKW +
      receptionCostForWWR +
      receptionCostForADD +
      receptionCostForIP +
      receptionCostForDP;

    newState = update(newState, {
      week: {
        simOutput: {
          results: { ordersCost: { $set: totalOrderCost } },
        },
      },
    });

    // update the profit and accumulated profit
    newState = this.updateProfitSubTree(newState);

    return newState;
  }

  simulate(state, event) {
    if (event.action === "Sells") {
      return this.updateSells(state, event);
    } else if (event.action === "Demands") {
      return this.updateDemands(state, event);
    } else if (event.action === "Orders") {
      return this.updateOrders(state, event);
    } else return {};
  }

  supplierSelected(state, supplier) {
    let newState = update(state, { supplier: { info: { $set: supplier } } });
    if (supplier.id === "ADD")
      newState = update(newState, {
        supplier: { enabledOrders: { $set: { a: true, b: false, c: false } } },
      });
    else if (supplier.id === "IP")
      newState = update(newState, {
        supplier: { enabledOrders: { $set: { a: false, b: true, c: false } } },
      });
    else if (supplier.id === "DP")
      newState = update(newState, {
        supplier: { enabledOrders: { $set: { a: false, b: false, c: true } } },
      });
    else
      newState = update(newState, {
        supplier: { enabledOrders: { $set: { a: true, b: true, c: true } } },
      });

    return newState;
  }

  initWeek() {
    return this.createWeek();
  }

  updateWeekstartSupplier(newState, deliveryTime, supplierId, includeWeekend) {
    let index = this.currentWeekIndex() - deliveryTime;
    if (index >= 0) {
      const orders = this.weeks[index].simInput.orders.find(
        (ele) => ele.supplierId === supplierId
      );
      const { stockA, stockB, stockC } =
        includeWeekend === true
          ? this.weeks[index].simOutput.weekEnd
          : { stockA: 0, stockB: 0, stockC: 0 };

      return update(newState, {
        week: {
          simOutput: {
            weekStart: {
              $set: {
                stockA:
                  newState.week.simOutput.weekStart.stockA + orders.a + stockA,
                stockB:
                  newState.week.simOutput.weekStart.stockB + orders.b + stockB,
                stockC:
                  newState.week.simOutput.weekStart.stockC + orders.c + stockC,
              },
            },
          },
        },
      });
    }
    return newState;
  }

  updateWeekstartStock(newWeek) {
    let week = this.updateWeekstartSupplier({ week: newWeek }, 0, "ADD", true)
      .week;
    week = this.updateWeekstartSupplier({ week: week }, 0, "IP", false).week;
    week = this.updateWeekstartSupplier({ week: week }, 0, "DP", false).week;
    week = this.updateWeekstartSupplier({ week: week }, 4, "WWR", false).week;
    week = this.updateWeekstartSupplier({ week: week }, 1, "KW", false).week;

    return week;
  }

  advanceSimulation(week) {
    // Store this week
    this.weeks.push(week);

    // Create and update the next week
    let newWeek = this.createWeek();

    newWeek = this.updateWeekstartStock(newWeek);
    newWeek = this.updateWeekendStock(
      { week: newWeek },
      newWeek.simOutput.weekStart,
      newWeek.simInput.sells
    ).week;
    newWeek = this.updateStorageCost(
      { week: newWeek },
      newWeek.simOutput.weekStart,
      newWeek.simOutput.weekEnd
    ).week;

    // Compute the profit and accumulated profit
    newWeek = this.updateProfitSubTree({ week: newWeek }).week;

    console.log(this.weeks);
    return newWeek;
  }
}
