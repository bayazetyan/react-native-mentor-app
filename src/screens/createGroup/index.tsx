import React, {useCallback, useState} from 'react';
import {Navigation} from 'react-native-navigation';
import {StyleSheet, FlatList, Pressable} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';
import {Input} from '../../components';
import {Employee} from '../../types/redux';
import {colors} from '../../styles/theme';
import {ListItem, Text, View, Avatar} from 'react-native-ui-lib';

import users from 'src/assets/data/users.json';
import {COMPONENTS_IDS} from '../../constants/navigation';
import {createGroup} from '../../services/firebase/api';
import {useActions} from 'redux-exodus';

function CreateGroup(): JSX.Element {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<Employee[]>([]);
  const {dismissModal} = useNavigation();
  const {getGroups} = useActions();

  const hideModal = useCallback(async () => {
    dismissModal();
    await Navigation.showOverlay({
      component: {
        id: COMPONENTS_IDS.bottom_tab_bar,
        name: COMPONENTS_IDS.bottom_tab_bar,
        options: {
          overlay: {
            interceptTouchOutside: false,
          },
          layout: {
            backgroundColor: 'transparent',
            componentBackgroundColor: 'transparent',
          },
        },
      },
    });
  }, []);

  const submit = useCallback(async () => {
    if (groupName && members.length > 0) {
      await createGroup(groupName, members);
      await getGroups();
      await hideModal();
    }
  }, [groupName, members, getGroups, hideModal]);

  const renderUserInfo = ({item}: {item: Employee}) => {
    const isSelected = members.includes(item);
    const selectUser = (user: Employee) => {
      if (isSelected) {
        setMembers(prevState => {
          return prevState.filter(i => i.email !== user.email);
        });
      } else {
        setMembers(prevState => {
          return [...prevState, user];
        });
      }
    };

    const selectedStyle = isSelected
      ? {backgroundColor: colors.brandColor2}
      : undefined;

    return (
      <ListItem
        style={selectedStyle}
        onPress={() => {
          selectUser(item);
        }}>
        <ListItem.Part left>
          <Avatar
            animate
            size={45}
            source={{
              uri: item.avatar,
            }}
          />
        </ListItem.Part>
        <ListItem.Part middle column containerStyle={styles.border}>
          <ListItem.Part>
            <Text text70BO color={isSelected ? colors.white : colors.black1}>
              {item.first_name} {item.last_name}
            </Text>
          </ListItem.Part>
          <ListItem.Part>
            <Text text90 color={isSelected ? colors.white : colors.gray2}>
              {item.email}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  };

  return (
    <>
      <View flex useSafeArea>
        <View row spread paddingH-16 centerV left height={52}>
          <Pressable onPress={hideModal}>
            <Text text70>Close</Text>
          </Pressable>
          <Pressable onPress={submit}>
            <Text text70 color={colors.secondaryColor1}>
              Create
            </Text>
          </Pressable>
        </View>
        <View flex paddingH-30>
          <Input
            autoFocus
            marginB-15
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <Text text70M marginB-10>
            Tap to select users
          </Text>
          <FlatList
            data={users}
            style={{marginBottom: 24}}
            renderItem={renderUserInfo}
            keyExtractor={item => item.email}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  border: {
    paddingLeft: 17,
    borderColor: colors.border_color,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default CreateGroup;
