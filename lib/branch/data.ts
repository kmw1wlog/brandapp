import scenario from "@/src/data/branch/scenarios/busan_meatbowl.json";
import brandOptions from "@/src/data/branch/brand/brand_options.json";
import franchiseBenchmarks from "@/src/data/branch/franchise/franchise_benchmarks.json";
import menuCosts from "@/src/data/branch/cost/menu_costs.json";
import costAssumptions from "@/src/data/branch/cost/cost_assumptions.json";
import profitSimulations from "@/src/data/branch/cost/profit_simulations.json";
import suppliers from "@/src/data/branch/suppliers/supplier_candidates.json";
import groupbuys from "@/src/data/branch/suppliers/groupbuy_candidates.json";
import construction from "@/src/data/branch/build/construction_requirements.json";
import equipment from "@/src/data/branch/build/equipment_list.json";
import signage from "@/src/data/branch/build/signage_requirements.json";
import locationCriteria from "@/src/data/branch/build/location_criteria.json";
import openingTasks from "@/src/data/branch/timetable/opening_tasks.json";
import consultantCategories from "@/src/data/branch/timetable/consultant_categories.json";
import mockConsultants from "@/src/data/branch/timetable/mock_consultants.json";
import appointmentSlots from "@/src/data/branch/timetable/appointment_slots.json";
import questions from "@/src/data/branch/copy/consultation_questions.json";
import dashboardCopy from "@/src/data/branch/copy/dashboard_copy.json";
import feedbackQuestions from "@/src/data/branch/copy/feedback_questions.json";
import naverCopy from "@/src/data/branch/copy/naver_place_copy.json";
import deliveryCopy from "@/src/data/branch/copy/delivery_app_copy.json";
import type {
  AppointmentSlot,
  BranchScenario,
  BrandOption,
  ConsultantCategory,
  ConstructionRequirements,
  DashboardCopy,
  EquipmentItem,
  FranchiseBenchmark,
  GroupbuyCandidate,
  LocationCriteria,
  MenuCost,
  MockConsultant,
  OpeningTask,
  ProfitSimulation,
  SignageRequirements,
  SupplierCandidate
} from "./types";

export function getScenario() {
  return scenario as BranchScenario;
}

export function getBrandOptions() {
  return brandOptions as BrandOption[];
}

export function getDefaultBrand() {
  return getBrandOptions().find((brand) => brand.id === getScenario().default_brand) ?? getBrandOptions()[0];
}

export function getBrandById(brandId: string) {
  return getBrandOptions().find((brand) => brand.id === brandId) ?? getDefaultBrand();
}

export function getFranchiseBenchmarks() {
  return franchiseBenchmarks as FranchiseBenchmark[];
}

export function getDefaultFranchise() {
  return getFranchiseBenchmarks().find((franchise) => franchise.id === getScenario().default_franchise_comparison) ?? getFranchiseBenchmarks()[0];
}

export function getMenuCosts() {
  return menuCosts as MenuCost[];
}

export function getCostAssumptions() {
  return costAssumptions as Record<string, unknown>;
}

export function getProfitSimulations() {
  return profitSimulations as ProfitSimulation;
}

export function getSupplierCandidates() {
  return suppliers as SupplierCandidate[];
}

export function getGroupbuyCandidates() {
  return groupbuys as GroupbuyCandidate[];
}

export function getConstructionRequirements() {
  return construction as ConstructionRequirements;
}

export function getEquipmentList() {
  return equipment as EquipmentItem[];
}

export function getSignageRequirements() {
  return signage as SignageRequirements;
}

export function getLocationCriteria() {
  return locationCriteria as LocationCriteria;
}

export function getOpeningTasks() {
  return openingTasks as OpeningTask[];
}

export function getConsultantCategories() {
  return consultantCategories as ConsultantCategory[];
}

export function getMockConsultants() {
  return mockConsultants as MockConsultant[];
}

export function getAppointmentSlots() {
  return appointmentSlots as AppointmentSlot[];
}

export function getConsultationQuestions() {
  return questions.categories;
}

export function getDashboardCopy() {
  return dashboardCopy as DashboardCopy;
}

export function getFeedbackQuestions() {
  return feedbackQuestions;
}

export function getNaverPlaceCopy() {
  return naverCopy;
}

export function getDeliveryAppCopy() {
  return deliveryCopy;
}
