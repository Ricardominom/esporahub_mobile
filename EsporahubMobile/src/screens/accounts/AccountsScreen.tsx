import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';
import { RootStackParamList } from '../../types/navigation';
import { Account } from '../../types';

type AccountsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Accounts'>;

const { width } = Dimensions.get('window');

const AccountsScreen: React.FC = () => {
  const navigation = useNavigation<AccountsScreenNavigationProp>();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const [selectedTab, setSelectedTab] = useState<'active' | 'inactive'>('active');

  const accounts: Account[] = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: '#007AFF', isActive: true },
    { id: 2, name: 'María García', position: 'Gobernadora', color: '#34C759', isActive: true },
    { id: 3, name: 'Carlos López', position: 'Diputado', color: '#AF52DE', isActive: false },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: '#FF3B30', isActive: true },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: '#FF9500', isActive: false },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: '#5AC8FA', isActive: true },
  ];

  const filteredAccounts = accounts.filter(account => 
    selectedTab === 'active' ? account.isActive : !account.isActive
  );

  const handleAccountPress = (account: Account) => {
    navigation.navigate('Checklist', { 
      clientName: `${account.name} - ${account.position}` 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Cuentas"
        subtitle="Gestión de cuentas del sistema"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View style={[styles.tabSelector, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => setSelectedTab('active')}
            style={[
              styles.tab,
              selectedTab === 'active' && { backgroundColor: colors.primary }
            ]}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'active' ? '#FFFFFF' : colors.text }
            ]}>
              Activas ({accounts.filter(a => a.isActive).length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSelectedTab('inactive')}
            style={[
              styles.tab,
              selectedTab === 'inactive' && { backgroundColor: colors.primary }
            ]}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'inactive' ? '#FFFFFF' : colors.text }
            ]}>
              Inactivas ({accounts.filter(a => !a.isActive).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accounts Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.accountsGrid}>
          {filteredAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => handleAccountPress(account)}
              style={styles.accountItem}
              activeOpacity={0.8}
            >
              <Card style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: account.isActive ? colors.success : colors.error }
                  ]} />
                  <View style={[styles.accountAvatar, { backgroundColor: account.color }]}>
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                  </View>
                </View>
                
                <Text style={[styles.accountName, { color: colors.text }]}>
                  {account.name}
                </Text>
                <Text style={[styles.accountPosition, { color: colors.textSecondary }]}>
                  {account.position}
                </Text>
                
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: account.isActive ? 
                      `${colors.success}20` : `${colors.error}20`,
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    {
                      color: account.isActive ? colors.success : colors.error,
                    }
                  ]}>
                    {account.isActive ? 'Activa' : 'Inactiva'}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Account Button */}
        <View style={styles.createButtonContainer}>
          <Button
            title="Crear nueva cuenta"
            onPress={() => console.log('Create account')}
            icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
            style={styles.createButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  accountItem: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  accountCard: {
    alignItems: 'center',
    padding: 20,
    minHeight: 180,
  },
  accountHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  statusDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  accountAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  accountName: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginBottom: 4,
  },
  accountPosition: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.xs,
  },
  createButtonContainer: {
    paddingVertical: 20,
  },
  createButton: {
    width: '100%',
  },
});

export default AccountsScreen;