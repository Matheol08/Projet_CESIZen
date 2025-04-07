import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

function Exercice() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('inspiration');
  const [timeLeft, setTimeLeft] = useState(7); 
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); 
  const [selectedExercise, setSelectedExercise] = useState<'rapide' | 'lent' | 'controle'>('rapide');

  
  const exercises = {
    rapide: [
      { name: 'inspiration', duration: 3 },
      { name: 'apnée', duration: 0 },
      { name: 'expiration', duration: 3 },
    ],
    lent: [
      { name: 'inspiration', duration: 5 },
      { name: 'apnée', duration: 0 },
      { name: 'expiration', duration: 5},
    ],
    controle: [
      { name: 'inspiration', duration: 7 },
      { name: 'apnée', duration: 4 },
      { name: 'expiration', duration: 8 },
    ],
  };

  const phases = exercises[selectedExercise]; 

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
           
            handlePhaseChange();
            return phases[0].duration; 
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
  }, [isRunning, timeLeft]);

 
const handlePhaseChange = () => {
  if (cycleCount >= 3) {
    setIsRunning(false);
    return;
  }


  const nextPhaseIndex = (phases.findIndex(phase => phase.name === currentPhase) + 1) % phases.length;
  const nextPhase = phases[nextPhaseIndex];

  setCurrentPhase(nextPhase.name);
  setTimeLeft(nextPhase.duration);

  if (nextPhaseIndex === 0) {
    setCycleCount(prevCount => prevCount + 1); 
  }
};



  const startExercise = () => {
    setIsRunning(true);
    setCycleCount(0); 
    setCurrentPhase('inspiration'); 
    setTimeLeft(phases[0].duration); 
  };


  const stopExercise = () => {
    setIsRunning(false);
    if (timer) {
      clearInterval(timer); 
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="fitness-center" size={30} color="green" />
      <Text style={styles.title}>Exercice de Respiration</Text>
      
      <Text style={styles.text}>Choisir un type d'exercice:</Text>
      <Picker
        selectedValue={selectedExercise}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
      >
        <Picker.Item label="Rapide" value="rapide" />
        <Picker.Item label="Lent" value="lent" />
        <Picker.Item label="Contrôlé" value="controle" />
      </Picker>

      <Text style={styles.text}>
        Phase actuelle : {currentPhase}
      </Text>
      <Text style={styles.text}>
        Temps restant : {timeLeft}s
      </Text>
      <Text style={styles.text}>
        Cycles : {cycleCount} / 3
      </Text>

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
    width: 150,
    marginBottom: 20,
  },
});

export default Exercice;
