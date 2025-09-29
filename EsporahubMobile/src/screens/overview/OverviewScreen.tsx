import React from 'react';
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
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';
import { RootStackParamList } from '../../types/navigation';

type OverviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Overview'>;

const { width } = Dimensions.get('window');

interface OverviewItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
  screen?: keyof RootStackParamList;
}

const OverviewScreen: React.FC = () => {
  const navigation = useNavigation<OverviewScreenNavigationProp>();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const overviewItems: OverviewItem[] = [
    {
      id: 'active-accounts',
      title: 'Cuentas activas',
      subtitle: 'Gestionar cuentas activas',
      icon: 'checkmark-circle-outline',
      color: '#34C759',
      count: 4,
      screen: 'Accounts',
    },
    {
      id: 'inactive-accounts',
      title: 'Cuentas inactivas',
      subtitle: 'Revisar y reactivar',
      icon: 'close-circle-outline',
      color: '#FF3B30',
      count: 2,
    },
    {
      id: 'tasks',
      title: 'Tareas pendientes',
      subtitle: 'Gestión de tareas',
      icon: 'list-outline',
      color: '#FF9500',
      count: 12,
      screen: 'WorkHub',
    },
    {
      id: 'reports',
      title: 'Reportes',
      subtitle: 'Análisis y métricas',
      icon: 'bar-chart-outline',
      color: '#AF52DE',
      count: 3,
    },
  ];

  const handleItemPress = (item: OverviewItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      console.log(`${item.title} - Coming soon`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Overview"
        subtitle="Gestión centralizada de cuentas"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {overviewItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={[
                styles.statCard,
                { width: (width - 60) / 2 }
              ]}
              activeOpacity={0.8}
            >
              <Card style={styles.statCardContent}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={24} color="#FFFFFF" />
                  </View>
                  {item.count > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.error }]}>
                      <Text style={styles.badgeText}>{item.count}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[styles.statTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Acciones rápidas
          </Text>
          
          <Card style={styles.quickActionsCard}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Accounts')}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Crear cuenta
              </Text>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('WorkHub')}
            >
              <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Ver tareas
              </Text>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="analytics-outline" size={24} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Reportes
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 16,
  },
  statCard: {
    marginBottom: 16,
  },
  statCardContent: {
    alignItems: 'center',
    padding: 16,
    minHeight: 140,
  },
  statHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 12,
  },
  statTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginBottom: 4,
  },
  statSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    marginBottom: 16,
  },
  quickActionsCard: {
    padding: 0,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  quickActionText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.base,
  },
  separator: {
    height: 0.5,
    marginHorizontal: 16,
  },
});

export default OverviewScreen;