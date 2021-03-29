import {FlatList, View} from 'react-native';
import {hp} from "../../helper/themeHelper";
import React from 'react';

export const Attatchments = props => {
  const {renderData, urls = '', index, columns} = props;
  return (
    <FlatList
      key={index}
      style={{marginTop: hp(2)}}
      horizontal={false}
      data={urls}
      listKey={(item, index) => 'D' + index.toString()}
      showsHorizontalScrollIndicator={true}
      extraData={renderData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderData}
      numColumns={columns}
    />
  );
};
