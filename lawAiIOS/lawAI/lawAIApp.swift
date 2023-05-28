//
//  lawAIApp.swift
//  lawAI
//
//  Created by Abdullah on 25/05/2023.
//

import SwiftUI

@main
struct lawAIApp: App {
    @StateObject var authenticationManager = AuthenticationManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authenticationManager)
        }
    }
}
