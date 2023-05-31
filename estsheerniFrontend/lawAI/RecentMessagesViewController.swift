//
//  RecentMessagesViewController.swift
//  lawAI
//
//  Created by Abdullah on 30/05/2023.
//

import Foundation
import SwiftUI

struct RecentMessagesViewController: View {
    var body: some View {
        NavigationView {
            Text("This is the Recent Messages View")
                .navigationTitle("Recent Messages")
        }
    }
}

struct RecentMessagesView_Previews: PreviewProvider {
    static var previews: some View {
        RecentMessagesViewController()
    }
}
