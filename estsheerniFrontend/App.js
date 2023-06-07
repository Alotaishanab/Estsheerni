import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, I18nManager } from 'react-native';

I18nManager.forceRTL(true); // For Arabic Language support with RTL

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleLanguageChange = () => {
    const newLanguage = language === 'English' ? 'Arabic' : 'English';
    setLanguage(newLanguage);
    I18nManager.forceRTL(newLanguage === 'Arabic');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.languageButton} onPress={handleLanguageChange}>
        <Text style={styles.languageButtonText}>{language === 'Arabic' ? 'English' : 'عربي'}</Text>
      </TouchableOpacity>

      <Image style={styles.logo} source={require('./assets/law.png')} />

      <View style={styles.form}>
        <Text style={styles.title}>{language === 'Arabic' ? 'استشيرني' : 'Estsheerni'}</Text>
        {isLogin ? (
          <>
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'البريد الإلكتروني' : 'Email'} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'كلمة السر' : 'Password'} secureTextEntry={true} />
            <TouchableOpacity style={styles.button} onPress={() => console.log('Login')}>
              <Text style={styles.buttonText}>{language === 'Arabic' ? 'تسجيل الدخول' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => setIsLogin(false)}>
              <Text style={styles.buttonSecondaryText}>{language === 'Arabic' ? 'الذهاب إلى التسجيل' : 'Switch to Register'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>{language === 'Arabic' ? 'تسجيل الدخول عبر Gmail' : 'Login with Gmail'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backButton} onPress={() => setIsLogin(true)}>
              <Text style={styles.backButtonText}>&larr; {language === 'Arabic' ? 'الرجوع' : 'Back'}</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'الاسم الأول' : 'First Name'} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'الاسم الأخير' : 'Last Name'} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'البريد الإلكتروني' : 'Email'} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'رقم الهاتف' : 'Phone Number'} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'كلمة السر' : 'Password'} secureTextEntry={true} />
            <TextInput style={styles.input} placeholder={language === 'Arabic' ? 'أعد إدخال كلمة السر' : 'Confirm Password'} secureTextEntry={true} />
            <TouchableOpacity style={styles.button} onPress={() => console.log('Register')}>
              <Text style={styles.buttonText}>{language === 'Arabic' ? 'تسجيل' : 'Register'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>{language === 'Arabic' ? 'الاستمرار مع Google' : 'Continue with Google'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>{language === 'Arabic' ? 'الاستمرار مع Apple' : 'Continue with Apple'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  languageButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: 'transparent',
    padding: 10,
  },
  languageButtonText: {
    fontSize: 16,
    color: '#FF6347',
  },
  form: {
    width: '80%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#1DA1F2',
    marginBottom: 20,
    paddingLeft: 16,
    fontSize: 18,
    borderRadius: 10,
    backgroundColor: '#E8F5FE',
    paddingHorizontal: 12,
    color: '#14171A',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    marginBottom: 32,
    textAlign: 'center',
    color: '#FF6347',
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#F5FCFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  buttonSecondaryText: {
    color: '#FF6347',
    fontWeight: '700',
    fontSize: 20,
  },
  backButton: {
    backgroundColor: '#FF6347',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    fontWeight: '700',
    fontSize: 18,
    color: 'white',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  socialButtonText: {
    color: '#1DA1F2',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default App;
