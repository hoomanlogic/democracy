
import React from 'react';
import {
   ActivityIndicator,
   View
} from 'react-native';

function Loading ({ theme }) {
   var style = {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.bgColor,
   };
   return (
      <View style={style}>
         <ActivityIndicator size="large" />
      </View>
   );
}

export default Loading;
