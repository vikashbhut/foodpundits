import {useNavigationState} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RadioGroup from 'react-native-radio-buttons-group';
import {COLORS, SIZES, FONTS, icons, STORAGE_KEY} from '../constants';
import {readData, saveData} from '../utils';
const Register = props => {
  const [age, setAge] = useState();
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [name, setName] = useState();
  const [animating, setAnimating] = useState(false);
  const routesLength = useNavigationState(state => state.routes.length);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [asyncuserProfileData, setAsyncUserProfileData] = useState();
  const [diabetesValue, setDiabetesValue] = useState();
  const [bpLowerValue, setBpLowerValue] = useState();
  const [bpHigherValue, setBpHigherValue] = useState();
  const [showBpValue, setShowBpValue] = useState(false);
  const [showDiabetesValue, setShowDiabetesValue] = useState(false);
  const [radioButtonsSex, setRadioButtonsSex] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Male',
      value: 'Male',
      labelStyle: {
        color: COLORS.lightGreen,
        ...FONTS.body3,
      },
      containerStyle: {width: 100},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '2',
      label: 'Female',
      value: 'Female',
      containerStyle: {width: 100},
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '3',
      label: 'Other',
      value: 'Other',
      containerStyle: {width: 100},
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
  ]);

  const [radioButtonsBp, setRadioButtonsBp] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      containerStyle: {width: 100},
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      containerStyle: {width: 100},
      color: COLORS.lightGreen,
      selected: false,
    },
  ]);

  const [radioButtonsDB, setRadioButtonsDB] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      containerStyle: {width: 100},
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      containerStyle: {width: 100},
      color: COLORS.lightGreen,
      selected: false,
    },
  ]);

  const [radioButtonsTH, setRadioButtonsTH] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      containerStyle: {width: 100},
      selected: false,
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      containerStyle: {width: 100},
      selected: false,
    },
  ]);

  const [radioButtonsAT, setRadioButtonsAT] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Jogging',
      value: 'Jogging',
      containerStyle: {width: 100},
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '2',
      label: 'Swimming',
      value: 'Swimming',
      containerStyle: {width: 100},
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '3',
      label: 'Cycling',
      value: 'Cycling',
      containerStyle: {width: 100},
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
    {
      id: '4',
      label: 'NA',
      containerStyle: {width: 100},
      value: 'NA',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
    },
  ]);

  useEffect(() => {
    readData(STORAGE_KEY).then(value => {
      if (value !== null) {
        const parsedData = JSON.parse(value);
        if (parsedData?.userProfileData) {
          setAsyncUserProfileData(parsedData?.userProfileData ?? {});
        }
      }
    });
  }, []);

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.padding * 3,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => (routesLength > 1 ? props.navigation.goBack() : {})}>
        {routesLength > 1 && (
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.white,
            }}
          />
        )}
        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}>
          Register User
        </Text>
      </TouchableOpacity>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding * 3,
        }}>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>Name</Text>
          <TextInput
            style={{
              marginTop: SIZES.base,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            onChangeText={value => setName(value)}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
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
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>Age</Text>
          <TextInput
            style={{
              marginTop: SIZES.base,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            inputMode="numeric"
            onChangeText={value => setAge(value)}
            value={age}
            placeholder="Enter Age"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>Weight</Text>
          <TextInput
            style={{
              marginTop: SIZES.base,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            inputMode="numeric"
            onChangeText={value => setWeight(value)}
            value={weight}
            placeholder="Enter Weight in kg"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>Height</Text>
          <TextInput
            style={{
              marginTop: SIZES.base,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            inputMode="numeric"
            onChangeText={value => setHeight(value)}
            value={height}
            placeholder="Enter Height in cm"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>Sex</Text>
          <RadioGroup
            radioButtons={radioButtonsSex}
            onPress={radioButtons => setRadioButtonsSex(radioButtons)}
            layout={'row'}
            containerStyle={{
              marginTop: SIZES.base,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Blood Pressure{' '}
          </Text>
          <RadioGroup
            radioButtons={radioButtonsBp}
            onPress={radioButtons => {
              setShowBpValue(radioButtons[0].selected);
              setRadioButtonsBp(radioButtons);
            }}
            layout={'row'}
            containerStyle={{marginTop: SIZES.base, alignItems: 'flex-start'}}
          />
        </View>
        {showBpValue && (
          <View style={{marginTop: SIZES.padding}}>
            <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
              {' '}
              Average Lower Blood Pressure (Last quarter)
            </Text>
            <TextInput
              style={{
                marginTop: SIZES.base,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.white,
                ...FONTS.body3,
              }}
              inputMode="numeric"
              onChangeText={value => setBpLowerValue(value)}
              value={bpLowerValue}
              placeholder="Enter Lower Blood Pressure Value"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
            />
          </View>
        )}
        {showBpValue && (
          <View style={{marginTop: SIZES.padding}}>
            <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
              {' '}
              Average Higher Blood Pressure (Last quarter)
            </Text>
            <TextInput
              style={{
                marginTop: SIZES.base,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.white,
                ...FONTS.body3,
              }}
              inputMode="numeric"
              onChangeText={value => setBpHigherValue(value)}
              value={bpHigherValue}
              placeholder="Enter Higher Blood Pressure Value"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
            />
          </View>
        )}
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Diabetes
          </Text>
          <RadioGroup
            radioButtons={radioButtonsDB}
            onPress={radioButtons => {
              setShowDiabetesValue(radioButtons[0].selected);
              setRadioButtonsDB(radioButtons);
            }}
            layout={'row'}
            containerStyle={{marginTop: SIZES.base, alignItems: 'flex-start'}}
          />
        </View>
        {showDiabetesValue && (
          <View style={{marginTop: SIZES.padding}}>
            <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
              Diabetes Value (Last quarter)
            </Text>
            <TextInput
              style={{
                marginTop: SIZES.base,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.white,
                ...FONTS.body3,
              }}
              inputMode="numeric"
              onChangeText={value => setDiabetesValue(value)}
              value={diabetesValue}
              placeholder="Enter Average Diabetes Value"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
            />
          </View>
        )}
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Thyroid
          </Text>
          <RadioGroup
            radioButtons={radioButtonsTH}
            onPress={radioButtons => setRadioButtonsTH(radioButtons)}
            layout={'row'}
            containerStyle={{
              marginTop: SIZES.base,
              alignItems: 'flex-start',
            }}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Phsical Activity
          </Text>
          <RadioGroup
            radioButtons={radioButtonsAT}
            onPress={radioButtons => setRadioButtonsAT(radioButtons)}
            layout={'row'}
            containerStyle={{
              marginTop: SIZES.base,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          />
        </View>
      </View>
    );
  }

  const handleRegister = () => {
    const checkForSexRadio = radioButtonsSex.find(data => data.selected);
    const checkForBPRadio = radioButtonsBp.find(data => data.selected);
    const checkForDBRadio = radioButtonsDB.find(data => data.selected);
    const checkForTHRadio = radioButtonsTH.find(data => data.selected);
    const checkForATRadio = radioButtonsAT.find(data => data.selected);

    if (
      !checkForSexRadio ||
      !checkForBPRadio ||
      !checkForDBRadio ||
      !checkForTHRadio ||
      !checkForATRadio ||
      !age ||
      !weight ||
      !name ||
      !password ||
      !height ||
      (showBpValue && !bpLowerValue) ||
      (showBpValue && !bpHigherValue) ||
      (showDiabetesValue && !diabetesValue)
    ) {
      alert('Please fill the registraion details');
    } else if (isNaN(age)) {
      alert('Please enter valid age');
    } else if (isNaN(weight)) {
      alert('Please enter valid weight');
    } else if (isNaN(height)) {
      alert('Please enter valid height');
    } else if (showBpValue && isNaN(bpLowerValue)) {
      alert('Please enter valid average lower blood pressure value');
    } else if (showBpValue && isNaN(bpHigherValue)) {
      alert('Please enter valid average higher blood pressure value');
    } else if (showDiabetesValue && isNaN(diabetesValue)) {
      alert('Please enter valid diabetes value');
    } else {
      setAnimating(true);
      const userProfileData = {
        name,
        age: Number(age),
        weight: Number(weight),
        sex: checkForSexRadio.value,
        bloodPressure: checkForBPRadio.value,
        diabetes: checkForDBRadio.value,
        thyroid: checkForTHRadio.value,
        physicalActivity: checkForATRadio.value,
        height: Number(height),
        radioButtonsAT,
        radioButtonsBp,
        radioButtonsDB,
        radioButtonsSex,
        radioButtonsTH,
        ...(showDiabetesValue && {diabetesValue: Number(diabetesValue)}),
        ...(showBpValue && {bloodPressureLowerValue: Number(bpLowerValue)}),
        ...(showBpValue && {bloodPressureHigherValue: Number(bpHigherValue)}),
        password,
      };
      if (
        asyncuserProfileData &&
        asyncuserProfileData.name === name &&
        asyncuserProfileData.password === password
      ) {
        setTimeout(() => {
          setAnimating(false);
          alert('User Already Registerd!!');
          return;
        }, 3000);
      } else {
        saveData(STORAGE_KEY, JSON.stringify({userProfileData})).then(() => {
          setTimeout(() => {
            setAnimating(false);
            props.navigation.replace('Login');
          }, 3000);
        });
      }
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
          onPress={handleRegister}>
          {animating ? (
            <ActivityIndicator
              animating={animating}
              color={COLORS.lightGreen}
              size="large"
              style={{
                height: 80,
              }}
            />
          ) : (
            <Text style={{color: COLORS.white, ...FONTS.h3}}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
      style={{flex: 1}}>
      <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderForm()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Register;
