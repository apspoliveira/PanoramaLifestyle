import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export function RecipeHtmlView({ html }: { html: string }) {
  return <WebView originWhitelist={['*']} source={{ html }} style={styles.web} />;
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: '#F8FAFC' },
});
