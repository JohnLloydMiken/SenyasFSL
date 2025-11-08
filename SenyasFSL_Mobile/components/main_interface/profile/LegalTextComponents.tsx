// components/main_interface/profile/LegalTextComponents.tsx
import React from 'react';
import { Text } from 'react-native';

// Shared text component for headings in legal modals
export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontFamily: "PoppinsBold",
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
      color: "#3C3C3C",
    }}
  >
    {children}
  </Text>
);

// Shared text component for paragraphs in legal modals
export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontFamily: "PoppinsRegular",
      fontSize: 15,
      marginBottom: 12,
      lineHeight: 22,
      color: "#525252",
    }}
  >
    {children}
  </Text>
);

// Shared text component for sub-text (like dates) in legal modals
export const SubText = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontFamily: "PoppinsRegular",
      fontSize: 14,
      marginBottom: 16,
      color: "#6C6C6C",
    }}
  >
    {children}
  </Text>
);