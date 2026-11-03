import { Colors, FontFamily } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authClient } from '@/lib/auth-client';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const trimmed = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email: trimmed,
        redirectTo: 'smallbreeze-mobile://reset-password',
      });
      if (resetError) {
        setError(resetError.message ?? 'Something went wrong. Please try again.');
        return;
      }
      setSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Forgot password</Text>
        </View>

        <View style={styles.content}>
          {sent ? (
            <>
              <Text style={[styles.title, { color: colors.text }]}>Check your email</Text>
              <Text style={styles.body}>
                If an account exists for {email.trim()}, we&apos;ve sent a link to reset your
                password. It expires in 1 hour.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>Reset your password</Text>
              <Text style={styles.body}>
                Enter your email and we&apos;ll send you a link to choose a new password.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.floatingLabel, { backgroundColor: colors.background }]}>Email</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={[styles.primaryButton, { opacity: loading ? 0.7 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send reset link</Text>
                )}
              </Pressable>
            </>
          )}

          <Link href="/(auth)" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Back to sign in</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.semiBold },
  content: { flex: 1, paddingHorizontal: 24, gap: 16 },
  title: { fontSize: 24, fontFamily: FontFamily.bold, marginTop: 32 },
  body: { fontSize: 15, color: '#666', fontFamily: FontFamily.regular, marginBottom: 8 },
  inputContainer: { position: 'relative' },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    top: 8,
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    fontSize: 16,
  },
  errorText: { color: '#FF6B6B', fontSize: 14 },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: FontFamily.semiBold },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#666', fontSize: 16, fontFamily: FontFamily.medium },
});
