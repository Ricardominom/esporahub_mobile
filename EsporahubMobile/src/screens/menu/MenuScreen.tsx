import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
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

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  screen?: keyof RootStackParamList;
  category: 'operativas' | 'organizativas' | 'recursos';
}

const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { user, logout } = useAuthStore();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      subtitle: 'Panel de control principal',
      icon: 'grid-outline',
      color: '#007AFF',
      screen: 'Overview',
      category: 'operativas',
    },
    {
      id: 'workhub',
      title: 'WorkHub',
      subtitle: 'Centro de colaboración',
      icon: 'people-outline',
      color: '#007AFF',
      screen: 'WorkHub',
      category: 'operativas',
    },
    {
      id: 'accounts',
      title: 'Cuentas',
      subtitle: 'Gestión de cuentas',
      icon: 'person-outline',
      color: '#34C759',
      screen: 'Accounts',
      category: 'operativas',
    },
    {
      id: 'agenda',
      title: 'Agenda Espora',
      subtitle: 'Calendario inteligente',
      icon: 'calendar-outline',
      color: '#5856D6',
      category: 'organizativas',
    },
    {
      id: 'moneyflow',
      title: 'MoneyFlow',
      subtitle: 'Análisis financiero',
      icon: 'card-outline',
      color: '#5856D6',
      category: 'organizativas',
    },
    {
      id: 'knowledge',
      title: 'Knowledge Base',
      subtitle: 'Base de conocimiento',
      icon: 'library-outline',
      color: '#FF9500',
      category: 'recursos',
    },
  ];

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'operativas', label: 'Operativas' },
    { id: 'organizativas', label: 'Organizativas' },
    { id: 'recursos', label: 'Recursos' },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemPress = (item: MenuItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      // Navigate to construction/coming soon screen
      console.log(`${item.title} - Coming soon`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Landing');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Esporahub"
        subtitle={`${filteredItems.length} aplicaciones`}
        rightComponent={
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar aplicaciones..."
            placeholderTextColor={colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

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
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
              }
            ]}
          >
            <Text style={[
              styles.categoryText,
              {
                color: selectedCategory === category.id ? '#FFFFFF' : colors.text,
              }
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Apps Grid */}
      <ScrollView style={styles.appsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.appsGrid}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={[styles.appItem, { animationDelay: `${index * 100}ms` }]}
              activeOpacity={0.8}
            >
              <Card style={styles.appCard}>
                <View style={[styles.appIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.appTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* User Info */}
      <View style={[styles.userInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.userDetails}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>
              {user?.role === 'super_admin' ? 'Super Admin' : 
               user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
  },
  appsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 16,
  },
  appItem: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  appCard: {
    alignItems: 'center',
    padding: 20,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
  },
  userRole: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
  },
  demoTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoGrid: {
    gap: 8,
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  demoRole: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
  },
  demoEmail: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
  },
});

export default MenuScreen;