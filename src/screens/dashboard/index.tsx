import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {View, Text, Card} from 'react-native-ui-lib';
import {useSelector} from 'redux-exodus';

import {AppState, TProfile} from 'src/types/redux';

interface DashboardProps {}

function Dashboard(props: DashboardProps): JSX.Element {
  const profile = useSelector<AppState, TProfile>(
    'authorization.profile.payload',
  );

  const renderHeader = useMemo(() => {
    return (
      <View marginT-40 height={52} paddingH-30 centerV>
        <Text text70L>Welcome back</Text>
        <Text text50>
          {profile.firstName} {profile.lastName}
        </Text>
      </View>
    );
  }, []);

  return (
    <View flex useSafeArea>
      <ScrollView>
        {renderHeader}
        <View paddingH-30>
          <View marginT-30>
            <Text text70M>Employees activity</Text>
          </View>
          <View marginT-30>
            <Text text70M>Last progress</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});

Dashboard.options = {
  topBar: {
    visible: false,
  },
};

export default Dashboard;
