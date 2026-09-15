import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

export function RecipeHtmlView({ html }: { html: string }) {
  return (
    <View style={styles.container}>
      {createElement('iframe', {
        srcDoc: html,
        title: 'Recipe',
        // No scripts are needed; the sandbox keeps recipe markup inert.
        sandbox: 'allow-same-origin',
        style: { border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
});
