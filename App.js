import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, signOut } from './src/services/authService';
import { supabase } from './src/config/supabaseClient';
import EventsPage from './src/screens/EventsPage';
// OLD LOGIN SCREEN REMOVED - using SignInScreen instead
import UserProfileScreen from './src/screens/UserProfileScreen';
import VenueProfileScreen from './src/screens/VenueProfileScreen';
import VenueManageScreen from './src/screens/VenueManageScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import FAQContactPage from './src/screens/FAQContactPage';
import ShareAirportTaxiPage from './src/screens/ShareAirportTaxiPage';
import AddRidePage from './src/screens/AddRidePage';
import DealsPage from './src/screens/DealsPage';
import DealDetailsScreen from './src/screens/Deals/DealDetailsScreen.js';
import WineTastingDetailsScreen from './src/screens/Events/WineTastingDetailsScreen';
import FridayMarketDetailsScreen from './src/screens/Events/FridayMarketDetailsScreen';
import FootballMatchDetailsScreen from './src/screens/Events/FootballMatchDetailsScreen';
import BoatDayDetailsScreen from './src/screens/Events/BoatDayDetailsScreen';
import NightClubDetailsScreen from './src/screens/Events/NightClubDetailsScreen';
import HappyHourEventDetailsScreen from './src/screens/Events/HappyHourEventDetailsScreen';
import WalkthroughScreen from './src/screens/WalkthroughScreen';
import FavoritesPage from './src/screens/FavoritesPage';
import VenuesPage from './src/screens/VenuesPage';
import VenueDetailsScreen from './src/screens/Venues/VenueDetailsScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPW';
import NewPasswordScreen from './src/screens/NewPW';
import AllDoneScreen from './src/screens/AllDone';
import EventDetailsScreen from './src/screens/Events/EventDetailsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import MessagesPage from './src/screens/MessagesPage';
import VenueBottomNavigation from './src/components/VenueBottomNavigation';

// Venue Screens
import VenueSettingsScreen from './src/screens/VenueSettingsScreen';
import VenueEditProfileScreen from './src/screens/VenueEditProfileScreen';
import VenueChangePasswordScreen from './src/screens/VenueChangePasswordScreen';
import VenueManageDealsScreen from './src/screens/Venues/VenueManageDealsScreen';
import VenueManageEventsScreen from './src/screens/Venues/VenueManageEventsScreen';

