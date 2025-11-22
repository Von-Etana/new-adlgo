import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock Zustand store hook (Replace with actual store)
// import { useUserMode } from '../store/useUserMode';
// const { mode, setMode } = useUserMode();

type Mode = 'customer' | 'driver';

interface ModeSwitchProps {
  mode: Mode;
  onSwitch: (mode: Mode) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onSwitch }) => {
  const handleSwitch = (newMode: Mode) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSwitch(newMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        {/* Background Pill */}
        <View
          style={[
            styles.activeIndicator,
            mode === 'driver' ? styles.activeRight : styles.activeLeft,
          ]}
        />

        {/* Customer Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => handleSwitch('customer')}
        >
          <Text
            style={[
              styles.text,
              mode === 'customer' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>

        {/* Driver Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => handleSwitch('driver')}
        >
          <Text
            style={[
              styles.text,
              mode === 'driver' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Driver
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWITCH_WIDTH = SCREEN_WIDTH * 0.6;
const PADDING = 4;
const BUTTON_WIDTH = (SWITCH_WIDTH - PADDING * 2) / 2;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  switchContainer: {
    width: SWITCH_WIDTH,
    height: 50,
    backgroundColor: '#F2F2F2', // Light gray background
    borderRadius: 25,
    flexDirection: 'row',
    padding: PADDING,
    position: 'relative',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicator: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: 50 - PADDING * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    top: PADDING,
    // Soft shadow for the floating pill
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  activeLeft: {
    left: PADDING,
  },
  activeRight: {
    left: SWITCH_WIDTH - BUTTON_WIDTH - PADDING,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure text is above the indicator
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeText: {
    color: '#000000',
  },
  inactiveText: {
    color: '#8E8E93',
  },
});

export default ModeSwitch;
