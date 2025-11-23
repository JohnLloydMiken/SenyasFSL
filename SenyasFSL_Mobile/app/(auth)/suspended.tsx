import { View, Text } from 'react-native'
import React from 'react'
import AccountSuspended from '@/components/authentication/AccountSuspended'
import { useLocalSearchParams } from 'expo-router'

const suspended = () => {
    const { email } = useLocalSearchParams()

    // Handle the case where email might be an array or undefined
    const emailString = Array.isArray(email) ? email[0] : email || ''
    
    return <AccountSuspended email={emailString} />
}

export default suspended