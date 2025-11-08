// components/main_interface/profile/TermsModal.tsx
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

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose }) => {
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
            <Text style={styles.headerText}>Terms and Conditions</Text>
            {/* You can add a close icon here if you prefer */}
          </View>
          {/* END: Header */}

          {/* START: Scrollable Content */}
          <ScrollView style={styles.scrollContainer}>
            <SubText>Last updated: October 2025</SubText>
            <Paragraph>
              These Terms & Conditions ("Terms") govern your use of SenyasFSL.
              By accessing or using SenyasFSL (web or mobile), you agree to
              these Terms. If you do not agree, do not use the Service.
            </Paragraph>

            <SectionHeading>1. Description of Service</SectionHeading>
            <Paragraph>
              SenyasFSL is a cross-platform Filipino Sign Language learning
              system offering lessons, mini-games, gesture recognition using
              your camera, an in-game shop ("Treasure"), a dictionary, and
              profile/leaderboards. The Service is provided via web (React) and
              mobile (React Native).
            </Paragraph>

            <SectionHeading>2. Accounts & Eligibility</SectionHeading>
            <Paragraph>
              To use certain features, you must register an account with a
              unique username and a valid email. You are responsible for
              maintaining the confidentiality of your password. You must be the
              minimum age required by law to create an account or have parental
              consent.
            </Paragraph>

            <SectionHeading>3. User Conduct</SectionHeading>
            <Paragraph>
              You agree to: Provide accurate and up-to-date information; Use the
              Service only for lawful purposes; Not exploit, hack, cheat, or
              manipulate game mechanics or items; Respect privacy and not record
              or share other people's data without consent.
            </Paragraph>

            <SectionHeading>4. Items, Currencies & Purchases</SectionHeading>
            <Paragraph>
              The Service uses virtual currency ("SenyasCoins") and virtual
              items (e.g., XP Multiply, Bomb, Skip, 2× Try, Streak Protect).
              These have no monetary value outside SenyasFSL. Items are subject
              to rules and may be changed or revoked at our discretion if
              abused. Items are non-transferable and non-redeemable.
            </Paragraph>

            <SectionHeading>5. Intellectual Property</SectionHeading>
            <Paragraph>
              All content in the Service—code, text, video, graphics,
              trademarks, and models—is owned or licensed by us. You may not
              copy, distribute, or create derivative works without permission.
            </Paragraph>

            <SectionHeading>6. Privacy</SectionHeading>
            <Paragraph>
              Your use of the Service is governed by our Privacy Policy, which
              is incorporated by reference into these Terms.
            </Paragraph>

            <SectionHeading>7. Termination & Suspension</SectionHeading>
            <Paragraph>
              We may suspend or terminate accounts for violations of these
              Terms, at our discretion. Upon termination you may lose access to
              progress and items.
            </Paragraph>

            <SectionHeading>8. Disclaimers & Limitations</SectionHeading>
            <Paragraph>
              The Service is provided "as is." To the maximum extent permitted
              by law, we disclaim warranties and will not be liable for
              indirect, incidental, or consequential damages arising from your
              use of the Service.
            </Paragraph>

            <SectionHeading>9. Updates to Terms</SectionHeading>
            <Paragraph>
              We may update these Terms. Continued use after changes indicates
              acceptance. We will post the "Last updated" date and notify users
              as appropriate.
            </Paragraph>

            <SectionHeading>10. Governing Law</SectionHeading>
            <Paragraph>
              These Terms are governed by the laws of the Republic of the
              Philippines. Any disputes will be subject to the jurisdiction of
              the courts of Tarlac, Philippines.
            </Paragraph>

            <SectionHeading>11. Contact</SectionHeading>
            <Paragraph>
              For questions or notices regarding these Terms, contact:
              s3nyasfsl@gmail.com.
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

export default TermsModal;
