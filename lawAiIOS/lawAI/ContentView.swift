//
//  ContentView.swift
//  lawAI
//
//  Created by Abdullah on 25/05/2023.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var authManager = AuthenticationManager()

    var body: some View {
        Group {
            if authManager.isLoggedIn {
                TabBarViewController() // Redirect to TabBarView if user is logged in
            } else {
                MainPageView()
            }
        }.onAppear {
            authManager.checkLoginStatus()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

