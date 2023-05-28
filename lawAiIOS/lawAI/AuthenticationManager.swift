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

enum AuthenticationError: Error, CustomStringConvertible {
    case loginFailed
    case logoutFailed
    case tokenSaveFailed
    case tokenDeleteFailed
    case tokenReadFailed
    case encryptionFailed
    case decryptionFailed

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
        }
    }
}

class AuthenticationManager: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var error: AuthenticationError?
    
    private let keychain = Keychain(service: "com.your.app.service")
    private let loginEndpoint = "https://yourbackend.com/login"
    private let refreshTokenEndpoint = "https://yourbackend.com/refresh_token"

    private let tokenKey = "UserToken"
    private let keyTag = "com.your.app.keys.mykey"
    
    func register(email: String, password: String, firstName: String, lastName: String, completion: @escaping (Result<Void, AuthenticationError>) -> Void) {
            // Your logic for registering a user goes here
            // For example, you might make a network request to your backend API to create a new user

            // When you're done, you should call the completion handler with the result
            // For example:
            //   completion(.success(())) if the registration was successful, or
            //   completion(.failure(.registrationFailed)) if there was an error
        }

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
    
    // Hash password
        private func hashPassword(_ password: String) -> String {
            let passwordData = Data(password.utf8)
            let hashedData = SHA256.hash(data: passwordData)
            return hashedData.compactMap { String(format: "%02x", $0) }.joined()
        }
        
    // LogIn
        func logIn(email: String, password: String) {
            let hashedPassword = hashPassword(password)
            let parameters: [String: Any] = [
                "email": email,  
                "password": hashedPassword
            ]
            
            AF.request(loginEndpoint, method: .post, parameters: parameters)
                        .validate(statusCode: 200..<300)
                        .response { response in
                            switch response.result {
                            case .success(let data):
                                if let token = String(data: data ?? Data(), encoding: .utf8),
                                   let encryptedToken = try? self.encryptToken(token) {
                                    do {
                                        try self.saveToken(encryptedToken)  // Use try here
                                        self.isLoggedIn = true
                                    } catch {
                                        self.error = .tokenSaveFailed
                                    }
                                } else {
                                    self.error = .loginFailed
                                }
                            case .failure(let error):
                                print("Login request failed: \(error)")
                                self.error = .loginFailed
                            }
                        }
                }
    
    // LogOut
    func logOut() {
        self.clearSensitiveData()
        self.deleteToken()
        self.isLoggedIn = false
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
        
        // Save token to Keychain
        private func saveToken(_ token: String) throws {
            try keychain.set(token, key: tokenKey)
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
