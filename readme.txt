react-native run-ios --simulator="iPhone 8"

react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

react-native bundle --entry-file index.js --platform ios --dev true --bundle-output ios/main.jsbundle --assets-dest ios
react-native unbundle --entry-file index.js --platform ios --dev true --bundle-output ios/main.jsbundle --assets-dest ios
react-native unbundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

1. generate bundle with -dev false
3. chane AppDelegate.m to use bundle instead of Url
4. InstaManager scheme as Release
5. Check 'InstaManager in main.jsbundle' properties panel, group 'Target Membership' 


./node_modules/.bin/react-native-clean-project

rm -rf $TMPDIR/react-*


// Codesign issue : resource fork, Finder information, or similar detritus not allowed
xattr -cr ./ios/


==========================
Clean react-native cache
==========================
RN < 0.50 - watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache clean && npm install && npm start -- --reset-cache
RN >= 0.50 -  watchman watch-del-all && rm -rf $TMPDIR/react-native-packager-cache-* && rm -rf $TMPDIR/metro-bundler-cache-* && rm -rf node_modules/ && npm cache clean --force && npm install && npm start -- --reset-cache
npm >= 5 - watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache verify && npm install && npm start -- --reset-cache

npm start -- --reset-cache

==========================
'config.h' file not found
==========================
rm -rf node_modules/
npm cache clean --force
npm install
node_modules/react-native/scripts/ios-install-third-party.sh
--> copy third-party to 'node_modules/react-native/'
cd node_modules/react-native/third-party/glog-0.3.4
./configure

