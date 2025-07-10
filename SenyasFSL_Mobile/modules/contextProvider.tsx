// context/BottomSheetContext.tsx
import React, { createContext, useContext, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext<any>(null);

export const BottomSheetProvider = ({ children }: any) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = () => {
    bottomSheetRef.current?.expand();
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
    setIsSheetOpen(false);
  };

  const handleSheetChanges = (index: number) => {
    setIsSheetOpen(index >= 0); // 0 or more = visible
  };

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef, openSheet, closeSheet, isSheetOpen, handleSheetChanges }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
