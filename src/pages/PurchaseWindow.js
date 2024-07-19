import React, { useEffect, useState } from "react";
import styles from "../styles/PurchaseWindow.module.css";
import Button from "../libs/Button";
import { ArrowLeftFromLine, CreditCard, Info } from "lucide-react";

import POST from '../imgs/POST.png'
import FLOUCI from '../imgs/FLOUCI.png'
import { useNotification } from "../provider/NotificationProvider";
import { useLanguage } from "../provider/LanguageProvider";
import { convertCurrency } from "../asset/CurrencyConvert";

const TAX_RATE = 0.19; // Define the tax rate

const PurchaseWindow = ({ onTogglePerspective, data }) => {
  const [amount, setAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const {notifySuccess, notifyError, notifyWarning, notifyInfo} = useNotification();
  const { translations } = useLanguage();

  useEffect(() => {
    if (data && data.plans && data.plans.length > 0) {
      handleAmountSelection(parseFloat(data.plans[0].price) || 0);
    }
  }, [data]);

  const handleAmountSelection = (selectedAmount) => {
    setAmount(parseFloat(selectedAmount) || 0);
  };

  useEffect(() => {
    // Calculate tax and total amount whenever amount changes
    const calculatedTaxAmount = (amount || 0) * TAX_RATE;
    const calculatedTotalAmount = (amount || 0) + calculatedTaxAmount;
    setTaxAmount(calculatedTaxAmount);
    setTotalAmount(calculatedTotalAmount);
  }, [amount]);


  function getColorByPrice(price) {
    console.log(price);
    if (price <= 5) {
      return '#8BC34A'; // Light green for 3.07 TND
    } else if (price <= 20) {
      return '#2196F3'; // Blue for 15.48 TND and 15.47 TND
    } else if (price <= 50) {
      return '#F44336'; // Red for 46.49 TND
    } else if (price <= 100) {
      return '#FFC107'; // Amber for 93.01 TND
    } else if (price <= 200) {
      return '#800080'; // Deep Orange for 155.04 TND
    } else {
      return '#E91E63'; // Pink for 310.12 TND
    }
  }

  const handlePayment = () => {
    if (amount == 0 || selectedPaymentMethod == null) {
      notifyError("Veuillez sélectionner un montant et un mode de paiement");
    } else {
      notifySuccess("Paiement effectué");
    }
  }

  const formatNumber = (value) => {
    return (value || 0).toFixed(2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button color={"red"} onClick={() => {
          onTogglePerspective();
          document.body.style.overflow = 'hidden';
        }}><ArrowLeftFromLine /></Button>
        <h1>{data?.name || 'Product'}</h1>
      </div>  
      <div className={styles.content}>
        <div className={styles.left}>
          <img src={data?.image || data?.coverImage} alt={data?.name} />
          <div className={styles.productInfo}>
            <h2>{data?.plans?.[0]?.price || 'Loading'}<span className={styles.currency}>TND</span></h2>
            <p className={styles.planPrice}>{data?.plans?.[0]?.name || 'Default Plan'} </p>
            <p><Info /> Information: </p>
            {data?.description || 'No description available'}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.card}>
            {console.log(translations)}
            <h3>1. {translations?.purchese?.montant || "Loading"}</h3>
            <div className={styles.amountOptions}>
              {data.plans ? data.plans.map((plan) => (
                <Button
                  key={plan.id}
                  style={{
                    backgroundColor: getColorByPrice(plan.price),
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    opacity: parseFloat(plan.price) === amount ? 1 : 0.6,
                    transform: parseFloat(plan.price) === amount ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: parseFloat(plan.price) === amount ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleAmountSelection(plan.price)}
                >
                  {console.log(plan)}
                  {plan.name} {plan.price}TND
                </Button>
              )) : <p>No plans available</p>}
            </div>
          </div>
          <div className={styles.card}>
            <h3>2. {translations?.purchese?.payment || "Loading"}</h3>
            <div className={styles.paymentOptions}>
              <button
                className={`${styles.paymentButton} ${selectedPaymentMethod === 'FLOUCI' ? styles.active : ''}`}
                onClick={() => setSelectedPaymentMethod('FLOUCI')}
              >
                <img className={styles.paymentLogo} src={FLOUCI} alt="FLOUCI" />
                <span>Flouci wallet</span>
              </button>
              <button
                className={`${styles.paymentButton} ${selectedPaymentMethod === 'VISA' ? styles.active : ''}`}
                onClick={() => setSelectedPaymentMethod('VISA')}
              >
                <CreditCard />
                <span>Carte bancaire (Mastercard, VISA)</span>
              </button>
              <button
                className={`${styles.paymentButton} ${selectedPaymentMethod === 'POST' ? styles.active : ''}`}
                onClick={() => setSelectedPaymentMethod('POST')}
              >
                <img className={styles.paymentLogo} src={POST} alt="POST" />
                <span>Carte e-dinar</span>
              </button>
            </div>
          </div>
          <div className={styles.card}>
            <h3>3. {translations?.purchese?.confirmation || "Loading"}</h3>
            <p>{translations?.purchese?.montant2 || "Loading"}: {formatNumber(amount)}</p>
            <p>TVA (19%): {formatNumber(taxAmount)}</p>
            <p>{translations?.purchese?.total || "Loading"}: {formatNumber(totalAmount)} <span className={styles.currency}>TND</span></p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button style={{ width: "20%", padding: "15px" }} color="blue" onClick={handlePayment}>
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseWindow;