import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.logo}
        source={require('./assets/law.png')}
      >
        {isLogin ? (
          <View style={styles.form}>
            <Text style={styles.title}>استشيرني</Text>
            <TextInput style={styles.input} placeholder="Username" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <TouchableOpacity style={styles.button} onPress={() => console.log('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsLogin(false)}>
              <Text style={styles.buttonText}>Go to Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.commonSocialButton]}>
              <Text style={styles.socialButtonText}>Log in via Gmail</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => setIsLogin(true)}>
                <Text style={styles.backButtonText}>&larr; Back</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Username" />
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Date of Birth" />
            <TextInput style={styles.input} placeholder="Phone Number" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <TextInput style={styles.input} placeholder="Re-type Password" secureTextEntry={true} />
            <TouchableOpacity style={styles.button} onPress={() => console.log('Register')}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.commonSocialButton]}>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.commonSocialButton]}>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    fontSize: 16,
    borderRadius: 5,
    paddingVertical: 12,
  },
  logo: {
    width: 100,
    height: 110,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#a9abaa',
    padding: 13,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButtonContainer: {
    position: 'absolute',
    top: -170,
    left: -47,
  },
  backButton: {
    backgroundColor: '#a9abaa',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  commonSocialButton: {
    backgroundColor: 'white', // choose the color you prefer
  },
  socialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
