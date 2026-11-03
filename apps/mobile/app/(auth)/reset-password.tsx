import { Colors, FontFamily } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authClient } from '@/lib/auth-client';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { token, error: linkError } = useLocalSearchParams<{ token?: string; error?: string }>();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidLink = !token || !!linkError;

  const handleSubmit = async () => {
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token: token as string,
      });
      if (resetError) {
        setError(resetError.message ?? 'Failed to reset password');
        return;
      }
      Alert.alert('Password updated', 'You can now sign in with your new password.', [
        { text: 'OK', onPress: () => router.replace('/(auth)') },
      ]);
    } catch (err) {
      console.error('Reset password error:', err);
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reset password</Text>
        </View>

        <View style={styles.content}>
          {invalidLink ? (
            <>
              <Text style={[styles.title, { color: colors.text }]}>Link expired</Text>
              <Text style={styles.body}>
                This reset link is invalid or has expired. Request a new one to continue.
              </Text>
              <Link href="/(auth)/forgot-password" asChild>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Request new link</Text>
                </Pressable>
              </Link>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>Choose a new password</Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.floatingLabel, { backgroundColor: colors.background }]}>
                  New password
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
                </Pressable>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.floatingLabel, { backgroundColor: colors.background }]}>
                  Confirm password
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
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
                  <Text style={styles.primaryButtonText}>Update password</Text>
                )}
              </Pressable>
            </>
          )}
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
    paddingRight: 48,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 2,
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
});
