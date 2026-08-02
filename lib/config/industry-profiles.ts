import type { EntityKey } from "./entity-labels";

export type SuggestedCustomField = {
  fieldKey: string;
  label: string;
  type: "text" | "number" | "date" | "dropdown" | "toggle";
  options?: string[];
  required?: boolean;
};

export type IndustryProfileConfig = {
  /** Default entity labels applied when this profile is selected (never overwrites an admin override). */
  labels?: Partial<Record<EntityKey, { singular?: string; plural?: string }>>;
  /** Default visibility flags per module (moduleKey -> visible fixed field keys). */
  fieldVisibility?: Record<string, string[]>;
  /** Suggested custom fields per module, seeded as inactive entries. */
  customFields?: Record<string, SuggestedCustomField[]>;
};

export const INDUSTRY_PROFILE_NAMES = [
  "Generic",
  "IT & Software",
  "Café & Restaurant",
  "Retail",
  "Construction",
  "Healthcare",
  "Education",
  "NGO & Nonprofit",
  "Manufacturing",
  "Logistics & Transport",
  "Professional Services",
  "Hospitality",
  "Custom",
] as const;

export type IndustryProfileName = (typeof INDUSTRY_PROFILE_NAMES)[number];

export const CUSTOM_PROFILE = "Custom";

/**
 * Static config map keyed by industry profile name. "Custom" intentionally has
 * no entry (empty preset) — the admin drives every label/field individually.
 */
