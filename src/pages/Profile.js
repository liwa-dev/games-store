import React, { useState } from 'react';
import styles from '../styles/Profile.module.css';
import CustomInput from '../libs/CustomInput';
import Button from '../libs/Button';
import { useModal } from '../provider/ModalProvider';
import Avatar from '../libs/Avatar';
import ImageSelectionPanel from '../libs/ImageSelectionPanel';

function Profile() {
  const { openModal } = useModal();
  const [firstName, setFirstName] = useState('Tim');
  const [lastName, setLastName] = useState('Cook');
  const [phoneNumber, setPhoneNumber] = useState('(408) 996-1010');
  const [email, setEmail] = useState('tcook@apple.com');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('America');
  const [zipcode, setZipcode] = useState('10001');
  const [address, setAddress] = useState('1 Infinite Loop');

  const handleSave = () => {
    openModal(
      <div>
        <h2>Profile Updated</h2>
        <p>Your profile information has been updated successfully.</p>
      </div>,
      { showCancel: false, showOk: true }
    );
  };

  const handleAvatarClick = () => {
    openModal(
      <ImageSelectionPanel />,
      { showCancel: true, showOk: true }
    );
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileSummary}>
        <div className={styles.coverPhoto}>
          <button className={styles.changeCoverButton}>Change Cover</button>
        </div>
        <div className={styles.profileImageContainer}>
          <Avatar 
            src="https://randomuser.me/api/portraits/men/1.jpg" 
            alt="Profile" 
            size={100} 
            onClick={handleAvatarClick}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2>Tim Cook</h2>
          <p>CEO of Apple</p>
          <div className={styles.profileStats}>
            <div>Opportunities applied <span className={styles.applied}>32</span></div>
            <div>Opportunities won <span className={styles.won}>26</span></div>
            <div>Current opportunities <span className={styles.current}>6</span></div>
          </div>
        </div>
      </div>
      <div className={styles.profileForm}>
        <h2>Account Settings</h2>
        <div className={styles.formRow}>
          <CustomInput wid={'100%'} style="fading" alignment="left" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          <CustomInput wid={'100%'} style="fading" alignment="left" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
        </div>
        <div className={styles.formRow}>
          <CustomInput wid={'100%'} style="fading" alignment="left" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
          <CustomInput wid={'100%'} style="fading" alignment="left" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
        </div>
        <div className={styles.formRow}>
          <CustomInput wid={'100%'} style="fading" alignment="left" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
          <CustomInput wid={'100%'} style="fading" alignment="left" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        </div>
        <div className={styles.formRow}>
          <CustomInput wid={'100%'} style="fading" alignment="left" value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder="Zipcode" />
        </div>
        <CustomInput wid={'100%'} style="multiline" alignment="left" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        <div className={styles.updateButton}>
          <Button color={'blue'} onClick={handleSave}>Update</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;