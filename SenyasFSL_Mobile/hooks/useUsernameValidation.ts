// hooks/useUsernameValidation.ts
import { useState, useEffect, useCallback } from 'react';
import { checkUsername } from '@/services/AuthService';
import { useDebounce } from '@/hooks/useDebounce'; // We'll add this simple hook below

// --- A. Username Regex Validator ---
const USERNAME_REGEX = /^[a-z0-9_\\-]{3,20}$/;
const validateUsernameFormat = (username: string) => {
  return USERNAME_REGEX.test(username);
};

// --- B. The Main Hook ---
export const useUsernameValidation = (
  defaultUsername: string,
  isInitiallyValid = true
) => {
  const [username, setUsername] = useState(defaultUsername);
  const [isValidFormat, setIsValidFormat] = useState(isInitiallyValid);
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  
  // Use a debounce hook to avoid checking on every keystroke
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    // Reset to default username (e.g., when modal opens)
    setUsername(defaultUsername);
    setStatus('idle');
  }, [defaultUsername]);

  const performCheck = useCallback(async () => {
    // 1. Check format first
    const isValid = validateUsernameFormat(debouncedUsername);
    setIsValidFormat(isValid);

    if (!isValid) {
      setStatus('invalid');
      return;
    }

    // 2. Check if it's the same as the original
    if (debouncedUsername === defaultUsername) {
      setStatus('idle');
      return;
    }

    // 3. If valid and different, check availability in database
    setStatus('checking');
    try {
      const result = await checkUsername(debouncedUsername);
      if (result.isAvailable) {
        setStatus('available');
      } else {
        setStatus('taken');
      }
    } catch (error) {
      console.error("Username check failed:", error);
      setStatus('idle'); // Set to idle on error
    }
  }, [debouncedUsername, defaultUsername]);

  useEffect(() => {
    performCheck();
  }, [performCheck]);

  return {
    username,
    setUsername,
    status,
    isValidFormat,
  };
};

