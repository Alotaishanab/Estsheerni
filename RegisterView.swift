//
//  RegisterView.swift
//  lawAI
//
//  Created by Abdullah on 26/05/2023.
//

import SwiftUI

struct RegisterView: View {
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phoneNumber = ""
    @State private var password = ""

    var passwordIsValid: Bool {
           let passwordTest = NSPredicate(format: "SELF MATCHES %@ ", "^(?=.*[a-z])(?=.*[$@$#!%*?&])[A-Za-z\\d$@$#!%*?&]{8,}")
           return passwordTest.evaluate(with: password)
       }
    
    var body: some View {
        VStack {
            Text("Register")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            TextField("First Name", text: $firstName)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.bottom, 10)
            
            TextField("Last Name", text: $lastName)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.bottom, 10)
            
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.bottom, 10)
            
            TextField("Phone Number", text: $phoneNumber)
                .keyboardType(.numberPad)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.bottom, 10)

            SecureField("Password", text: $password)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.bottom, 20)
            
            Button(action: {
                // Register the user
                print("Registering the user...")
            }) {
                Text("Register")
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}
