import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';
import { RootStackParamList } from '../../types/navigation';
import { ChecklistItem } from '../../types';

type ChecklistScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checklist'>;
type ChecklistScreenRouteProp = RouteProp<RootStackParamList, 'Checklist'>;

const ChecklistScreen: React.FC = () => {
  const navigation = useNavigation<ChecklistScreenNavigationProp>();
  const route = useRoute<ChecklistScreenRouteProp>();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const clientName = route.params?.clientName || 'Cliente';

  // Mock checklist data
  const mockChecklistItems: ChecklistItem[] = [
    {
      id: 'A-101',
      concept: 'Diseño de la Estrategia Digital',
      section: 'Set Up Estrategia Digital',
      sectionId: 'estrategia',
      completed: false,
    },
    {
      id: 'A-102',
      concept: 'Definiciones Iniciales Estratégicas',
      section: 'Set Up Estrategia Digital',
      sectionId: 'estrategia',
      completed: true,
    },
    {
      id: 'A-106',
      concept: 'Análisis del Humor Social',
      section: 'Estudios Antropológicos',
      sectionId: 'antropologicos',
      completed: false,
    },
    {
      id: 'A-107',
      concept: 'Histograma del humor social',
      section: 'Estudios Antropológicos',
      sectionId: 'antropologicos',
      completed: false,
    },
  ];

  useEffect(() => {
    setChecklistItems(mockChecklistItems);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleItemCompletion = (itemId: string) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Checklist EHO"
        subtitle={clientName.split(' - ')[0]}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Progress Header */}
      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            Progreso del checklist
          </Text>
          <Text style={[styles.progressText, { color: colors.primary }]}>
            {completedCount}/{totalCount} completadas
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[
            styles.progressFill,
            {
              backgroundColor: colors.success,
              width: `${progressPercentage}%`,
            }
          ]} />
        </View>
        
        <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
          {Math.round(progressPercentage)}% completado
        </Text>
      </Card>

      {/* Checklist Items */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {Object.entries(groupedItems).map(([sectionName, items]) => (
          <View key={sectionName} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {sectionName}
            </Text>
            
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleItemCompletion(item.id)}
                activeOpacity={0.8}
              >
                <Card style={[
                  styles.checklistItem,
                  item.completed && { opacity: 0.7 }
                ]}>
                  <View style={styles.itemHeader}>
                    <TouchableOpacity
                      onPress={() => toggleItemCompletion(item.id)}
                      style={styles.checkbox}
                    >
                      <View style={[
                        styles.checkboxInner,
                        {
                          backgroundColor: item.completed ? colors.success : 'transparent',
                          borderColor: item.completed ? colors.success : colors.border,
                        }
                      ]}>
                        {item.completed && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.itemInfo}>
                      <View style={styles.itemIdContainer}>
                        <Text style={[styles.itemId, { color: colors.primary }]}>
                          {item.id}
                        </Text>
                      </View>
                      <Text style={[
                        styles.itemConcept,
                        { 
                          color: colors.text,
                          textDecorationLine: item.completed ? 'line-through' : 'none'
                        }
                      ]}>
                        {item.concept}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressCard: {
    margin: 20,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
  },
  progressText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.base,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checklistItem: {
    marginBottom: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemIdContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  itemId: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    overflow: 'hidden',
  },
  itemConcept: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.base,
    lineHeight: 22,
  },
});

export default ChecklistScreen;