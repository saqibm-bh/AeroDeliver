"use client";
import { useState } from "react";
import styles from "./saved-addresses.module.css";

interface SavedAddress {
  id: string;
  name: string;
  type: 'home' | 'office' | 'other';
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
  isVerified: boolean;
  inDeliveryZone: boolean;
  instructions?: string;
  lastUsed: string;
}

export default function SavedAddresses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    label: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    specialInstructions: ""
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      name: "Home",
      type: "home",
      address: "123 Main Street, Apt 4B",
      city: "San Francisco",
      zipCode: "94102",
      isDefault: true,
      isVerified: true,
      inDeliveryZone: true,
      instructions: "Ring doorbell twice, leave at front door",
      lastUsed: "2 days ago"
    },
    {
      id: "2",
      name: "Office",
      type: "office",
      address: "456 Tech Boulevard, Floor 12",
      city: "San Francisco",
      zipCode: "94105",
      isDefault: false,
      isVerified: true,
      inDeliveryZone: true,
      instructions: "Call when arriving, ask for reception",
      lastUsed: "1 week ago"
    },
    {
      id: "3",
      name: "Mom's House",
      type: "other",
      address: "789 Oak Avenue",
      city: "Berkeley",
      zipCode: "94710",
      isDefault: false,
      isVerified: false,
      inDeliveryZone: false,
      lastUsed: "2 weeks ago"
    }
  ]);

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleDelete = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAddress({
      type: "Home",
      label: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      specialInstructions: ""
    });
  };

  const handleAddAddress = () => {
    if (newAddress.streetAddress && newAddress.city && newAddress.zipCode) {
      const newAddr: SavedAddress = {
        id: (addresses.length + 1).toString(),
        name: newAddress.label || newAddress.type,
        type: newAddress.type.toLowerCase() as 'home' | 'office' | 'other',
        address: newAddress.streetAddress,
        city: newAddress.city,
        zipCode: newAddress.zipCode,
        isDefault: addresses.length === 0,
        isVerified: false,
        inDeliveryZone: true,
        instructions: newAddress.specialInstructions,
        lastUsed: "Never"
      };
      
      setAddresses(prev => [...prev, newAddr]);
      handleModalClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return '🏠';
      case 'office': return '🏢';
      default: return '📍';
    }
  };

  const addressStats = {
    savedAddresses: addresses.length,
    verified: addresses.filter(addr => addr.isVerified).length,
    inDeliveryZone: addresses.filter(addr => addr.inDeliveryZone).length,
    totalDeliveries: 47
  };

  return (
    <div className={styles.savedAddressesContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>Saved Addresses</h1>
            <p className={styles.headerSubtitle}>Manage your delivery locations</p>
          </div>
          <button 
            className={styles.addAddressButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span className={styles.addIcon}>+</span>
            Add Address
          </button>
        </div>
      </div>

      {/* Addresses List */}
      <div className={styles.addressesList}>
        {addresses.map((address) => (
          <div key={address.id} className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <div className={styles.addressTitleSection}>
                <div className={styles.addressIcon}>
                  {getAddressIcon(address.type)}
                </div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressNameRow}>
                    <h3 className={styles.addressName}>{address.name}</h3>
                    <div className={styles.addressBadges}>
                      {address.isDefault && (
                        <span className={styles.defaultBadge}>Default</span>
                      )}
                      {address.isVerified ? (
                        <span className={styles.verifiedBadge}>✓ Verified</span>
                      ) : (
                        <span className={styles.unverifiedBadge}>⚠ Unverified</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.addressDetails}>
                    <p className={styles.addressText}>{address.address}</p>
                    <p className={styles.cityText}>{address.city}, CA {address.zipCode}</p>
                  </div>
                </div>
              </div>
              <div className={styles.addressActions}>
                <button className={styles.editButton} title="Edit">
                  ✏️
                </button>
                <button 
                  className={styles.deleteButton} 
                  title="Delete"
                  onClick={() => handleDelete(address.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

            {address.instructions && (
              <div className={styles.instructionsSection}>
                <span className={styles.instructionsIcon}>📋</span>
                <span className={styles.instructionsText}>{address.instructions}</span>
              </div>
            )}

            <div className={styles.addressFooter}>
              <div className={styles.addressStatus}>
                {address.inDeliveryZone ? (
                  <span className={styles.inZoneStatus}>
                    ✅ In delivery zone
                  </span>
                ) : (
                  <span className={styles.outZoneStatus}>
                    ❌ Outside delivery zone
                  </span>
                )}
                <span className={styles.lastUsed}>
                  ⏰ Last used {address.lastUsed}
                </span>
              </div>
              {!address.isDefault && address.inDeliveryZone && (
                <button 
                  className={styles.setDefaultButton}
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Cards */}
      <div className={styles.actionCardsGrid}>
        <div className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <span className={styles.actionCardIcon}>📍</span>
            <h3 className={styles.actionCardTitle}>Delivery Zones</h3>
          </div>
          <p className={styles.actionCardDescription}>
            Check if your address is in our delivery coverage area.
          </p>
          <button className={styles.actionCardButton}>
            View Coverage Map
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <span className={styles.actionCardIcon}>✓</span>
            <h3 className={styles.actionCardTitle}>Address Verification</h3>
          </div>
          <p className={styles.actionCardDescription}>
            Verify your addresses for faster and more accurate deliveries.
          </p>
          <button className={styles.actionCardButton}>
            Verify All
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <span className={styles.actionCardIcon}>📥</span>
            <h3 className={styles.actionCardTitle}>Import Addresses</h3>
          </div>
          <p className={styles.actionCardDescription}>
            Import addresses from your contacts or previous orders.
          </p>
          <button className={styles.actionCardButton}>
            Import
          </button>
        </div>
      </div>

      {/* Address Usage Statistics */}
      <div className={styles.usageSection}>
        <h2 className={styles.usageTitle}>Address Usage</h2>
        <p className={styles.usageDescription}>
          Your delivery patterns help us optimize drone routes and improve service.
        </p>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{addressStats.savedAddresses}</div>
            <div className={styles.statLabel}>Saved Addresses</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{addressStats.verified}</div>
            <div className={styles.statLabel}>Verified</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{addressStats.inDeliveryZone}</div>
            <div className={styles.statLabel}>In Delivery Zone</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{addressStats.totalDeliveries}</div>
            <div className={styles.statLabel}>Total Deliveries</div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Address</h2>
              <button className={styles.closeButton} onClick={handleModalClose}>
                ×
              </button>
            </div>
            <p className={styles.modalSubtitle}>
              Add a new delivery address to your saved locations.
            </p>

            <div className={styles.modalContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address Type</label>
                  <select 
                    className={styles.formSelect}
                    value={newAddress.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Home, Office"
                    value={newAddress.label}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Street Address</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="123 Main Street, Apt 4B"
                  value={newAddress.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City, State</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="San Francisco, CA"
                    value={newAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>ZIP Code</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="94102"
                    value={newAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Special Instructions (Optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="e.g. Ring doorbell, gate code"
                  value={newAddress.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={handleModalClose}>
                Cancel
              </button>
              <button className={styles.addButton} onClick={handleAddAddress}>
                Add Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
