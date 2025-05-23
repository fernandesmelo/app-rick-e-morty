import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, ActivityIndicator } from "react-native-paper";
import axios from "axios";

const DetailsScreen = ({ route }) => {
  const { episode } = route.params;
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Busca todos os personagens do episódio em paralelo
        const responses = await Promise.all(
          episode.characters.map((url) => axios.get(url))
        );
        setCharacters(responses.map((res) => res.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [episode]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 32 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{episode.name}</Title>
      <Paragraph style={styles.subtitle}>
        Data de exibição: {episode.air_date}
      </Paragraph>
      <Paragraph style={styles.subtitle}>Episódio: {episode.episode}</Paragraph>
      {characters.map((character) => (
        <Card key={character.id} style={styles.card}>
          <Card.Cover source={{ uri: character.image }} />
          <Card.Content>
            <Title>{character.name}</Title>
            <Paragraph>Espécie: {character.species}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 8,
    fontSize: 22,
  },
  subtitle: {
    marginBottom: 4,
  },
  card: {
    marginBottom: 16,
  },
});

export default DetailsScreen;
