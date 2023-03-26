import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, FONTS, icons, STORAGE_KEY} from '../constants';
import {readData, saveData} from '../utils';

const Login = props => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [animating, setAnimating] = useState(false);

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...FONTS.largeTitle, color: COLORS.white}}>
          𝔽𝕠𝕠𝕕 ℙ𝕦𝕟𝕕𝕚𝕥𝕤
        </Text>
        <Text
          style={{color: COLORS.white, textAlign: 'center', ...FONTS.body3}}>
          Scan. Know. Nourish. Food Pundit
        </Text>
      </View>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 3,
          marginHorizontal: SIZES.padding * 3,
        }}>
        {/* Full Name */}
        <View style={{marginTop: SIZES.padding * 3}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Full Name
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            value={name}
            onChangeText={value => setName(value)}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>

        {/* Password */}
        <View style={{marginTop: SIZES.padding * 2}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Password
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            value={password}
            onChangeText={value => setPassword(value)}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleLogin = () => {
    if (!name) {
      alert('Please enter name');
    } else if (!password) {
      alert('Please enter password');
    } else {
      setAnimating(true);
      readData(STORAGE_KEY).then(value => {
        if (value == null) {
          setAnimating(false);
          alert('Please register user');
        } else {
          setTimeout(() => {
            setAnimating(false);
            const userProfileData = JSON.parse(value)?.userProfileData;
            if (
              userProfileData &&
              userProfileData.name === name &&
              userProfileData.password === password
            ) {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } else {
              alert('Invalid Credentials');
            }
          }, 2000);
        }
      });
    }
  };

  function renderButton() {
    return (
      <View style={{margin: SIZES.padding * 3}}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleLogin}>
          {animating ? (
            <ActivityIndicator
              animating={animating}
              color={COLORS.lightGreen}
              size="large"
              style={{
                alignItems: 'center',
                height: 80,
              }}
            />
          ) : (
            <Text style={{color: COLORS.white, ...FONTS.h3}}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: SIZES.padding2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            props.navigation.navigate('Register');
          }}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>
            {' '}
            New Here ? Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderLogo()}
          {renderForm()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Login;
