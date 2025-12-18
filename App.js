import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventsPage from './src/screens/EventsPage';
import ProfileScreen from './src/screens/ProfilScreenLogin';
import UserProfileScreen from './src/screens/UserProfileScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import FAQContactPage from './src/screens/FAQContactPage';
import ShareAirportTaxiPage from './src/screens/ShareAirportTaxiPage';
import AddRidePage from './src/screens/AddRidePage';
import DealsPage from './src/screens/DealsPage';
import DealDetailsScreen from './src/screens/Deals/DealDetailsScreen.js';
import MeatballDetailsScreen from './src/screens/Deals/MeatballDetailsScreen';
import HappyHourDetailsScreen from './src/screens/Deals/HappyHourDetailsScreen';
import GolfDetailsScreen from './src/screens/Deals/GolfDetailsScreen';
import PaellaDetailsScreen from './src/screens/Deals/PaellaDetailsScreen';
import TapasDetailsScreen from './src/screens/Deals/TapasDetailsScreen';
import JetskiDetailsScreen from './src/screens/Deals/JetskiDetailsScreen';
import WineTastingDetailsScreen from './src/screens/Events/WineTastingDetailsScreen';
import FridayMarketDetailsScreen from './src/screens/Events/FridayMarketDetailsScreen';
import FootballMatchDetailsScreen from './src/screens/Events/FootballMatchDetailsScreen';
import BoatDayDetailsScreen from './src/screens/Events/BoatDayDetailsScreen';
import NightClubDetailsScreen from './src/screens/Events/NightClubDetailsScreen';
import HappyHourEventDetailsScreen from './src/screens/Events/HappyHourEventDetailsScreen';
import WalkthroughScreen from './src/screens/WalkthroughScreen';
import VenuesPage from './src/screens/VenuesPage';
import VenueDetailsScreen from './src/screens/Venues/VenueDetailsScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPW';
import NewPasswordScreen from './src/screens/NewPW';
import AllDoneScreen from './src/screens/AllDone';

const { width } = Dimensions.get('window');

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [showWalkthrough, setShowWalkthrough] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState('events');
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const [hasCompletedWalkthrough, setHasCompletedWalkthrough] = useState(false);
  const [rides, setRides] = useState([]);
  const [authParams, setAuthParams] = useState({});

  const openMenu = () => {
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
    closeMenu();
    setTimeout(() => {
      if (screen === 'splash') {
        setShowSplash(true);
        setShowWalkthrough(false);
      } else if (screen === 'walkthrough') {
        setShowSplash(false);
        setShowWalkthrough(true);
      } else {
        setShowSplash(false);
        setShowWalkthrough(false);
        setCurrentScreen(screen);
        setAuthParams(params);
      }
    }, 300);
  };

  // Handle splash completion - go to walkthrough
  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowWalkthrough(true);
  };

  // Handle walkthrough completion - go to main app
  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
    setShowSplash(true);
    setShouldOpenMenu(true);
    setHasCompletedWalkthrough(true);
  };

  const handleAddRide = (newRide) => {
    setRides([newRide, ...rides]);
  };

  // Open menu when splash is shown after walkthrough skip
  React.useEffect(() => {
    if (showSplash && shouldOpenMenu) {
      setTimeout(() => {
        openMenu();
        setShouldOpenMenu(false);
      }, 300);
    }
  }, [showSplash, shouldOpenMenu]);

  // Auto-advance from splash to walkthrough after 3 seconds (only on first load, not after skip)
  React.useEffect(() => {
    if (showSplash && !shouldOpenMenu && !hasCompletedWalkthrough) {
      const timer = setTimeout(() => {
        handleSplashComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash, shouldOpenMenu, hasCompletedWalkthrough]);

  // Show splash screen first
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        {/* Background Image */}
        <Image 
          source={require('./assets/backgrounds/SplashBG.png')} 
          style={styles.splashBackgroundImage}
          resizeMode="cover"
        />
        
        {/* Hamburger Menu Button */}
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

        {/* Slide-in Menu Modal */}
        <Modal
          visible={menuOpen}
          transparent={true}
          animationType="none"
          onRequestClose={closeMenu}
        >
          <View style={styles.modalOverlay}>
            {/* Slide-in Menu from LEFT */}
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

              {/* Menu Items */}
              <View style={styles.menuItems}>
                <TouchableOpacity 
                  style={[styles.menuItem, styles.activeMenuItem]}
                  onPress={() => handleMenuItemPress('splash')}
                >
                  <Text style={[styles.menuItemText, styles.activeMenuItemText]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('venues')}
                >
                  <Text style={styles.menuItemText}>Venues & Services</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('events')}
                >
                  <Text style={styles.menuItemText}>Happenings & Events</Text>
                </TouchableOpacity> */}

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('testdeals')}
                >
                  <Text style={styles.menuItemText}>Deals & Promotions</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('faq')}
                >
                  <Text style={styles.menuItemText}>FAQ & Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('taxi')}
                >
                  <View style={styles.menuItemRow}>
                    <Text style={styles.menuItemText}>Share Airport Taxi</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Sign In / Sign Up */}
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => handleMenuItemPress('signin')}
              >
                <Text style={styles.logoutText}>Sign In / Sign Up</Text>
              </TouchableOpacity>

              {/* Large Logo at Bottom */}
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

            {/* Clickable overlay to close menu */}
            <TouchableOpacity 
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={closeMenu}
            />
          </View>
        </Modal>
      </View>
    );
  }

  // Show walkthrough after splash
  if (showWalkthrough) {
    return <WalkthroughScreen onComplete={handleWalkthroughComplete} />;
  }

  const renderScreen = () => {
    switch(currentScreen) {
      case 'events':
        return <EventsPage onNavigate={handleMenuItemPress} />;
      case 'create':
        return <CreateEventScreen onNavigate={handleMenuItemPress} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleMenuItemPress} />;
      case 'userprofile':
        return <UserProfileScreen onNavigate={handleMenuItemPress} />;
      case 'faq':
        return <FAQContactPage onNavigate={handleMenuItemPress} />;
      case 'taxi':
        return <ShareAirportTaxiPage onNavigate={handleMenuItemPress} rides={rides} />;
      case 'addride':
        return <AddRidePage onNavigate={handleMenuItemPress} onAddRide={handleAddRide} />;
      case 'testdeals':
        return <DealsPage onNavigate={handleMenuItemPress} />;
      case 'dealdetails':
        return <DealDetailsScreen onNavigate={handleMenuItemPress} dealId={authParams?.dealId} />;
      case 'meatballdetails':
        return <MeatballDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'happyhourdetails':
        return <HappyHourDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'golfdetails':
        return <GolfDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'paelladetails':
        return <PaellaDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'tapasdetails':
        return <TapasDetailsScreen onNavigate={handleMenuItemPress} />;
      case 'jetskidetails':
        return <JetskiDetailsScreen onNavigate={handleMenuItemPress} />;
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
        return <VenuesPage onNavigate={handleMenuItemPress} />;
      case 'venuedetails':
  return <VenueDetailsScreen onNavigate={handleMenuItemPress} venueId={authParams?.venueId} />;
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
      default:
        return <EventsPage onNavigate={handleMenuItemPress} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
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
  sloganContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sloganText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
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
    fontSize: 12,
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
    fontSize: 9,
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
  logoutText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  bottomLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bottomLogo: {
    width: 480,
    height: 160,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});