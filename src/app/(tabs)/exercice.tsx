import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

function Exercice() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('inspiration');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exercisesData, setExercisesData] = useState<{ nom: string, phases: { name: string, duration: number }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.216.1:5000/api/exercice') 
      .then(response => response.json())
      .then(data => {
        setExercisesData(data);
        setSelectedExercise(data[0]?.nom); 
        setTimeLeft(data[0]?.phases[0].duration || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des exercices :", error);
        setLoading(false);
      });
  }, []);

  const getSelectedPhases = () => {
    const selected = exercisesData.find(ex => ex.nom === selectedExercise);
    return selected ? selected.phases : [];
  };

  const phases = getSelectedPhases();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            handlePhaseChange();
            return getSelectedPhases()[0]?.duration || 0;
          }
        });
      }, 1000);

      setTimer(interval);
    } else if (timer) {
      clearInterval(timer);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, selectedExercise]);

  const handlePhaseChange = () => {
    const currentIndex = phases.findIndex(p => p.name === currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex];

    setCurrentPhase(nextPhase.name);
    setTimeLeft(nextPhase.duration);

    if (nextIndex === 0) {
      setCycleCount(prev => prev + 1);
      if (cycleCount + 1 >= 3) {
        setIsRunning(false);
      }
    }
  };

  const startExercise = () => {
    if (phases.length === 0) return;
    setIsRunning(true);
    setCycleCount(0);
    setCurrentPhase(phases[0].name);
    setTimeLeft(phases[0].duration);
  };

  const stopExercise = () => {
    setIsRunning(false);
    if (timer) clearInterval(timer);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="green" />
        <Text>Chargement des exercices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MaterialIcons name="fitness-center" size={30} color="green" />
      <Text style={styles.title}>Exercice de Respiration</Text>

      <Text style={styles.text}>Choisir un type d'exercice:</Text>
      <Picker
        selectedValue={selectedExercise}
        style={styles.picker}
        onValueChange={(value) => setSelectedExercise(value)}
      >
        {exercisesData.map(ex => (
          <Picker.Item key={ex.nom} label={ex.nom} value={ex.nom} />
        ))}
      </Picker>

      <Text style={styles.text}>Phase actuelle : {currentPhase}</Text>
      <Text style={styles.text}>Temps restant : {timeLeft}s</Text>
      <Text style={styles.text}>Cycles : {cycleCount} / 3</Text>

      <View style={styles.buttonContainer}>
        {isRunning ? (
          <Button title="Arrêter l'exercice" onPress={stopExercise} />
        ) : (
          <Button title="Démarrer l'exercice" onPress={startExercise} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
});

export default Exercice;
