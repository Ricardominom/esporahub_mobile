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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';
import { RootStackParamList } from '../../types/navigation';
import { TaskAssignment } from '../../types';

type WorkHubScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkHub'>;

const WorkHubScreen: React.FC = () => {
  const navigation = useNavigation<WorkHubScreenNavigationProp>();
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock tasks data
  const mockTasks: TaskAssignment[] = [
    {
      itemId: 'A-101',
      userId: user?.id || '1',
      concept: 'Diseño de la Estrategia Digital',
      dueDate: '2025-01-20',
      section: 'Set Up Estrategia Digital',
      completed: false,
    },
    {
      itemId: 'A-102',
      userId: user?.id || '1',
      concept: 'Definiciones Iniciales Estratégicas',
      dueDate: '2025-01-18',
      section: 'Set Up Estrategia Digital',
      completed: true,
    },
    {
      itemId: 'A-106',
      userId: user?.id || '1',
      concept: 'Análisis del Humor Social',
      dueDate: '2025-01-25',
      section: 'Estudios Antropológicos',
      completed: false,
    },
  ];

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const categories = [
    { id: 'all', label: 'Todas', count: tasks.length },
    { id: 'pending', label: 'Pendientes', count: tasks.filter(t => !t.completed).length },
    { id: 'completed', label: 'Completadas', count: tasks.filter(t => t.completed).length },
    { id: 'today', label: 'Hoy', count: 2 },
  ];

  const getFilteredTasks = () => {
    switch (selectedCategory) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === today);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.itemId === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="WorkHub"
        subtitle="Centro de colaboración"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryCard,
              {
                backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
              }
            ]}
          >
            <Text style={[
              styles.categoryTitle,
              {
                color: selectedCategory === category.id ? '#FFFFFF' : colors.text,
              }
            ]}>
              {category.label}
            </Text>
            <Text style={[
              styles.categoryCount,
              {
                color: selectedCategory === category.id ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary,
              }
            ]}>
              {category.count} tareas
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView
        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TouchableOpacity
              key={task.itemId}
              onPress={() => toggleTaskCompletion(task.itemId)}
              activeOpacity={0.8}
            >
              <Card style={[
                styles.taskCard,
                task.completed && { opacity: 0.7 }
              ]}>
                <View style={styles.taskHeader}>
                  <View style={[
                    styles.taskIcon,
                    {
                      backgroundColor: task.completed ? colors.success : colors.primary,
                    }
                  ]}>
                    <Ionicons
                      name={task.completed ? "checkmark" : "time-outline"}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                  
                  <View style={styles.taskInfo}>
                    <Text style={[
                      styles.taskTitle,
                      { 
                        color: colors.text,
                        textDecorationLine: task.completed ? 'line-through' : 'none'
                      }
                    ]}>
                      {task.concept}
                    </Text>
                    <Text style={[styles.taskSection, { color: colors.textSecondary }]}>
                      {task.section}
                    </Text>
                  </View>
                </View>

                <View style={styles.taskFooter}>
                  <View style={styles.taskMeta}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.taskDate, { color: colors.textSecondary }]}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.taskStatus,
                    {
                      backgroundColor: task.completed ? 
                        `${colors.success}20` : `${colors.warning}20`,
                    }
                  ]}>
                    <Text style={[
                      styles.taskStatusText,
                      {
                        color: task.completed ? colors.success : colors.warning,
                      }
                    ]}>
                      {task.completed ? 'Completada' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No hay tareas
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No se encontraron tareas en esta categoría
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  categoryTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
  },
  categoryCount: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskCard: {
    marginBottom: 12,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
    lineHeight: 20,
    marginBottom: 4,
  },
  taskSection: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskDate: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
  },
  taskStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskStatusText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quickActionsContainer: {
    marginVertical: 20,
  },
  quickActionsCard: {
    marginHorizontal: 20,
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

export default WorkHubScreen;