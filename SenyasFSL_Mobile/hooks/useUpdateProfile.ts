// hooks/useUpdateProfile.ts
import { useState } from 'react';
import { reauthenticateUser, updateUserProfile } from '@/services/AuthService';
import { UpdateUserProfileData } from '@/shared/types/auth';
import { useAuthStore } from '@/utils/store/useAuthStore';

export const useUpdateProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  const updateProfile = async (
    newUsername: string,
    defaultUsername: string,
    currentPassword: string,
    emailNotifications?: boolean
  ) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Re-authenticate the user
      await reauthenticateUser(currentPassword);

      // 2. Build the data object with changes
      const dataToUpdate: UpdateUserProfileData = {};
      
      if (newUsername !== defaultUsername) {
        dataToUpdate.newUsername = newUsername;
      }

      // Add email notifications if provided
      if (emailNotifications !== undefined) {
        dataToUpdate.emailNotifications = emailNotifications;
      }

      // 3. If there are changes, call the update function
      if (Object.keys(dataToUpdate).length > 0) {
        await updateUserProfile(dataToUpdate);
        
        // 4. Refresh the user's token to get new claims
        if (user) {
          await user.getIdToken(true);
        }
      } else {
        console.log("No profile changes detected, skipping update call.");
      }

      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      setIsSaving(false);
      setSaveError(error as Error);
      throw error;
    }
  };

  return { updateProfile, isSaving, saveError };
};