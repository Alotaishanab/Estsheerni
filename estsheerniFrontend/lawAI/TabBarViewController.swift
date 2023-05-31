//
//  TabBarViewController.swift
//  lawAI
//
//  Created by Abdullah on 30/05/2023.
//
import Foundation
import SwiftUI

struct TabBarViewController: View {
    var body: some View {
        TabView {
            RecentMessagesViewController()
                .tabItem {
                    Image(systemName: "bubble.left.and.bubble.right")
                    Text("Recent Messages")
                }

            QuestionsViewController()
                .tabItem {
                    Image(systemName: "questionmark.circle")
                    Text("Questions")
                }

            ProfileViewController()
                .tabItem {
                    Image(systemName: "person.circle")
                    Text("Profile")
                }
        }
    }
}







