"use client";
import { useState } from "react";
import styles from "./support.module.css";

export default function Support() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);

  const helpTopics = [
    {
      id: "order-tracking",
      icon: "📦",
      title: "Order & Tracking",
      description: "Track your deliveries, modify orders, and delivery status",
      links: [
        "Where is my order?",
        "Modify delivery address",
        "Delivery notifications",
        "Failed deliveries"
      ]
    },
    {
      id: "delivery-zones",
      icon: "📍",
      title: "Delivery Zones",
      description: "Service areas, delivery times, and location requirements",
      links: [
        "Check delivery availability",
        "Landing zone requirements",
        "Delivery restrictions",
        "Weather delays"
      ]
    },
    {
      id: "safety-security",
      icon: "🛡️",
      title: "Safety & Security",
      description: "Drone safety, privacy, and security information",
      links: [
        "Drone safety protocols",
        "Privacy protection",
        "Emergency procedures",
        "Noise concerns"
      ]
    },
    {
      id: "billing-payments",
      icon: "💳",
      title: "Billing & Payments",
      description: "Payment methods, charges, and billing questions",
      links: [
        "Payment methods",
        "Delivery fees",
        "Refunds & credits",
        "Billing issues"
      ]
    },
    {
      id: "delivery-times",
      icon: "⏰",
      title: "Delivery Times",
      description: "Scheduling, time slots, and delivery windows",
      links: [
        "Delivery schedules",
        "Express delivery",
        "Time slot booking",
        "Delivery delays"
      ]
    },
    {
      id: "account-app",
      icon: "🎧",
      title: "Account & App",
      description: "Account management and app troubleshooting",
      links: [
        "Account settings",
        "App issues",
        "Password reset",
        "Notifications"
      ]
    }
  ];

  const faqs = [
    {
      id: "delivery-time",
      question: "How long does drone delivery take?",
      answer: "Most deliveries are completed within 15-30 minutes depending on distance and weather conditions. Express deliveries can be completed in as little as 10 minutes."
    },
    {
      id: "delivery-areas",
      question: "What areas do you deliver to?",
      answer: "We currently serve urban and suburban areas within a 10km radius of our distribution centers. Check our coverage map for specific availability in your area."
    },
    {
      id: "order-items",
      question: "What can I order for drone delivery?",
      answer: "We deliver packages up to 5kg including food, medical supplies, electronics, and general merchandise. Prohibited items include hazardous materials and fragile items over certain size limits."
    },
    {
      id: "track-delivery",
      question: "How do I track my drone delivery?",
      answer: "You can track your delivery in real-time through our app or website. You'll receive notifications at key stages and can view the drone's live location during transit."
    },
    {
      id: "bad-weather",
      question: "What happens if the weather is bad?",
      answer: "Deliveries may be delayed or rescheduled during severe weather conditions for safety reasons. You'll be notified immediately if weather affects your delivery."
    },
    {
      id: "drone-landing",
      question: "How does the drone land and deliver my package?",
      answer: "Our drones use precision landing technology to safely deliver to designated landing zones like backyards, balconies, or approved delivery areas."
    },
    {
      id: "not-home",
      question: "What if I'm not home during delivery?",
      answer: "Packages can be left in secure designated areas if pre-authorized. Otherwise, the drone will return to base and we'll reschedule the delivery."
    },
    {
      id: "drone-safety",
      question: "Are drone deliveries safe?",
      answer: "Yes, our drones are equipped with multiple safety systems including obstacle avoidance, emergency landing protocols, and are operated by certified pilots."
    }
  ];

  const contactMethods = [
    {
      id: "live-chat",
      icon: "💬",
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      primary: true
    },
    {
      id: "phone-support",
      icon: "📞",
      title: "Phone Support",
      description: "Call us for urgent delivery issues",
      availability: "6 AM - 10 PM",
      action: "1-800-DRONE-GO",
      primary: false
    },
    {
      id: "email-support",
      icon: "✉️",
      title: "Email Support",
      description: "Send detailed questions and get thorough responses",
      availability: "2-4 hour response",
      action: "support@dronedelivery.com",
      primary: false
    }
  ];

  const toggleFaq = (faqId: string) => {
    setSelectedFaq(selectedFaq === faqId ? null : faqId);
  };

  return (
    <div className={styles.supportContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>How can we help you today?</h1>
          <p className={styles.headerSubtitle}>
            Get support for your drone deliveries, track orders, and find answers to common questions.
          </p>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for help articles..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className={styles.quickActions}>
            <button className={styles.quickActionBtn}>
              📞 Call Support
            </button>
            <button className={styles.quickActionBtnPrimary}>
              💬 Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Browse Help Topics */}
      <section className={styles.helpTopicsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse Help Topics</h2>
          <p className={styles.sectionSubtitle}>Find answers organized by category</p>
        </div>

        <div className={styles.topicsGrid}>
          {helpTopics.map((topic) => (
            <div key={topic.id} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <div className={styles.topicIcon}>{topic.icon}</div>
                <div className={styles.topicInfo}>
                  <h3 className={styles.topicTitle}>{topic.title}</h3>
                  <p className={styles.topicDescription}>{topic.description}</p>
                </div>
              </div>
              <div className={styles.topicLinks}>
                {topic.links.map((link, index) => (
                  <a key={index} href="#" className={styles.topicLink}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Quick answers to the most common questions about drone delivery</p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFaq(faq.id)}
              >
                <span>{faq.question}</span>
                <span className={`${styles.faqIcon} ${selectedFaq === faq.id ? styles.faqIconRotated : ''}`}>
                  ▼
                </span>
              </button>
              {selectedFaq === faq.id && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className={styles.contactSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <p className={styles.sectionSubtitle}>Multiple ways to reach our support team</p>
        </div>

        <div className={styles.contactGrid}>
          {contactMethods.map((method) => (
            <div key={method.id} className={styles.contactCard}>
              <div className={styles.contactIcon}>{method.icon}</div>
              <h3 className={styles.contactTitle}>{method.title}</h3>
              <p className={styles.contactDescription}>{method.description}</p>
              <div className={styles.contactAvailability}>
                <span className={styles.availabilityIcon}>🕒</span>
                {method.availability}
              </div>
              <button 
                className={method.primary ? styles.contactBtnPrimary : styles.contactBtnSecondary}
              >
                {method.action}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
