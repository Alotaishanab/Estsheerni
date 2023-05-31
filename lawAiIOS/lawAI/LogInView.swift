//
//  LogInView.swift
//  lawAI
//
//  Created by Abdullah on 26/05/2023.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authenticationManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    @State private var shouldNavigate = false  // add this line

    var body: some View {
        NavigationView {
            VStack {
                Text("Login")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                TextField("Email", text: $email)
                    .keyboardType(.emailAddress)
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
                    authenticationManager.logIn(email: email, password: password) { result in
                        switch result {
                        case .success():
                            shouldNavigate = true
                        case .failure(let error):
                            print("Login failed: \(error)")
                        }
                    }
                }) {
                    Text("Login")
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                
                NavigationLink(
                    destination: TabBarViewController(),
                    isActive: $shouldNavigate,
                    label: {
                        EmptyView()
                    })
            }
            .padding()
        }
    }
}




