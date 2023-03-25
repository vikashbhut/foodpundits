import React, {useEffect, useState} from 'react';
import {Text, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, STORAGE_KEY} from '../constants';
import {readData} from '../utils';

const splash = props => {
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      readData(STORAGE_KEY).then(value => {
        props.navigation.replace(value === null ? 'Login' : 'Home');
      });
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.lime, COLORS.emerald]}
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{...FONTS.largeTitle, color: COLORS.lightGreen}}>
        𝔽𝕠𝕠𝕕 ℙ𝕦𝕟𝕕𝕚𝕥𝕤
      </Text>
      <ActivityIndicator
        animating={animating}
        color={COLORS.lightGreen}
        size="large"
        style={{
          alignItems: 'center',
          height: 80,
        }}
      />
    </LinearGradient>
  );
};

export default splash;
