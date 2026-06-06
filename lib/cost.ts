import type { CostIngredient } from "./types";

export function calculateFoodCost(ingredients: CostIngredient[]) {
  return ingredients.reduce((sum, ingredient) => sum + ingredient.cost_estimate, 0);
}

export function calculatePackagingCost(packaging: CostIngredient[]) {
  return packaging.reduce((sum, item) => sum + item.cost_estimate, 0);
}

export function calculateFoodCostRate(foodCost: number, price: number) {
  return foodCost / price;
}

export function calculateGrossMargin(price: number, foodCost: number, packagingCost: number) {
  return price - foodCost - packagingCost;
}

export function calculateWeightedDeliveryFee(price: number, deliveryRatio: number, deliveryFeeRate: number) {
  return price * deliveryRatio * deliveryFeeRate;
}

export function calculateContributionMargin(
  price: number,
  foodCost: number,
  packagingCost: number,
  weightedDeliveryFee: number
) {
  return price - foodCost - packagingCost - weightedDeliveryFee;
}

export function calculateOperatingMargin(
  contributionMargin: number,
  laborAllocation: number,
  rentAllocation: number,
  miscAllocation: number
) {
  return contributionMargin - laborAllocation - rentAllocation - miscAllocation;
}

export function calculateBreakevenServings(monthlyFixedCost: number, contributionMargin: number, businessDays: number) {
  const monthly = Math.ceil(monthlyFixedCost / contributionMargin);
  return {
    monthly,
    daily: monthly / businessDays
  };
}

export function simulatePrices(
  baseCostData: {
    foodCost: number;
    packagingCost: number;
    deliveryRatio: number;
    deliveryFeeRate: number;
    recommendedPrice: number;
  },
  prices: number[]
) {
  return prices.map((price) => {
    const weightedDeliveryFee = calculateWeightedDeliveryFee(price, baseCostData.deliveryRatio, baseCostData.deliveryFeeRate);
    return {
      price,
      foodCostRate: calculateFoodCostRate(baseCostData.foodCost, price),
      grossMargin: calculateGrossMargin(price, baseCostData.foodCost, baseCostData.packagingCost),
      contributionMargin: calculateContributionMargin(price, baseCostData.foodCost, baseCostData.packagingCost, weightedDeliveryFee),
      recommended: price === baseCostData.recommendedPrice
    };
  });
}
