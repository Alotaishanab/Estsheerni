//
//  RegisterView.swift
//  lawAI
//
//  Created by Abdullah on 26/05/2023.
//

import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authenticationManager: AuthenticationManager
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phoneNumber = ""
    @State private var password = ""
    @State private var passwordAgain = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            VStack {
                // First name
                TextField("First Name", text: $firstName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .onReceive(firstName.publisher.collect()) {
                        self.firstName = String($0.prefix(50))
                    }
                
                // Last name
                TextField("Last Name", text: $lastName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .onReceive(lastName.publisher.collect()) {
                        self.lastName = String($0.prefix(50))
                    }
                
                // Email
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .keyboardType(.emailAddress)
                
                // Phone number
                TextField("Phone Number", text: $phoneNumber)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.phonePad)
                
                // Password
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Password Again
                SecureField("Re-enter Password", text: $passwordAgain)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Register button
                Button(action: {
                    if isValidFields() {
                        authenticationManager.register(email: email, password: password, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber) { result in
                            switch result {
                            case .success:
                                // Registration successful, handle navigation or presentation logic here
                                presentationMode.wrappedValue.dismiss()
                            case .failure(let error):
                                // Registration failed, handle the error
                                showAlert = true
                                alertMessage = error.description
                            }
                        }
                    } else {
                        showAlert = true
                        alertMessage = "Please fill in all the fields correctly."
                    }
                }) {
                    Text("Register")
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(10)
                }
                .alert(isPresented: $showAlert) {
                    Alert(title: Text("Registration Error"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
                }
            }
            .padding()
            .navigationTitle("Register")
        }
    }
    
    func isValidFields() -> Bool {
        // Check if name is not empty
        if firstName.isEmpty || lastName.isEmpty {
            return false
        }
        
        // Check if email is valid
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPred = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        if !emailPred.evaluate(with: email) {
            return false
        }
        
        // Check if phone number is valid
        let phoneNumberRegEx = "^05[0-9]{8}$"
        let phoneNumberPred = NSPredicate(format:"SELF MATCHES %@", phoneNumberRegEx)
        if !phoneNumberPred.evaluate(with: phoneNumber) {
            return false
        }
        
        // Check if password is not empty and matches
        if password.isEmpty || password != passwordAgain {
            return false
        }
        
        return true
    }
}



    

