// components/main_interface/profile/PrivacyModal.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { SectionHeading, Paragraph, SubText } from "./LegalTextComponents";
import Authbutton from "@/components/authentication/button"; // Assuming path is correct

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* START: Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Privacy Policy</Text>
          </View>
          {/* END: Header */}

          {/* START: Scrollable Content */}
          <ScrollView style={styles.scrollContainer}>
            <SubText>Last updated: October 2025</SubText>
            <Paragraph>
              SenyasFSL provides a Filipino Sign Language learning application.
              This Privacy Policy explains how we collect, use, disclose,
              retain, and protect personal data in accordance with the Data
              Privacy Act of 2012 (R.A. 10173) and other applicable Philippine
              laws.
            </Paragraph>

            <SectionHeading>1. Information We Collect</SectionHeading>
            <Paragraph>
              Account data: username, email address, user ID.
              {"\n"}Profile data: display name and reason for signing up.
              {"\n"}Progress & gameplay: levels completed, XP, SenyasCoins,
              achievements, streaks, inventory.
              {"\n"}Gesture / recognition data: camera sessions, prediction
              results, model metadata (only if you consent).
              {"\n"}Communications: support requests, feedback or reports you
              submit.
            </Paragraph>

            <SectionHeading>2. How We Collect Data</SectionHeading>
            <Paragraph>
              We collect data when you register, use the web application,
              interact with lessons or mini-games, or contact support. Some data
              (analytics, diagnostics) are collected automatically.
            </Paragraph>

            <SectionHeading>3. Purposes of Processing</SectionHeading>
            <Paragraph>
              Provide and maintain the web application, synchronize progress
              across devices, and enable gameplay features.
              {"\n"}Power gesture recognition and camera-based learning
              experiences.
              {"\n"}Support account management, authentication, and security.
              {"\n"}Analyze and improve the Web Application (analytics,
              debugging, product development).
              {"\n"}Deliver email notifications for streak reminder.
              {"\n"}Detect and prevent fraud, cheating, and abuse.
            </Paragraph>

            <SectionHeading>4. Legal Basis & Consent</SectionHeading>
            <Paragraph>
              By registering for and using SenyasFSL, you consent to the
              collection and processing of some of your personal data for the
              purposes stated in this Policy. You may withdraw consent where
              processing is based on consent; some features may become
              unavailable if you withdraw consent (for example, camera-based
              gesture recognition).
            </Paragraph>

            <SectionHeading>5. Data Sharing & Third Parties</SectionHeading>
            <Paragraph>
              We may share personal data with: Service providers (hosting,
              analytics, cloud storage) under confidentiality obligations; Legal
              authorities when required by law or to protect rights; Other
              parties with your explicit consent.
              {"\n"}We do not sell personal data.
            </Paragraph>

            <SectionHeading>6. Data Retention & Deletion</SectionHeading>
            <Paragraph>
              We retain personal data while your account exists, but we do not
              hold those data after you purposely deleted your account.
            </Paragraph>

            <SectionHeading>7. Your Rights</SectionHeading>
            <Paragraph>
              Under the Data Privacy Act you have the right to: Access and
              obtain a copy of your personal data; Request correction of
              inaccurate data; Request deletion, blocking or removal of personal
              data when no longer necessary; Withdraw consent to processing
              (where applicable); Be notified of data breaches affecting your
              personal data.
              {"\n"}To exercise these rights, contact us at s3nyasfsl@gmail.com.
            </Paragraph>

            <SectionHeading>8. Security</SectionHeading>
            <Paragraph>
              We implement technical and organizational measures—encryption,
              access controls, and monitoring—to protect personal data. We
              follow National Privacy Commission guidance and industry best
              practices. No system is 100% secure; in case of a breach we will
              follow NPC notification requirements.
            </Paragraph>

            <SectionHeading>9. Cookies & Analytics</SectionHeading>
            <Paragraph>
              We do not use cookies and similar technologies. However, for
              analytics and performance, we do have an admin module that can see
              sign up reasons and accounts registered within the game.
            </Paragraph>

            <SectionHeading>10. Children</SectionHeading>
            <Paragraph>
              The Service is not intended for children below the age required by
              local law to register without parental consent. If you are a
              parent or guardian and discover your child has created an account
              without consent, contact us to request deletion.
            </Paragraph>

            <SectionHeading>11. Changes to This Policy</SectionHeading>
            <Paragraph>
              We may update this Policy from time to time. We will post the
              updated policy with the "Last updated" date and, when required,
              notify users. Continued use after changes constitutes acceptance.
            </Paragraph>

            <SectionHeading>12. Governing Law</SectionHeading>
            <Paragraph>
              This Policy is governed by the laws of the Republic of the
              Philippines. For questions, contact:
              {"\n"}Email: s3nyasfsl@gmail.com
            </Paragraph>
          </ScrollView>
          {/* END: Scrollable Content */}

          {/* Close Button */}
          <View style={styles.closeButtonContainer}>
            <Authbutton content="Close" onPress={onClose} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAF3E0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E0D5B9",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    color: "#3C3C3C",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20, // Space for the close button
  },
  closeButtonContainer: {
    width: "100%",
    paddingTop: 10, // Add some space above the button
  },
});

export default PrivacyModal;
