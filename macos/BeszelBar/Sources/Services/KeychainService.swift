import Foundation

final class KeychainService {
    static let shared = KeychainService()

    private let defaults = UserDefaults.standard
    private let prefix = "com.nohitdev.BeszelBar.cred."

    private init() {}

    @discardableResult
    func saveCredential(_ credential: String, for account: String) -> Bool {
        guard !credential.isEmpty else { return false }
        defaults.set(credential, forKey: prefix + account)
        return true
    }

    func loadCredential(for account: String) -> String? {
        if let cred = defaults.string(forKey: prefix + account), !cred.isEmpty {
            return cred
        }
        if let fallback = defaults.string(forKey: "com.nohitdev.BeszelBar.defaultToken"), !fallback.isEmpty {
            return fallback
        }
        return nil
    }

    @discardableResult
    func deleteCredential(for account: String) -> Bool {
        defaults.removeObject(forKey: prefix + account)
        return true
    }

    @discardableResult
    func updateCredential(_ credential: String, for account: String) -> Bool {
        return saveCredential(credential, for: account)
    }

    func hasCredential(for account: String) -> Bool {
        return loadCredential(for: account) != nil
    }
}