export const INDUSTRY_PROFILES: Record<string, IndustryProfileConfig> = {
  Generic: {
    labels: {},
    fieldVisibility: {},
    customFields: {},
  },

  "IT & Software": {
    labels: {
      customer: { singular: "Client", plural: "Clients" },
    },
    fieldVisibility: {
      project: [
        "title",
        "category",
        "customer",
        "service",
        "team",
        "status",
        "startDate",
        "endDate",
        "budget",
        "liveUrl",
        "technologies",
        "thumbnail",
        "gallery",
        "overview",
        "features",
      ],
    },
    customFields: {
      customer: [
        { fieldKey: "companyWebsite", label: "Company Website", type: "text" },
        { fieldKey: "accountManager", label: "Account Manager", type: "text" },
        {
          fieldKey: "techInterests",
          label: "Technology Interests",
          type: "dropdown",
          options: ["Web", "Mobile", "Cloud", "AI/ML", "Data", "DevOps"],
        },
      ],
      project: [
        { fieldKey: "repositoryUrl", label: "Repository URL", type: "text" },
        { fieldKey: "deploymentUrl", label: "Deployment URL", type: "text" },
        { fieldKey: "techStack", label: "Tech Stack", type: "text" },
        { fieldKey: "agileDelivery", label: "Agile Delivery", type: "toggle" },
        { fieldKey: "sprintCount", label: "Sprint Count", type: "number" },
      ],
      service: [
        { fieldKey: "slaHours", label: "SLA Response (hours)", type: "number" },
        { fieldKey: "supportTier", label: "Support Tier", type: "dropdown", options: ["Basic", "Standard", "Premium"] },
      ],
      team: [
        { fieldKey: "githubUsername", label: "GitHub Username", type: "text" },
        { fieldKey: "skillLevel", label: "Skill Level", type: "dropdown", options: ["Junior", "Mid", "Senior", "Lead"] },
      ],
      invoice: [
        { fieldKey: "paymentTermsDays", label: "Payment Terms (days)", type: "number" },
      ],
    },
  },

  "Café & Restaurant": {
    labels: {
      customer: { singular: "Guest", plural: "Guests" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "tableNumber", label: "Favourite Table", type: "text" },
        { fieldKey: "dietaryNotes", label: "Dietary Notes", type: "text" },
        { fieldKey: "allergies", label: "Allergies", type: "dropdown", options: ["None", "Gluten", "Dairy", "Nuts", "Shellfish"] },
        { fieldKey: "birthday", label: "Birthday", type: "date" },
        { fieldKey: "loyaltyMember", label: "Loyalty Member", type: "toggle" },
      ],
      service: [
        { fieldKey: "mealType", label: "Meal Type", type: "dropdown", options: ["Breakfast", "Lunch", "Dinner", "Brunch"] },
      ],
      invoice: [
        { fieldKey: "tableNumber", label: "Table Number", type: "text" },
        { fieldKey: "numberOfGuests", label: "Number of Guests", type: "number" },
      ],
    },
  },

  Retail: {
    labels: {
      customer: { singular: "Shopper", plural: "Shoppers" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "membershipTier", label: "Membership Tier", type: "dropdown", options: ["Bronze", "Silver", "Gold", "Platinum"] },
        { fieldKey: "loyaltyPoints", label: "Loyalty Points", type: "number" },
        { fieldKey: "preferredStore", label: "Preferred Store", type: "text" },
        { fieldKey: "newsletterOptIn", label: "Newsletter Opt-In", type: "toggle" },
      ],
      product: [
        { fieldKey: "sku", label: "SKU", type: "text" },
        { fieldKey: "stockQuantity", label: "Stock Quantity", type: "number" },
      ],
      invoice: [
        { fieldKey: "cashierName", label: "Cashier Name", type: "text" },
      ],
    },
  },

  Construction: {
    labels: {
      project: { singular: "Build Project", plural: "Build Projects" },
    },
    fieldVisibility: {
      project: [
        "title",
        "category",
        "customer",
        "service",
        "team",
        "status",
        "startDate",
        "endDate",
        "budget",
        "thumbnail",
        "gallery",
        "overview",
      ],
    },
    customFields: {
      customer: [
        { fieldKey: "contractNumber", label: "Contract Number", type: "text" },
        { fieldKey: "insuranceProvider", label: "Insurance Provider", type: "text" },
      ],
      project: [
        { fieldKey: "siteAddress", label: "Site Address", type: "text" },
        { fieldKey: "permitNumber", label: "Permit Number", type: "text" },
        { fieldKey: "contractor", label: "Contractor", type: "text" },
        { fieldKey: "siteSupervisor", label: "Site Supervisor", type: "text" },
        { fieldKey: "complianceCertificate", label: "Compliance Certificate", type: "toggle" },
      ],
      team: [
        { fieldKey: "certification", label: "Certification", type: "text" },
        { fieldKey: "safetyTraining", label: "Safety Training", type: "toggle" },
      ],
      invoice: [
        { fieldKey: "milestoneStage", label: "Milestone Stage", type: "dropdown", options: ["Site Prep", "Foundation", "Structure", "Finishing", "Handover"] },
      ],
    },
  },

  Healthcare: {
    labels: {
      customer: { singular: "Patient", plural: "Patients" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "bloodGroup", label: "Blood Group", type: "dropdown", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
        { fieldKey: "insuranceProvider", label: "Insurance Provider", type: "text" },
        { fieldKey: "emergencyContact", label: "Emergency Contact", type: "text" },
        { fieldKey: "allergies", label: "Allergies", type: "text" },
        { fieldKey: "dateOfBirth", label: "Date of Birth", type: "date" },
      ],
      team: [
        { fieldKey: "licenseNumber", label: "License Number", type: "text" },
        { fieldKey: "specialization", label: "Specialization", type: "text" },
      ],
      invoice: [
        { fieldKey: "insuranceClaimNo", label: "Insurance Claim No", type: "text" },
      ],
    },
  },

  Education: {
    labels: {
      customer: { singular: "Student", plural: "Students" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "enrollmentDate", label: "Enrollment Date", type: "date" },
        { fieldKey: "grade", label: "Grade / Level", type: "text" },
        { fieldKey: "guardianName", label: "Guardian Name", type: "text" },
        { fieldKey: "guardianContact", label: "Guardian Contact", type: "text" },
        { fieldKey: "scholarship", label: "Scholarship Holder", type: "toggle" },
      ],
      team: [
        { fieldKey: "staffId", label: "Staff ID", type: "text" },
        { fieldKey: "subjects", label: "Subjects", type: "text" },
      ],
      invoice: [
        { fieldKey: "term", label: "Term", type: "dropdown", options: ["Term 1", "Term 2", "Term 3", "Term 4"] },
        { fieldKey: "feeType", label: "Fee Type", type: "dropdown", options: ["Tuition", "Boarding", "Transport", "Other"] },
      ],
    },
  },

  "NGO & Nonprofit": {
    labels: {
      customer: { singular: "Donor", plural: "Donors" },
      project: { singular: "Programme", plural: "Programmes" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "donorType", label: "Donor Type", type: "dropdown", options: ["Individual", "Corporate", "Foundation", "Government"] },
        { fieldKey: "donationFrequency", label: "Donation Frequency", type: "dropdown", options: ["One-time", "Monthly", "Quarterly", "Annual"] },
        { fieldKey: "cause", label: "Cause", type: "text" },
        { fieldKey: "taxReceipt", label: "Tax Receipt Requested", type: "toggle" },
      ],
      project: [
        { fieldKey: "beneficiaries", label: "Beneficiaries", type: "number" },
        { fieldKey: "fundingSource", label: "Funding Source", type: "text" },
        { fieldKey: "impactMetric", label: "Impact Metric", type: "text" },
      ],
      invoice: [
        { fieldKey: "grantNumber", label: "Grant Number", type: "text" },
      ],
    },
  },

  Manufacturing: {
    labels: {
      customer: { singular: "Client", plural: "Clients" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "businessType", label: "Business Type", type: "dropdown", options: ["OEM", "Distributor", "Wholesaler", "Retailer"] },
        { fieldKey: "creditLimit", label: "Credit Limit", type: "number" },
      ],
      project: [
        { fieldKey: "poNumber", label: "PO Number", type: "text" },
        { fieldKey: "deliveryDate", label: "Delivery Date", type: "date" },
        { fieldKey: "batchNumber", label: "Batch Number", type: "text" },
        { fieldKey: "qualityApproved", label: "Quality Approved", type: "toggle" },
      ],
      invoice: [
        { fieldKey: "deliveryNote", label: "Delivery Note No", type: "text" },
      ],
    },
  },

  "Logistics & Transport": {
    labels: {},
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "deliveryZone", label: "Delivery Zone", type: "text" },
        { fieldKey: "fleetRequired", label: "Fleet Type Required", type: "dropdown", options: ["Van", "Truck", "Container", "Refrigerated"] },
      ],
      project: [
        { fieldKey: "trackingNumber", label: "Tracking Number", type: "text" },
        { fieldKey: "deliveryDeadline", label: "Delivery Deadline", type: "date" },
        { fieldKey: "hazmat", label: "Hazardous Material", type: "toggle" },
      ],
      team: [
        { fieldKey: "licenseClass", label: "License Class", type: "text" },
        { fieldKey: "route", label: "Primary Route", type: "text" },
      ],
      invoice: [
        { fieldKey: "shipmentReference", label: "Shipment Reference", type: "text" },
      ],
    },
  },

  "Professional Services": {
    labels: {
      customer: { singular: "Client", plural: "Clients" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "accountManager", label: "Account Manager", type: "text" },
        { fieldKey: "retainerAmount", label: "Retainer Amount", type: "number" },
        { fieldKey: "engagementType", label: "Engagement Type", type: "dropdown", options: ["Retainer", "Project", "Advisory", "Hourly"] },
      ],
      project: [
        { fieldKey: "engagementStart", label: "Engagement Start", type: "date" },
        { fieldKey: "engagementEnd", label: "Engagement End", type: "date" },
        { fieldKey: "internalCode", label: "Internal Code", type: "text" },
      ],
      team: [
        { fieldKey: "professionalLicense", label: "Professional License", type: "text" },
        { fieldKey: "billableRate", label: "Billable Rate", type: "number" },
      ],
      invoice: [
        { fieldKey: "poReference", label: "PO Reference", type: "text" },
      ],
    },
  },

  Hospitality: {
    labels: {
      customer: { singular: "Guest", plural: "Guests" },
    },
    fieldVisibility: {},
    customFields: {
      customer: [
        { fieldKey: "roomType", label: "Preferred Room Type", type: "dropdown", options: ["Standard", "Deluxe", "Suite", "Villa"] },
        { fieldKey: "checkIn", label: "Check-In Date", type: "date" },
        { fieldKey: "checkOut", label: "Check-Out Date", type: "date" },
        { fieldKey: "specialRequests", label: "Special Requests", type: "text" },
        { fieldKey: "returningGuest", label: "Returning Guest", type: "toggle" },
      ],
      service: [
        { fieldKey: "serviceCharge", label: "Service Charge %", type: "number" },
      ],
      invoice: [
        { fieldKey: "roomNumber", label: "Room Number", type: "text" },
        { fieldKey: "numberOfNights", label: "Number of Nights", type: "number" },
      ],
    },
  },

  Custom: {
    labels: {},
    fieldVisibility: {},
    customFields: {},
  },
};

export function getProfileConfig(profile: string): IndustryProfileConfig {
  return INDUSTRY_PROFILES[profile] ?? INDUSTRY_PROFILES.Generic;
}

export function isCustomProfile(profile: string): boolean {
  return profile === CUSTOM_PROFILE;
}
