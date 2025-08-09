"use client";
import { useState } from "react";
import ResponsiveLayout from '../support/responsive-layout';
import styles from "./new-delivery.module.css";

interface DeliveryFormData {
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  packageWeight: string;
  length: string;
  width: string;
  height: string;
  packageDescription: string;
  deliverySpeed: string;
  specialInstructions: string;
  requireSignature: boolean;
  photoConfirmation: boolean;
  packageInsurance: boolean;
  paymentMethod: string;
}

export default function NewDelivery() {
  const [formData, setFormData] = useState<DeliveryFormData>({
    pickupAddress: "",
    deliveryAddress: "",
    packageType: "",
    packageWeight: "0.0",
    length: "0",
    width: "0",
    height: "0",
    packageDescription: "",
    deliverySpeed: "standard",
    specialInstructions: "",
    requireSignature: false,
    photoConfirmation: false,
    packageInsurance: false,
    paymentMethod: "card"
  });

  const handleInputChange = (field: keyof DeliveryFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
  };

  return (
    <ResponsiveLayout>
      <div className={styles.newDeliveryContainer}>
      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Place New Drone Delivery Order</h1>
        <p className={styles.pageSubtitle}>Fast, reliable drone delivery to your doorstep</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.deliveryForm}>
        <div className={styles.formLayout}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Pickup & Delivery Locations */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📍</span>
                <h2 className={styles.sectionTitle}>Pickup & Delivery Locations</h2>
              </div>
              
              <div className={styles.addressGrid}>
                <div className={styles.addressField}>
                  <label className={styles.fieldLabel}>Pickup Address</label>
                  <input
                    type="text"
                    className={styles.addressInput}
                    placeholder="Enter pickup address"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                  />
                  <p className={styles.fieldHint}>Or select from partner locations</p>
                </div>
                
                <div className={styles.addressField}>
                  <label className={styles.fieldLabel}>Delivery Address</label>
                  <input
                    type="text"
                    className={styles.addressInput}
                    placeholder="Enter delivery address"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                  />
                  <p className={styles.fieldHint}>✅ Address is in delivery zone</p>
                </div>
              </div>
              
              <button type="button" className={styles.mapButton}>
                🗺️ View Delivery Zone Map
              </button>
            </div>

            {/* Package Information */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📦</span>
                <h2 className={styles.sectionTitle}>Package Information</h2>
              </div>
              
              <div className={styles.packageGrid}>
                <div className={styles.packageField}>
                  <label className={styles.fieldLabel}>Package Type</label>
                  <select
                    className={styles.selectInput}
                    value={formData.packageType}
                    onChange={(e) => handleInputChange("packageType", e.target.value)}
                  >
                    <option value="">Select package type</option>
                    <option value="electronics">Electronics</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="food">Food & Beverages</option>
                    <option value="documents">Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className={styles.packageField}>
                  <label className={styles.fieldLabel}>Package Weight</label>
                  <div className={styles.weightInput}>
                    <span className={styles.weightIcon}>⚖️</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className={styles.weightField}
                      value={formData.packageWeight}
                      onChange={(e) => handleInputChange("packageWeight", e.target.value)}
                    />
                    <span className={styles.weightUnit}>kg</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.dimensionsGrid}>
                <div className={styles.dimensionField}>
                  <label className={styles.fieldLabel}>Length (cm)</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.dimensionInput}
                    placeholder="0"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                  />
                </div>
                <div className={styles.dimensionField}>
                  <label className={styles.fieldLabel}>Width (cm)</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.dimensionInput}
                    placeholder="0"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                  />
                </div>
                <div className={styles.dimensionField}>
                  <label className={styles.fieldLabel}>Height (cm)</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.dimensionInput}
                    placeholder="0"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                  />
                </div>
              </div>
              
              <div className={styles.descriptionField}>
                <label className={styles.fieldLabel}>Package Description</label>
                <textarea
                  className={styles.descriptionTextarea}
                  placeholder="Briefly describe the contents (required for safety compliance)"
                  rows={3}
                  value={formData.packageDescription}
                  onChange={(e) => handleInputChange("packageDescription", e.target.value)}
                />
                <div className={styles.fragileOption}>
                  <input type="checkbox" id="fragile" className={styles.checkbox} />
                  <label htmlFor="fragile" className={styles.checkboxLabel}>
                    Fragile - Handle with care
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Speed */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>⏱️</span>
                <h2 className={styles.sectionTitle}>Delivery Speed</h2>
              </div>
              
              <div className={styles.speedOptions}>
                <div className={styles.speedOption}>
                  <input
                    type="radio"
                    id="express"
                    name="deliverySpeed"
                    value="express"
                    checked={formData.deliverySpeed === "express"}
                    onChange={(e) => handleInputChange("deliverySpeed", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="express" className={styles.speedLabel}>
                    <div className={styles.speedHeader}>
                      <span className={styles.speedName}>Express Delivery</span>
                      <div className={styles.speedBadge}>⚡ Fast</div>
                      <span className={styles.speedPrice}>$35.99</span>
                    </div>
                    <p className={styles.speedDescription}>
                      High priority drone with dedicated route • 15-25 minutes
                    </p>
                  </label>
                </div>
                
                <div className={`${styles.speedOption} ${styles.selectedOption}`}>
                  <input
                    type="radio"
                    id="standard"
                    name="deliverySpeed"
                    value="standard"
                    checked={formData.deliverySpeed === "standard"}
                    onChange={(e) => handleInputChange("deliverySpeed", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="standard" className={styles.speedLabel}>
                    <div className={styles.speedHeader}>
                      <span className={styles.speedName}>Standard Delivery</span>
                      <span className={styles.speedPrice}>$25.99</span>
                    </div>
                    <p className={styles.speedDescription}>
                      Regular drone delivery service • 25-40 minutes
                    </p>
                  </label>
                </div>
                
                <div className={styles.speedOption}>
                  <input
                    type="radio"
                    id="economy"
                    name="deliverySpeed"
                    value="economy"
                    checked={formData.deliverySpeed === "economy"}
                    onChange={(e) => handleInputChange("deliverySpeed", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="economy" className={styles.speedLabel}>
                    <div className={styles.speedHeader}>
                      <span className={styles.speedName}>Economy Delivery</span>
                      <span className={styles.speedPrice}>$18.99</span>
                    </div>
                    <p className={styles.speedDescription}>
                      Shared route, budget-friendly option • 45-60 minutes
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Special Instructions</h2>
              <textarea
                className={styles.instructionsTextarea}
                placeholder="Any special delivery instructions (e.g., gate code, specific landing spot, contact recipient)"
                rows={3}
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              />
              
              <div className={styles.additionalOptions}>
                <label className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={formData.requireSignature}
                    onChange={(e) => handleInputChange("requireSignature", e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.optionText}>
                    Require recipient signature (+$2.99)
                  </span>
                </label>
                
                <label className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={formData.photoConfirmation}
                    onChange={(e) => handleInputChange("photoConfirmation", e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.optionText}>
                    Photo confirmation of delivery (Free)
                  </span>
                </label>
                
                <label className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={formData.packageInsurance}
                    onChange={(e) => handleInputChange("packageInsurance", e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.optionText}>
                    Package insurance up to $500 (+$4.99)
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>💳</span>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
              </div>
              
              <div className={styles.paymentOptions}>
                <div className={`${styles.paymentOption} ${styles.selectedPayment}`}>
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="card" className={styles.paymentLabel}>
                    Credit/Debit Card ending in ****4242
                  </label>
                </div>
                
                <div className={styles.paymentOption}>
                  <input
                    type="radio"
                    id="digital"
                    name="paymentMethod"
                    value="digital"
                    checked={formData.paymentMethod === "digital"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="digital" className={styles.paymentLabel}>
                    Digital Wallet (Apple Pay, Google Pay)
                  </label>
                </div>
                
                <div className={styles.paymentOption}>
                  <input
                    type="radio"
                    id="balance"
                    name="paymentMethod"
                    value="balance"
                    checked={formData.paymentMethod === "balance"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                    className={styles.radioInput}
                  />
                  <label htmlFor="balance" className={styles.paymentLabel}>
                    Account Balance ($47.50 available)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Drone Availability */}
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <span className={styles.statusIcon}>🚁</span>
                <h3 className={styles.statusTitle}>Drone Availability</h3>
              </div>
              
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Drones Available</span>
                <span className={`${styles.statusValue} ${styles.online}`}>12 Online</span>
              </div>
              
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Weather Conditions</span>
                <span className={`${styles.statusValue} ${styles.optimal}`}>Optimal</span>
              </div>
              
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Current Demand</span>
                <span className={`${styles.statusValue} ${styles.moderate}`}>Moderate</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryIcon}>📋</span>
                <h3 className={styles.summaryTitle}>Order Summary</h3>
              </div>
              
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Delivery Fee</span>
                <span className={styles.summaryValue}>$25.99</span>
              </div>
              
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Service Fee</span>
                <span className={styles.summaryValue}>$2.99</span>
              </div>
              
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Platform Fee</span>
                <span className={styles.summaryValue}>$1.99</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>$30.97</span>
              </div>
              
              <div className={styles.estimatedDelivery}>
                <span className={styles.deliveryIcon}>⏰</span>
                <div className={styles.deliveryInfo}>
                  <span className={styles.deliveryTime}>Estimated Delivery</span>
                  <span className={styles.deliveryDuration}>30 minutes</span>
                  <span className={styles.deliveryNote}>Based on current traffic and weather</span>
                </div>
              </div>
              
              <button type="submit" className={styles.placeOrderButton}>
                Place Order - $30.97
              </button>
              
              <p className={styles.securityNote}>
                🔒 Secure payment • Insured delivery
              </p>
            </div>

            {/* Safety Guidelines */}
            <div className={styles.guidelinesCard}>
              <div className={styles.guidelinesHeader}>
                <span className={styles.guidelinesIcon}>🛡️</span>
                <h3 className={styles.guidelinesTitle}>Safety & Guidelines</h3>
              </div>
              
              <div className={styles.guideline}>
                <span className={styles.guidelineIcon}>⚠️</span>
                <div className={styles.guidelineText}>
                  <span className={styles.guidelineTitle}>Maximum package weight: 5kg</span>
                  <span className={styles.guidelineDesc}>Larger packages require special handling</span>
                </div>
              </div>
              
              <div className={styles.guideline}>
                <span className={styles.guidelineIcon}>⚠️</span>
                <div className={styles.guidelineText}>
                  <span className={styles.guidelineTitle}>Prohibited items include hazardous materials</span>
                  <span className={styles.guidelineDesc}>See full list in terms of service</span>
                </div>
              </div>
              
              <div className={styles.guideline}>
                <span className={styles.guidelineIcon}>✅</span>
                <div className={styles.guidelineText}>
                  <span className={styles.guidelineTitle}>All deliveries are GPS tracked</span>
                  <span className={styles.guidelineDesc}>Real-time updates via SMS and app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </ResponsiveLayout>
  );
}
