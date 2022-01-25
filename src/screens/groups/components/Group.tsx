import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Text,
  View,
  ExpandableSection,
  Card,
  ListItem,
  Avatar,
  Icon,
  Assets,
} from 'react-native-ui-lib';
import {colors} from 'src/styles/theme';
import {Employee} from 'src/types/redux';

interface GroupProps {
  title: string;
  members: Employee[];
}

function Group(props: GroupProps): JSX.Element {
  const {title, members} = props;
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const renderSectionHeader = useMemo(() => {
    return (
      <View row spread style={styles.group} centerV height={48}>
        <Text text50 color={colors.secondaryColor2}>
          {title}
        </Text>
        <Icon
          size={24}
          source={Assets.icons.plusSmall}
          tintColor={colors.secondaryColor2}
        />
      </View>
    );
  }, [title]);

  const renderMembers = useCallback(item => {
    return (
      <ListItem key={item.email}>
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
            <Text text70BO color={colors.black1}>
              {item.first_name} {item.last_name}
            </Text>
          </ListItem.Part>
          <ListItem.Part>
            <Text text90 color={colors.gray2}>
              {item.email}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }, []);

  return (
    <ExpandableSection
      top={false}
      onPress={toggle}
      expanded={expanded}
      sectionHeader={renderSectionHeader}>
      <View flex>{members.map(renderMembers)}</View>
    </ExpandableSection>
  );
}

const styles = StyleSheet.create({
  border: {
    paddingLeft: 17,
    borderColor: colors.border_color,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  group: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border_color,
  },
});

export default Group;
