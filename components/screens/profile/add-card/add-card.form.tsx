import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { layoutTheme } from '@/config/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemeType } from '@/types/theme.type';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCardStore } from '@/state/cardsStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from 'expo-router';

const cardSchema = z.object({
  cardNumber: z.string().min(16, "Kart nömrəsi 16 rəqəmli olmalıdır").max(19),
  cardHolderName: z.string().min(3, "Ad soyad daxil edilməlidir"),
  cardExpirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "MM/YY formatında olmalıdır"),
  cardCvv: z.string().min(3, "CVV 3 rəqəmli olmalıdır").max(4),
});

type CardFormData = z.infer<typeof cardSchema>;

const AddCardForm = () => {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const addCard = useCardStore((state) => state.addCard);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      cardHolderName: '',
      cardExpirationDate: '',
      cardCvv: '',
    }
  });

  const watchedCardNumber = watch('cardNumber');
  const watchedHolderName = watch('cardHolderName');
  const watchedExpiry = watch('cardExpirationDate');

  const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const onSubmit = (data: CardFormData) => {
    addCard({
      id: Math.random().toString(36).substr(2, 9),
      ...data
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Visual Card Preview */}
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.cardPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={32} color="white" />
            <Text style={styles.cardVendor}>VISA</Text>
          </View>
          
          <Text style={styles.previewNumber}>
            {formatCardNumber(watchedCardNumber) || '**** **** **** ****'}
          </Text>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerLabel}>KART SAHİBİ</Text>
              <Text style={styles.footerValue}>{watchedHolderName.toUpperCase() || 'AD SOYAD'}</Text>
            </View>
            <View>
              <Text style={styles.footerLabel}>BİTMƏ TARİXİ</Text>
              <Text style={styles.footerValue}>{watchedExpiry || 'MM/YY'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Input Fields */}
        <View style={styles.form}>
          <InputLabel label="Kart Nömrəsi" />
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={[styles.inputWrapper, errors.cardNumber && styles.inputError]}>
                <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={16}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}

          <InputLabel label="Ad Soyad" />
          <Controller
            control={control}
            name="cardHolderName"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={[styles.inputWrapper, errors.cardHolderName && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Məs: ELVİN HÜSEYNOV"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName.message}</Text>}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputLabel label="Bitmə Tarixi" />
              <Controller
                control={control}
                name="cardExpirationDate"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={[styles.inputWrapper, errors.cardExpirationDate && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        if (text.length === 2 && !text.includes('/')) {
                          onChange(text + '/');
                        } else {
                          onChange(text);
                        }
                      }}
                    />
                  </View>
                )}
              />
              {errors.cardExpirationDate && <Text style={styles.errorText}>{errors.cardExpirationDate.message}</Text>}
            </View>

            <View style={{ width: 20 }} />

            <View style={{ flex: 1 }}>
              <InputLabel label="CVV" />
              <Controller
                control={control}
                name="cardCvv"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={[styles.inputWrapper, errors.cardCvv && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="***"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.cardCvv && <Text style={styles.errorText}>{errors.cardCvv.message}</Text>}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Kartı Əlavə Et</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputLabel = ({ label }: { label: string }) => {
  const { colorScheme } = useTheme();
  return <Text style={[
    { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' }
  ]}>{label}</Text>;
};

const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  cardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardVendor: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  previewNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  form: {
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1F2937' : '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme === 'dark' ? '#F9FAFB' : '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: layoutTheme.colors.secondary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: layoutTheme.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddCardForm;
