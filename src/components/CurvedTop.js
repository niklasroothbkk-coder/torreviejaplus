import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function CurvedTop({ width = 400, height = 60 }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={`M 0 ${height} Q ${width / 2} 0 ${width} ${height} L ${width} ${height} L 0 ${height} Z`}
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}
