import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RadioGroup from 'react-native-radio-buttons-group';
import {COLORS, SIZES, FONTS, STORAGE_KEY} from '../constants';
import {readData} from '../utils';

const Profile = props => {
  const [age, setAge] = useState();
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [name, setName] = useState();
  const [diabetesValue, setDiabetesValue] = useState();
  const [bpLowerValue, setBpLowerValue] = useState();
  const [bpHigherValue, setBpHigherValue] = useState();
  const [showBpValue, setShowBpValue] = useState(false);
  const [animating, setAnimating] = useState(true);
  const [showDiabetesValue, setShowDiabetesValue] = useState(false);
  const [asyncuserProfileData, setAsyncUserProfileData] = useState();
  const [radioButtonsSex, setRadioButtonsSex] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Male',
      value: 'Male',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '2',
      label: 'Female',
      value: 'Female',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
  ]);

  const [radioButtonsBp, setRadioButtonsBp] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
  ]);

  const [radioButtonsDB, setRadioButtonsDB] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
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
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
  ]);

  const [radioButtonsAT, setRadioButtonsAT] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Jogging',
      value: 'Jogging',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '2',
      label: 'Swimming',
      value: 'Swimming',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '3',
      label: 'Cycling',
      value: 'Cycling',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
    {
      id: '4',
      label: 'NA',
      value: 'NA',
      labelStyle: {color: COLORS.lightGreen, ...FONTS.body3},
      borderColor: COLORS.lightGreen,
      color: COLORS.lightGreen,
      selected: false,
      disabled: true,
      containerStyle: {opacity: 1},
    },
  ]);

  useEffect(() => {
    readData(STORAGE_KEY).then(value => {
      if (value !== null) {
        const parsedData = JSON.parse(value);
        if (parsedData?.userProfileData) {
          const userData = parsedData?.userProfileData;
          setAge(`${userData.age}`);
          setName(userData.name);
          setWeight(`${userData.weight}`);
          setHeight(`${userData.height}`);
          if (userData.bloodPressure === 'Yes') {
            setShowBpValue(true);
            setBpLowerValue(`${userData.bloodPressureLowerValue}`);
            setBpHigherValue(`${userData.bloodPressureHigherValue}`);
          }
          if (userData.diabetes === 'Yes') {
            setShowDiabetesValue(true);
            setDiabetesValue(`${userData.diabetesValue}`);
          }
          setRadioButtonsAT(
            userData.radioButtonsAT.map(data => {
              return {
                ...data,
                disabled: true,
                containerStyle: {opacity: 1},
              };
            }),
          );
          setRadioButtonsBp(
            userData.radioButtonsBp.map(data => {
              return {
                ...data,
                disabled: true,
                containerStyle: {opacity: 1},
              };
            }),
          );
          setRadioButtonsDB(
            userData.radioButtonsDB.map(data => {
              return {
                ...data,
                disabled: true,
                containerStyle: {opacity: 1},
              };
            }),
          );
          setRadioButtonsSex(
            userData.radioButtonsSex.map(data => {
              return {
                ...data,
                disabled: true,
                containerStyle: {opacity: 1},
              };
            }),
          );
          setRadioButtonsTH(
            userData.radioButtonsTH.map(data => {
              return {
                ...data,
                disabled: true,
                containerStyle: {opacity: 1},
              };
            }),
          );
          setAnimating(false);
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
          justifyContent: 'center',
          marginTop: SIZES.padding * 3,
          paddingHorizontal: SIZES.padding * 2,
        }}>
        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}>
          User Profile
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
            editable={false}
            onChangeText={value => setName(value)}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
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
            editable={false}
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
            editable={false}
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
            containerStyle={{marginTop: SIZES.base}}
          />
        </View>
        <View style={{marginTop: SIZES.padding}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Blood Pressure{' '}
          </Text>
          <RadioGroup
            radioButtons={radioButtonsBp}
            onPress={radioButtons => setRadioButtonsBp(radioButtons)}
            layout={'row'}
            containerStyle={{marginTop: SIZES.base}}
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
              editable={false}
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
              editable={false}
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
            onPress={radioButtons => setRadioButtonsDB(radioButtons)}
            layout={'row'}
            containerStyle={{marginTop: SIZES.base}}
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
              editable={false}
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
            containerStyle={{marginTop: SIZES.base}}
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
            containerStyle={{marginTop: SIZES.base, flexWrap: 'wrap'}}
          />
        </View>
      </View>
    );
  }

  const handleLogOut = () => {
    AsyncStorage.clear()
      .then(() => {
        props.navigation.navigate('Login');
      })
      .catch(e => alert('Something went wrong'));
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
          onPress={handleLogOut}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100, flexGrow: 1}}>
        {renderHeader()}
        {animating ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{...FONTS.h2, color: COLORS.lightGreen}}>
              Loading Profile....
            </Text>
            <ActivityIndicator
              animating={animating}
              color={COLORS.lightGreen}
              size="large"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
              }}
            />
          </View>
        ) : (
          <>
            {renderForm()}
            {renderButton()}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Profile;
