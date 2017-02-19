
import React from 'react';
import {
   ProgressBar,
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
         <ProgressBar styleAttr="Large" />
      </View>
   );
}

export default Loading;
