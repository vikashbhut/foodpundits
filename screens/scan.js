import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images, STORAGE_KEY} from '../constants';
import {VictoryPie, VictoryLabel} from 'victory-native';
import {Svg} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import {ImageBackground} from 'react-native';
import {decode} from 'base64-arraybuffer';
import S3 from 'aws-sdk/clients/s3';
import Config from 'react-native-config';
import axios from 'axios';
import {trimObj} from '../utils';
import {readData} from '../utils';

const Scan = () => {
  const [selectedCategory, setSelectCategoryByName] = useState('');
  const [sad, setSad] = useState(false);
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [asyncUserProfileData, setAsyncUserProfileData] = useState();
  const [openApiData, setOpenApiData] = useState(null);
  const [isOpenApi, setIsOpenApi] = useState(false);

  useEffect(() => {
    readData(STORAGE_KEY).then(value => {
      if (value !== null) {
        const parsedData = JSON.parse(value);
        if (parsedData?.userProfileData) {
          const userData = parsedData?.userProfileData;
          setAsyncUserProfileData(parsedData?.userProfileData ?? {});
        }
      }
    });
  }, []);

  const callOpenAPI = category => {
    setIsOpenApi(true);
    axios
      .post(`${Config.API_URL}/openapi`, {
        name: asyncUserProfileData?.name,
        age: asyncUserProfileData?.age,
        sex: asyncUserProfileData?.age,
        weight: `${asyncUserProfileData?.weight}`,
        low_bp: asyncUserProfileData?.bloodPressureLowerValue
          ? `${asyncUserProfileData?.bloodPressureLowerValue}`
          : 'no',
        high_bp: asyncUserProfileData?.bloodPressureHigherValue
          ? `${asyncUserProfileData?.bloodPressureHigherValue}`
          : 'no',
        diabetes: asyncUserProfileData?.diabetes,
        thyroid: asyncUserProfileData?.thyroid,
        physical_activity: asyncUserProfileData?.physicalActivity,
        ingredients: category,
      })
      .then(function (response) {
        setOpenApiData(response.data?.body);
        setIsOpenApi(false);
      })
      .catch(function (error) {
        setIsOpenApi(false);
        alert('Something went wrong while analyzing image');
      });
  };

  const uploadToS3 = () => {
    setDescription('');
    setOpenApiData(null);
    setSelectCategoryByName('');
    setAnalyzedData(null);
    if (imageData && fileName) {
      setUploading(true);
      const Bucket = Config.BUCKET;
      const arraybuffer = decode(imageData.data);
      const s3 = new S3({
        accessKeyId: Config.ACCESS_KEY_ID,
        secretAccessKey: Config.SECRET_KEY,
      });
      const params = {
        Bucket: Bucket,
        Key: fileName,
        Body: arraybuffer,
      };
      try {
        s3.upload(params, function (s3Err, data) {
          if (s3Err) throw s3Err;
          alert(`File uploaded successfully`);
          setTimeout(() => {
            setUploading(false);
          }, 1000);
        });
      } catch (e) {
        alert(`Something went wrong while uploading image`);
        setUploading(false);
      }
    } else {
      alert('Please select image');
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      })
        .then(image => {
          setTimeout(() => {
            setFileName(
              `${image.path.substring(image.path.lastIndexOf('/') + 1)}`,
            );
            setImageData(image);
          });
        })
        .catch(e => {
          alert(e);
        });
    }
  };

  const chooseFile = type => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setTimeout(() => {
          setFileName(
            `${image.path.substring(image.path.lastIndexOf('/') + 1)}`,
          );
          setImageData(image);
        });
      })
      .catch(e => {
        alert(e);
      });
  };

  const analyzingImage = () => {
    if (fileName) {
      setAnalyzedData(null);
      setAnalyzing(true);
      axios
        .post(`${Config.API_URL}/foodpundits`, {
          ImageName: fileName,
        })
        .then(function (response) {
          let data = response.data?.body;
          setAnalyzedData(data);
          if (data && data?.length) {
            const findItem = data.find(item =>
              Object.values(item)
                .map(item => item.toLowerCase())
                .find(a => a.includes('saturate')),
            );
            console.log(findItem);
            if (findItem) {
              const gram = Object.values(findItem)
                .find(a => {
                  let str = a.replace(/g/g, '').trim();
                  if (!isNaN(str) && 0 >= str <= 10) {
                    return true;
                  }
                  return false;
                })
                ?.replace(/g/g, '')
                ?.trim();
              console.log(gram);
              if (!isNaN(gram) && Number(gram) <= 5) {
                setSad(false);
              } else {
                setSad(true);
              }
            } else {
              setSad(true);
            }
          } else {
            setSad(true);
          }
          setAnalyzing(false);
        })
        .catch(function (error) {
          alert('Something went wrong while analyzing image');
          setAnalyzing(false);
        });
    } else {
      alert('Please select image');
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
            marginBottom: SIZES.padding,
          }}
          onPress={() => captureImage('photo')}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>
            Launch Camera For Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SIZES.padding,
          }}
          onPress={() => chooseFile('photo')}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SIZES.padding,
          }}
          onPress={() => uploadToS3()}>
          {uploading ? (
            <ActivityIndicator
              animating={uploading}
              color={COLORS.lightGreen}
              size="large"
              style={{
                height: 80,
              }}
            />
          ) : (
            <Text style={{color: COLORS.white, ...FONTS.h3}}>Upload Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SIZES.padding,
          }}
          onPress={() => {
            setImageData(null);
            setFileName('');
            setDescription('');
            setOpenApiData(null);
            setSelectCategoryByName('');
            setAnalyzedData(null);
          }}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>Remove Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SIZES.padding,
          }}
          onPress={() => analyzingImage()}>
          {analyzing ? (
            <ActivityIndicator
              animating={analyzing}
              color={COLORS.lightGreen}
              size="large"
              style={{
                height: 80,
              }}
            />
          ) : (
            <Text style={{color: COLORS.white, ...FONTS.h3}}>
              Ananlyze Image
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderImage() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: SIZES.padding,
        }}>
        <ImageBackground
          source={images.focusPng}
          style={{
            width: 200,
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={
              imageData
                ? {uri: `data:${imageData.mime};base64,${imageData.data}`}
                : images.focusPng
            }
            style={{
              width: 190,
              height: 190,
            }}
          />
        </ImageBackground>
      </View>
    );
  }

  function renderChart() {
    let updatedAnalyzedData = trimObj(analyzedData);
    if (updatedAnalyzedData.length > 1) {
      const keys = Object.values(updatedAnalyzedData[0]);
      updatedAnalyzedData = updatedAnalyzedData
        .filter((_, index) => index !== 0)
        .filter(item => !Object.values(item).includes(''));
      const part = Math.floor(360 / updatedAnalyzedData.length);
      const chartData = updatedAnalyzedData.map((item, index) => {
        let description = {};
        for (let i = 1; i < keys.length - 1; i++) {
          description[keys[i]] = item[keys[i]];
        }
        return {
          id: index + 1,
          label: item[keys[0]],
          y: part,
          name: item[keys[0]],
          description: {
            ...description,
          },
        };
      });
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
          <Svg
            width={SIZES.width}
            height={SIZES.width}
            style={{width: '100%', height: 'auto'}}>
            <VictoryPie
              standalone={false}
              data={chartData}
              radius={({datum}) => {
                return selectedCategory && selectedCategory == datum.name
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10;
              }}
              labelComponent={
                <VictoryLabel
                  text={({datum}) =>
                    datum.name.length > 4
                      ? datum.name.substring(0, 7) + '...'
                      : datum.name
                  }
                />
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: props => {
                            let categoryName = chartData[props.index]?.name;
                            if (categoryName) {
                              setDescription(
                                chartData[props.index].description,
                              );
                              callOpenAPI(categoryName);
                              setSelectCategoryByName(categoryName);
                            }
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              innerRadius={60}
              width={SIZES.width}
              height={SIZES.width}
              labelRadius={({innerRadius}) =>
                (SIZES.width * 0.4 + innerRadius) / 2.5
              }
              style={{
                labels: {fill: 'white', ...FONTS.body5},
                parent: {
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 3,
                },
              }}
            />
            {sad ? (
              <VictoryLabel
                textAnchor="middle"
                style={{fontSize: 20}}
                x={SIZES.width * 0.5}
                y={SIZES.width * 0.5}
                text={'Bad !!'}
              />
            ) : (
              <VictoryLabel
                textAnchor="middle"
                style={{fontSize: 20}}
                x={SIZES.width * 0.5}
                y={SIZES.width * 0.5}
                text={'Good !!'}
              />
            )}
          </Svg>
          {isOpenApi ? (
            <ActivityIndicator
              animating={isOpenApi}
              color={COLORS.lightGreen}
              size="large"
              style={{
                height: 80,
              }}
            />
          ) : selectedCategory && openApiData ? (
            <View
              style={{
                padding: SIZES.padding,
                marginHorizontal: SIZES.padding,
                backgroundColor: COLORS.lightGray,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                width: SIZES.width * 0.9,
              }}>
              <Text style={{...FONTS.h4}}>{selectedCategory}</Text>
              {description &&
                Object.keys(description)?.length &&
                Object.entries(description).map(([key, value]) => (
                  <Text style={{...FONTS.body4}}>
                    {key}:{value}
                  </Text>
                ))}
              <Text style={{...FONTS.body4}}>
                {openApiData?.replace(/\n/g, '')}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      );
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}>
          {renderImage()}
          {renderButton()}
          {analyzedData && analyzedData?.length && renderChart()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Scan;
