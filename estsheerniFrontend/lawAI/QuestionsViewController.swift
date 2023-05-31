//
//  QuestionsViewController.swift
//  lawAI
//
//  Created by Abdullah on 30/05/2023.
//

import Foundation
import SwiftUI

struct QuestionsViewController: View {
    var body: some View {
        NavigationView {
            Text("This is the Questions View")
                .navigationTitle("Questions")
        }
    }
}

struct QuestionsView_Previews: PreviewProvider {
    static var previews: some View {
        QuestionsViewController()
    }
}
