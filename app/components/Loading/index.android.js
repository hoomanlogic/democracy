
import React from 'react';
import {
   ProgressBarAndroid,
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
         <ProgressBarAndroid styleAttr="Large" />
      </View>
   );
}

export default Loading;
