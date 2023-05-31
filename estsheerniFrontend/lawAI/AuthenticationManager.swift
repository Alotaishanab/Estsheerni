//
//  AuthenticationManager.swift
//  lawAI
//
//  Created by Abdullah on 28/05/2023.
//

import Foundation
import Combine
import Alamofire
import KeychainAccess
import CryptoKit
import SwiftyJSON
import UIKit
import SwiftUI

enum AuthenticationError: Error, CustomStringConvertible {
    case loginFailed
    case logoutFailed
    case tokenSaveFailed
    case tokenDeleteFailed
    case tokenReadFailed
    case encryptionFailed
    case decryptionFailed
    case registrationFailed

    var description: String {
        switch self {
        case .loginFailed:
            return "Login failed"
        case .logoutFailed:
            return "Logout failed"
        case .tokenSaveFailed:
            return "Could not save user token to keychain"
        case .tokenDeleteFailed:
            return "Could not delete user token from keychain"
        case .tokenReadFailed:
            return "Could not read user token from keychain"
        case .encryptionFailed:
            return "Could not encrypt user token"
        case .decryptionFailed:
            return "Could not decrypt user token"
        case .registrationFailed:
            return "Registration failed"
        }
    }
}

class AuthenticationManager: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var error: AuthenticationError?

    private let keychain = Keychain(service: "com.your.app.service")
    private let loginEndpoint = "http://127.0.0.1:8000/login/"
    private let registerEndpoint = "http://127.0.0.1:8000/register/"
    private let refreshTokenEndpoint = "http://127.0.0.1:8000/refresh_token/"

    private let tokenKey = "UserToken"
    private let keyTag = "com.your.app.keys.mykey"

    private var encryptionKey: SymmetricKey? {
        if let keyData = keychain[data: keyTag] {
            return SymmetricKey(data: keyData)
        }
        return nil
    }

    init() {
        // Generate a new encryption key only if one doesn't exist.
        if encryptionKey == nil {
            let key = SymmetricKey(size: .bits256)
            let keyData = key.withUnsafeBytes({ Data($0) })
            keychain[data: keyTag] = keyData
        }
    }
    
    // LogIn
    func logIn(email: String, password: String, completion: @escaping (Result<Void, AuthenticationError>) -> Void) {
        let parameters: [String: Any] = [
            "email": email,
            "password": password,
            "profile": [:] // Empty profile field
        ]
        
        print("Login Request Parameters: \(parameters)")
        
        AF.request(loginEndpoint, method: .post, parameters: parameters)
            .validate(statusCode: 200..<300)
            .response { response in
                switch response.result {
                case .success(let data):
                    do {
                        let json = try JSON(data: data ?? Data())
                        if let token = json["token"].string,
                           let encryptedToken = try? self.encryptToken(token) {
                            try self.saveToken(encryptedToken)
                            self.isLoggedIn = true
                            completion(.success(())) // signal successful login
                        } else {
                            self.error = .loginFailed
                        }
                    } catch {
                        print("JSON parsing failed: \(error)")
                        self.error = .loginFailed
                    }
                case .failure(let error):
                    print("Login request failed: \(error)")
                    self.error = .loginFailed
                }
            }
    }


    
    // Register
    func register(email: String, password: String, firstName: String, lastName: String, phoneNumber: String, completion: @escaping (Result<Void, AuthenticationError>) -> Void) {
        let parameters: [String: Any] = [
            "email": email,
            "password": password,
            "profile": [
                "first_name": firstName,
                "last_name": lastName,
                "phone_number": phoneNumber
            ]
        ]

        AF.request(registerEndpoint, method: .post, parameters: parameters)
            .validate(statusCode: 200..<300)
            .response { response in
                switch response.result {
                case .success:
                    guard let window = UIApplication.shared.windows.first else {
                        completion(.failure(.registrationFailed))
                        return
                    }
                    
                    let tabBarViewController = TabBarViewController()
                    let hostingController = UIHostingController(rootView: tabBarViewController)
                    window.rootViewController = hostingController
                    completion(.success(()))
                    
                case .failure(let error):
                    print("Registration request failed: \(error)")
                    completion(.failure(.registrationFailed))
                }
            }
    }



    // Encrypt token
       private func encryptToken(_ token: String) throws -> String {
           // Make sure token can be converted to Data
           guard let data = token.data(using: .utf8) else {
               throw AuthenticationError.encryptionFailed
           }
           // Make sure encryption key is available
           guard let key = encryptionKey else {
               throw AuthenticationError.encryptionFailed
           }
           let sealedBox = try ChaChaPoly.seal(data, using: key)
           return sealedBox.combined.base64EncodedString()
       }

       // Save token to Keychain
       private func saveToken(_ token: String) throws {
           try keychain.set(token, key: tokenKey)
       }
    
    
    
    // LogOut
    func logOut() {
        self.clearSensitiveData()
        self.deleteToken()
        self.isLoggedIn = false
    }
    
  

        // Decrypt token
        private func decryptToken(_ encryptedToken: String) throws -> String {
            // Make sure encryptedToken can be converted to Data
            guard let data = Data(base64Encoded: encryptedToken) else {
                throw AuthenticationError.decryptionFailed
            }
            // Make sure encryption key is available
            guard let key = encryptionKey else {
                throw AuthenticationError.decryptionFailed
            }
            let sealedBox = try ChaChaPoly.SealedBox(combined: data)
            let tokenData = try ChaChaPoly.open(sealedBox, using: key)
            // Make sure tokenData can be converted to String
            guard let token = String(data: tokenData, encoding: .utf8) else {
                throw AuthenticationError.decryptionFailed
            }
            return token
        }
        
       
    // Delete token from Keychain
    private func deleteToken() {
        do {
            try keychain.remove(tokenKey)
        } catch {
            self.error = .tokenDeleteFailed
        }
    }
    
    // Clear sensitive data
    private func clearSensitiveData() {
        UserDefaults.standard.removeObject(forKey: "userDataKey")
    }

    // Check login status
        func checkLoginStatus() {
            if let encryptedToken = try? keychain.getString(tokenKey),
               let _ = try? decryptToken(encryptedToken) {  // Use try? here
                isLoggedIn = true
            } else {
                isLoggedIn = false
            }
        }
    
    // Refresh Token
    func refreshToken(completion: @escaping (Result<Void, AuthenticationError>) -> Void) {
        guard let encryptedToken = try? keychain.getString(tokenKey),
              let token = try? decryptToken(encryptedToken) else {
            completion(.failure(.tokenReadFailed))
            return
        }
        
        let parameters: [String: Any] = [
            "refresh_token": token
        ]
        
        AF.request(refreshTokenEndpoint, method: .post, parameters: parameters)
            .validate(statusCode: 200..<300)
            .response { response in
                switch response.result {
                case .success(let data):
                    if let token = String(data: data ?? Data(), encoding: .utf8),
                       let encryptedToken = try? self.encryptToken(token) {
                        do {
                            try self.saveToken(encryptedToken)
                            completion(.success(()))
                        } catch {
                            completion(.failure(.tokenSaveFailed))
                        }
                    } else {
                        completion(.failure(.tokenSaveFailed))
                    }
                case .failure(let error):
                    print("Token refresh request failed: \(error)")
                    completion(.failure(.tokenSaveFailed))
                }
            }
    }
}
