import SwiftUI

struct HomeView: View {
    @State private var isLoggedIn = false
    
    var body: some View {
        NavigationView {
            VStack {
                VStack {
                    Image(systemName: "scalemass")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 80, height: 80)
                        .padding(.bottom, 30)

                    Text("Legal Hub")
                        .font(.system(size: 34, weight: .bold, design: .default))
                        .padding(.bottom, 20)
                }
                .padding(.top, 40)

                VStack(alignment: .leading) {
                    Text("Welcome to Legal Hub")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .padding(.bottom, 10)

                    Text("Connecting you to the best legal professionals.")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .lineLimit(1)
                        .padding(.bottom, 30)
                }
                .padding(.horizontal, 50)

                VStack(spacing: 20) {
                    if isLoggedIn {
                        NavigationLink(destination: MainPageView()) {
                            StandardButton(title: "View Homepage", color: .blue)
                        }
                    } else {
                        NavigationLink(destination: LoginView()) {
                            StandardButton(title: "Login", color: .blue)
                        }

                        NavigationLink(destination: RegisterView(), label: {
                            StandardButton(title: "Register", color: .green)
                        })


                        Divider()
                            .padding()

                        Button(action: {
                            // Handle login with Apple action
                            isLoggedIn = true
                        }) {
                            HStack {
                                Image(systemName: "applelogo")
                                    .resizable()
                                    .frame(width: 20, height: 20)
                                    .foregroundColor(.white)

                                Spacer()

                                Text("Continue with Apple")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                Spacer()
                            }
                            .padding()
                            .background(Color.black)
                            .cornerRadius(15)
                        }
                        .frame(maxWidth: .infinity)

                        Button(action: {
                            // Handle login with Google action
                            isLoggedIn = true
                        }) {
                            HStack {
                                Image(systemName: "g.circle.fill")
                                    .resizable()
                                    .frame(width: 20, height: 20)
                                    .foregroundColor(.white)
                                
                                Spacer()

                                Text("Continue with Google")
                                    .font(.headline)
                                    .foregroundColor(.white)

                                Spacer()
                            }
                            .padding()
                            .background(Color.red)
                            .cornerRadius(15)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.horizontal, 16)

                Spacer()
            }

            .navigationBarItems(leading:
                Button(action: {
                    // Handle language change action
                }) {
                    Image(systemName: "globe")
                        .resizable()
                        .frame(width: 20, height: 20)
                }
            )
        }
    }
}

struct StandardButton: View {
    let title: String
    let color: Color

    var body: some View {
        Text(title)
            .font(.headline)
            .fontWeight(.medium)
            .foregroundColor(.white)
            .padding()
            .frame(maxWidth: .infinity)
            .background(color)
            .cornerRadius(15)
    }
}


