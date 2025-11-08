// hooks/usePasswordPolicy.ts
import { useMemo } from "react";

export const POLICY_REGEX = {
  minLength: /.{6,}/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumeric: /[0-9]/,
  hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

export const POLICY_LIST = [
  { key: "minLength", label: "Minimum 6 characters" },
  { key: "hasUppercase", label: "An uppercase letter (A-Z)" },
  { key: "hasLowercase", label: "A lowercase letter (a-z)" },
  { key: "hasNumeric", label: "A number (0-9)" },
  { key: "hasSpecial", label: "A special character (!@#...)" },
];

export const usePasswordPolicy = (password: string) => {
  const policyStatus = useMemo(
    () => ({
      minLength: POLICY_REGEX.minLength.test(password),
      hasUppercase: POLICY_REGEX.hasUppercase.test(password),
      hasLowercase: POLICY_REGEX.hasLowercase.test(password),
      hasNumeric: POLICY_REGEX.hasNumeric.test(password),
      hasSpecial: POLICY_REGEX.hasSpecial.test(password),
    }),
    [password]
  );

  const isPolicyMet = useMemo(
    () => Object.values(policyStatus).every((val) => val),
    [policyStatus]
  );

  const unmetRules = POLICY_LIST.filter(
    ({ key }) => !policyStatus[key as keyof typeof policyStatus]
  );

  return { policyStatus, isPolicyMet, unmetRules };
};