const { width } = Dimensions.get('window');

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [showWalkthrough, setShowWalkthrough] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState(''); // Start empty, not 'events'
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [slideAnim] = React.useState(new Animated.Value(-width * 0.75));
  const [shouldOpenMenu, setShouldOpenMenu] = React.useState(false);
  const [hasCompletedWalkthrough, setHasCompletedWalkthrough] = React.useState(false);
  const [rides, setRides] = React.useState([]);
  const [authParams, setAuthParams] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);
  const [userType, setUserType] = React.useState(null); // 'visitor' or 'venue'
  const [venueId, setVenueId] = React.useState(null); // Store venue ID for venue users

  // Use ref to prevent state reset
  const authInitialized = React.useRef(false);
  const isLoggingOut = React.useRef(false);

  // Function to fetch user type and venue info from profiles table
  const fetchUserProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, venue_id, is_active')
        .eq('id', userId);

      if (error) {
        console.error('Error fetching user profile:', error);
        return { user_type: 'visitor', venue_id: null };
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No profile found, defaulting to visitor');
        return { user_type: 'visitor', venue_id: null };
      }

      console.log('👤 User profile:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return { user_type: 'visitor', venue_id: null };
    }
  };

  // IMMEDIATELY load login state from AsyncStorage on mount
  React.useEffect(() => {
    const loadLoginState = async () => {
      const stored = await AsyncStorage.getItem('isLoggedIn');
      console.log('💾 IMMEDIATE load from storage:', stored);
      if (stored === 'true') {
        setIsLoggedIn(true);
      }
    };
    loadLoginState();
  }, []);

  // Check if user is logged in on app start
  React.useEffect(() => {
    if (authInitialized.current) {
      console.log('⚠️ Auth already initialized, skipping...');
      return;
    }
    
    authInitialized.current = true;
    console.log('🚀 App started, setting up auth listener...');
    
    // INITIAL session check
    const initializeAuth = async () => {
      const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
      console.log('💾 Stored login state:', storedLoginState);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📱 Initial session check:', session?.user?.email || 'No session');
      
      if (session?.user) {
        console.log('✅ Found existing session on startup');
        setIsLoggedIn(true);
        setCurrentUser(session.user);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        
        // Fetch user profile to determine type
        const profile = await fetchUserProfile(session.user.id);
        setUserType(profile.user_type);
        setVenueId(profile.venue_id);
        console.log('🎯 User type set to:', profile.user_type);
        
        // REDIRECT TO CORRECT SCREEN AFTER LOGIN
        if (profile.user_type === 'venue') {
          console.log('🏪 Venue user detected - auto-navigating to venue dashboard');
          setShowSplash(false);
          setShowWalkthrough(false);
          setCurrentScreen('venuedashboard');
        } else {
          console.log('👤 Visitor user detected - staying on current screen');
        }
      } else {
        console.log('⚠️ No existing session on startup');
        if (storedLoginState !== 'true') {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      }
      setIsCheckingSession(false);
    };
    
    initializeAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event, 'User:', session?.user?.email || 'None', 'Time:', new Date().toLocaleTimeString());
      
      if (event === 'SIGNED_OUT') {
        // Skip if we're already handling logout
        if (isLoggingOut.current) {
          console.log('⚠️ SIGNED_OUT event during logout - ignoring to prevent double-processing');
          return;
        }
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          console.log('⚠️ IGNORING false SIGNED_OUT event - session still valid!');
          return;
        }
        console.log('❌ Setting logged OUT - confirmed no session');
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserType(null);
        setVenueId(null);
        await AsyncStorage.setItem('isLoggedIn', 'false');
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('✅ Setting logged IN - User:', session.user.email, 'Event:', event);
          setIsLoggedIn(true);
          setCurrentUser(session.user);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          
          // Fetch user profile to determine type
          const profile = await fetchUserProfile(session.user.id);
          setUserType(profile.user_type);
          setVenueId(profile.venue_id);
          console.log('🎯 User type set to:', profile.user_type);
          
          // REDIRECT TO CORRECT SCREEN AFTER LOGIN
          if (event === 'SIGNED_IN') {
            if (profile.user_type === 'venue') {
              console.log('🏪 Venue user signed in - navigating to venue dashboard');
              setShowSplash(false);
              setShowWalkthrough(false);
              setCurrentScreen('venuedashboard');
            } else {
              console.log('👤 Visitor user signed in - staying on current screen');
            }
          }
        }
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const openMenu = () => {
    console.log('📝 Opening menu, isLoggedIn:', isLoggedIn, 'User:', currentUser?.email, 'showSplash:', showSplash, 'currentScreen:', currentScreen);
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const handleMenuItemPress = (screen, params = {}) => {
    console.log('📍 Navigating to:', screen, 'Current isLoggedIn:', isLoggedIn, 'User type:', userType);
    
    // REDIRECT: If navigating to userprofile and user is venue, go to venue dashboard instead
    if (screen === 'userprofile' && userType === 'venue') {
      console.log('🏪 Venue user detected - redirecting to venue dashboard');
      screen = 'venuedashboard';
    }
    
    // FORCE CHECK AUTH when navigating to userprofile OR splash (in case we just logged in)
    if (screen === 'userprofile' || screen === 'venuedashboard' || screen === 'splash') {
      console.log('🔄 Force-checking auth state...');
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          console.log('✅ Force-check: User IS logged in:', session.user.email);
          setIsLoggedIn(true);
          setCurrentUser(session.user);
          AsyncStorage.setItem('isLoggedIn', 'true');
          
          // Fetch and update user type
          const profile = await fetchUserProfile(session.user.id);
          setUserType(profile.user_type);
          setVenueId(profile.venue_id);
        } else {
          console.log('⚠️ Force-check: No session found');
        }
      });
    }
    
    // Close menu for all screens EXCEPT splash
    if (screen !== 'splash') {
      closeMenu();
    }
    
    setTimeout(() => {
      if (screen === 'splash') {
        setShowSplash(true);
        setShowWalkthrough(false);
        setCurrentScreen(''); // Clear currentScreen when on splash!
        // Open menu immediately when navigating to splash
        setTimeout(() => {
          openMenu();
        }, 100);
      } else if (screen === 'walkthrough') {
        setShowSplash(false);
        setShowWalkthrough(true);
        closeMenu();
      } else {
        setShowSplash(false);
        setShowWalkthrough(false);
        setCurrentScreen(screen);
        setAuthParams(params);
      }
    }, screen === 'splash' ? 0 : 300);
  };

  const handleLogout = async () => {
    if (isLoggingOut.current) {
      console.log('⚠️ Already logging out, ignoring...');
      return;
    }
    
    isLoggingOut.current = true;
    console.log('🚪 Logging out...');
    
    try {
      // Update UI immediately BEFORE Supabase signOut
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserType(null);
      setVenueId(null);
      await AsyncStorage.setItem('isLoggedIn', 'false');
      
      // Then sign out from Supabase (this triggers SIGNED_OUT event)
      await signOut();
      
      // Navigate to splash (HOME)
      handleMenuItemPress('splash');
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Reset flag after short delay
      setTimeout(() => {
        isLoggingOut.current = false;
        console.log('🔄 Logout flag reset');
      }, 500);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowWalkthrough(true);
  };

  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
    setShowSplash(true);
    setShouldOpenMenu(true);
    setHasCompletedWalkthrough(true);
  };

  const handleAddRide = (newRide) => {
    setRides([newRide, ...rides]);
  };

  React.useEffect(() => {
    if (showSplash && shouldOpenMenu) {
      setTimeout(() => {
        openMenu();
        setShouldOpenMenu(false);
      }, 300);
    }
  }, [showSplash, shouldOpenMenu]);

  React.useEffect(() => {
    if (showSplash && !shouldOpenMenu && !hasCompletedWalkthrough) {
      const timer = setTimeout(() => {
        handleSplashComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash, shouldOpenMenu, hasCompletedWalkthrough]);

  // Render the current screen content
  const renderMainContent = () => {
    console.log('🎨 renderMainContent - showSplash:', showSplash, 'currentScreen:', currentScreen);
    if (showSplash) {
      return (
        <View style={styles.splashContainer}>
          <Image 
            source={require('./assets/backgrounds/SplashBG.png')} 
            style={styles.splashBackgroundImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={styles.menuButtonWrapper}
            onPress={openMenu}
          >
            <View style={styles.menuButtonContainer}>
              <Ionicons name="menu" size={32} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.splashContent}>
            <Image
              source={require('./assets/icons/logo.png')}
              style={styles.splashLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    }

    if (showWalkthrough) {
      return <WalkthroughScreen onComplete={handleWalkthroughComplete} />;
    }

    switch(currentScreen) {
      case 'events':
        return <EventsPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'create':
        return <CreateEventScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'profile':
        return <UserProfileScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'userprofile':
        return <UserProfileScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'faq':
        return <FAQContactPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'taxi':
        return <ShareAirportTaxiPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} rides={rides} />;
      case 'addride':
        return <AddRidePage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} onAddRide={handleAddRide} />;
      case 'testdeals':
        return <DealsPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'dealdetails':
        return <DealDetailsScreen onNavigate={handleMenuItemPress} dealId={authParams?.dealId} authParams={authParams} />;
      case 'winetastingdetails':
        return <WineTastingDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'fridaymarketdetails':
        return <FridayMarketDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'footballmatchdetails':
        return <FootballMatchDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'boatdaydetails':
        return <BoatDayDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'nightclubdetails':
        return <NightClubDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'happyhoureventdetails':
        return <HappyHourEventDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'venues':
        return <VenuesPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'favorites':
        return <FavoritesPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} initialTab={authParams?.favoriteTab} />;
      case 'venuedetails':
        return <VenueDetailsScreen onNavigate={handleMenuItemPress} venueId={authParams?.venueId} authParams={authParams} />;
      case 'eventdetails':
        return <EventDetailsScreen route={{ params: authParams }} onNavigate={handleMenuItemPress} />;
      case 'signin':
        return <SignInScreen onNavigate={handleMenuItemPress} />;
      case 'signup':
        return <SignUpScreen onNavigate={handleMenuItemPress} />;
      case 'forgotpassword':
        return <ForgotPasswordScreen onNavigate={handleMenuItemPress} />;
      case 'newpassword':
        return <NewPasswordScreen onNavigate={handleMenuItemPress} />;
      case 'alldone':
        return <AllDoneScreen onNavigate={handleMenuItemPress} />;
      case 'notifications':
        return <NotificationSettingsScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'messages':
        return <MessagesPage onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      
      // Venue Dashboard Routes
      case 'venuedashboard':
        return <VenueProfileScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'venueManage':
        return <VenueManageScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'venuesettings':
        return <VenueSettingsScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'venueeditprofile':
        return <VenueEditProfileScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'venuechangepassword':
        return <VenueChangePasswordScreen onNavigate={handleMenuItemPress} onOpenMenu={openMenu} />;
      case 'venuemanagedeals':
        return <VenueManageDealsScreen 
          navigation={{ navigate: handleMenuItemPress, goBack: () => handleMenuItemPress('venuedashboard') }}
          route={{ params: authParams }}
          currentUser={currentUser}
        />;
      case 'venuemanageevents':
        return <VenueManageEventsScreen 
          navigation={{ navigate: handleMenuItemPress, goBack: () => handleMenuItemPress('venuedashboard') }}
          route={{ params: authParams }}
          currentUser={currentUser}
        />;
      
      default:
        return <EventsPage onNavigate={handleMenuItemPress} />;
    }
  };

  // GLOBAL MENU - wraps entire app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {renderMainContent()}

      {/* GLOBAL Slide-in Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.menuPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={closeMenu} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={[styles.menuItem, showSplash && !currentScreen && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('splash')}
              >
                <Text style={[styles.menuItemText, showSplash && !currentScreen && styles.activeMenuItemText]}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, !showSplash && currentScreen === 'venues' && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('venues')}
              >
                <Text style={[styles.menuItemText, !showSplash && currentScreen === 'venues' && styles.activeMenuItemText]}>Venues & Services</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, !showSplash && currentScreen === 'events' && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('events')}
              >
                <Text style={[styles.menuItemText, !showSplash && currentScreen === 'events' && styles.activeMenuItemText]}>Events & Happenings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, currentScreen === 'testdeals' && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('testdeals')}
              >
                <Text style={[styles.menuItemText, currentScreen === 'testdeals' && styles.activeMenuItemText]}>Deals & Promotions</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, currentScreen === 'faq' && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('faq')}
              >
                <Text style={[styles.menuItemText, currentScreen === 'faq' && styles.activeMenuItemText]}>FAQ & Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, currentScreen === 'taxi' && styles.activeMenuItem]}
                onPress={() => handleMenuItemPress('taxi')}
              >
                <View style={styles.menuItemRow}>
                  <Text style={[styles.menuItemText, currentScreen === 'taxi' && styles.activeMenuItemText]}>Share Airport Taxi</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {isLoggedIn ? (
              <TouchableOpacity 
                key="profile-logged-in"
                style={styles.logoutButton}
                onPress={() => handleMenuItemPress('userprofile')}
              >
                <Text style={styles.logoutText}>My Profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                key="profile-logged-out"
                style={styles.logoutButton}
                onPress={() => handleMenuItemPress('signin')}
              >
                <Text style={styles.logoutText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            )}

            {isLoggedIn && (
              <TouchableOpacity 
                key="logout-button"
                style={styles.logoutButtonSecondary}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.bottomLogoSection}
              onPress={() => {
                closeMenu();
                setTimeout(() => {
                  setShowSplash(false);
                  setShowWalkthrough(true);
                }, 300);
              }}
            >
              <Image
                source={require('./assets/icons/logo.png')}
                style={styles.bottomLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeMenu}
          />
        </View>
      </Modal>

      {/* Venue Bottom Navigation */}
      {isLoggedIn && userType === 'venue' && !showSplash && !showWalkthrough && (
        <VenueBottomNavigation 
          currentScreen={currentScreen}
          onNavigate={handleMenuItemPress}
        />
      )}
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#00a8e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  menuButtonWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogo: {
    width: 400,
    height: 300,
    marginBottom: 60,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuPanel: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  overlayTouchable: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.25,
    height: '100%',
  },
  menuHeader: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 0,
  },
  menuItems: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  newBadge: {
    backgroundColor: '#d12028',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeMenuItem: {
    backgroundColor: '#0077B6',
    borderRadius: 10,
  },
  activeMenuItemText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 40,
    marginLeft: 20,
  },
  logoutButtonSecondary: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  bottomLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bottomLogo: {
    width: 360,
    height: 120,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});