// bugSolution.js
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const ImageComponent = ({ uri }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Basic URI validation – add more checks if needed
        if (!uri || typeof uri !== 'string') {
          throw new Error('Invalid or missing image URI.');
        }

        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Image failed to load: ${response.status}`);
        }
        const blob = await response.blob();
        const imageUri = await Expo.FileSystem.writeAsStringAsync(Expo.FileSystem.documentDirectory + 'image.jpg', blob);
        setImageSource({ uri: imageUri });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [uri]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading image: {error.message}</Text>
      </View>
    );
  }

  return <Image source={imageSource} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ImageComponent;