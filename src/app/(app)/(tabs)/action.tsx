import { Layout, Text } from '@/lib/ui';
import { StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <Layout style={styles.container}>
      <Text text="Tab Settings"/>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
