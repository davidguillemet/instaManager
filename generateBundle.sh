react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

react-native bundle --entry-file index.js --platform ios --dev true --bundle-output ios/main.jsbundle --assets-dest ios
react-native unbundle --entry-file index.js --platform ios --dev true --bundle-output ios/main.jsbundle --assets-dest ios

1. generate bundle with -dev false
3. chane AppDelegate.m to use bundle instead of Url
4. InstaManager scheme as Release
5. Check 'InstaManager in emain.jsbundle' properties panel, group 'Target Membership' 


./node_modules/.bin/react-native-clean-project

rm -rf $TMPDIR/react-*