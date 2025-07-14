import React, { createContext, useContext, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

type SheetType = 'streak' | 'editData' | 'editPass'| null;

type BottomSheetContextType = {
  bottomSheetRef: React.RefObject<BottomSheet | null> ;
  openSheet: () => void;
  closeSheet: () => void;
  isSheetOpen: boolean;
  sheet: SheetType;
  handleSheetChanges: (index: number) => void;
  handleSheetRender: (whatSheet: SheetType) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [sheet, setSheet] = useState<SheetType>(null);
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
    setIsSheetOpen(index >= 0);
  };

  const handleSheetRender = (whatSheet: SheetType) => {
    setSheet(whatSheet);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        bottomSheetRef,
        openSheet,
        closeSheet,
        isSheetOpen,
        sheet,
        handleSheetChanges,
        handleSheetRender,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
