import mongoose from "mongoose";

export interface ICoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  propertiesAllowed?: number;
  pricePerProperty?: number;
  offerDiscountScope?: "PER_PROPERTY" | "TOTAL";
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  expiresAt?: Date | null;
  usageLimit?: number;
  usedCount: number;
  applicablePlans?: string[]; // Plan IDs that this coupon can be applied to
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },
    propertiesAllowed: {
      type: Number,
      min: [1, "Properties allowed must be at least 1"],
      default: 1,
    },
    pricePerProperty: {
      type: Number,
      min: [0, "Price per property cannot be negative"],
      default: 0,
    },
    offerDiscountScope: {
      type: String,
      enum: ["PER_PROPERTY", "TOTAL"],
      default: "TOTAL",
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
    },
    validUntil: {
      type: Date,
      required: [true, "Valid until date is required"],
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    applicablePlans: {
      type: [String],
      default: [], // Empty array means applicable to all plans
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient coupon lookup
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function (planId?: string, purchaseAmount?: number): { valid: boolean; message: string } {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, message: "This coupon is no longer active" };
  }

  if (now < this.validFrom) {
    return { valid: false, message: "This coupon is not yet valid" };
  }

  const expiryDate = this.expiresAt ?? this.validUntil;
  if (now > expiryDate) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }

  if (this.applicablePlans && this.applicablePlans.length > 0 && planId) {
    const normalizedPlanId = planId.trim().toLowerCase();
    const normalizedApplicablePlans = this.applicablePlans.map((plan: string) =>
      plan.trim().toLowerCase()
    );
    if (!normalizedApplicablePlans.includes(normalizedPlanId)) {
      return { valid: false, message: "This coupon is not applicable to the selected plan" };
    }
  }

  if (this.minPurchaseAmount && purchaseAmount && purchaseAmount < this.minPurchaseAmount) {
    return { valid: false, message: `Minimum purchase amount of €${this.minPurchaseAmount} required` };
  }

  return { valid: true, message: "Coupon is valid" };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (amount: number): number {
  let discount = 0;

  if (this.discountType === "percentage") {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }

  return Math.min(discount, amount); // Discount cannot exceed the amount
};

const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
