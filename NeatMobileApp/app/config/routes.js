import React from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Assignments from '../routes/Assignments';
import AddAssignment from '../routes/AddAssignment';
import SignIn from '../routes/SignIn';
import Classes from '../routes/Classes';

export const routes = {
  getAssignmentsRoute() {
    return {
      renderScene(navigator) {
        return <Assignments navigator={navigator} />;
      },

      getTitle() {
        return 'Assignments';
      },
      renderRightButton(navigator) {
        return (
          <TouchableOpacity
            touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
            onPress={() => navigator.push(this.getAddAssignmentsRoute())}
            style={ExNavigator.Styles.barRightButton}
          >
            <Text
              style={ExNavigator.Styles.barRightButtonText}
            >ADD</Text>
          </TouchableOpacity>
        );
      },
      configureScene() {
        // return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
  },
  getAddAssignmentRoute() {
    return {
      renderScene(navigator) {
        return <AddAssignment navigator={navigator} />;
      },
      getTitle() {
        return 'AddAssignment';
      },
    };
  },
  // getDetailsRoute() {
  //   return {
  //     renderScene(navigator) {
  //       return <Details navigator={navigator} />;
  //     },
  //
  //     getTitle() {
  //       return 'Details';
  //     },
  //   };
  // },
  // getAssignmentDetailRoute() {
  //   return {
  //     renderScene(navigator) {
  //       return <AssignmentDetails navigator={navigator} />;
  //     },
  //
  //     getTitle() {
  //       return 'Assignment Details';
  //     },
  //   };
  // },
  // getProfileRoute() {
  //   return {
  //     renderScene(navigator) {
  //       return <Profile navigator={navigator} />;
  //     },
  //
  //     showNavigationBar: false,
  //   };
  // },
  getClassesRoute() {
    return {
      renderScene(navigator) {
        return <Classes navigator={navigator} />;
      },
    };
  },
  getSignInRoute() {
    return {
      renderScene(navigator) {
        return <SignIn navigator={navigator} />;
      },

      showNavigationBar: false,
    };
  },
};

export default routes;
