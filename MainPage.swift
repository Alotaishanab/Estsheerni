//
//  MainPage.swift
//  lawAI
//
//  Created by Abdullah on 25/05/2023.
//

import SwiftUI

struct MainPageView: View {
    @State private var isLoggedIn = false
    
    var body: some View {
        VStack {
            if isLoggedIn {
                HomeView()
            }
        }
        .onAppear {
            if !isLoggedIn {
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    navigateToLoginPage()
                }
            }
        }
    }
    
    private func navigateToLoginPage() {
        // Handle navigation to the login page
        // Example: Use NavigationLink or change the root view to the login page
        isLoggedIn = true
    }
}
