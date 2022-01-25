import React, {useCallback, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {View} from 'react-native-ui-lib';
import {useActions, useSelector} from 'redux-exodus';
import Group from './components/Group';

function Groups(): JSX.Element {
  const {getGroups} = useActions();
  const groups = useSelector('groups.data.payload');

  useEffect(() => {
    getGroups();
  }, []);

  const renderGroup = useCallback(item => {
    return <Group key={item.id} title={item.title} members={item.members} />;
  }, []);

  return (
    <View flex paddingH-30 paddingB-90>
      <ScrollView showsVerticalScrollIndicator={false}>
        {groups?.map(renderGroup)}
      </ScrollView>
    </View>
  );
}

Groups.options = {
  topBar: {
    title: {
      text: 'Groups',
    },
  },
};

export default Groups;
