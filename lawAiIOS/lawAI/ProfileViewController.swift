//
//  ProfileViewController.swift
//  lawAI
//
//  Created by Abdullah on 30/05/2023.
//
import Foundation
import SwiftUI


struct ProfileViewController: View {
    var body: some View {
        NavigationView {
            Text("This is the Profile View")
                .navigationTitle("Profile")
        }
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileViewController()
    }
}


