import AppKit
import Foundation

final class MenuActions: NSObject {
    static let shared = MenuActions()

    private override init() { super.init() }

    @objc func openSettings(_ sender: Any?) {
        Task { @MainActor in
            WindowManager.shared.showSettings()
        }
    }

    @objc func refreshNow(_ sender: Any?) {
        Task { @MainActor in
            AppState.shared.loadSystems()
            AppState.shared.loadSystemDetails()
            AppState.shared.loadSecurityReports()
            AppState.shared.loadAlerts()
            AppState.shared.loadContainers()
        }
    }

    @objc func triggerSecurityCheck(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let systemID = sender.representedObject as? String else { return }
            AppState.shared.triggerSecurityScan(for: systemID, mode: "check")
        }
    }

    @objc func switchHub(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let instanceID = sender.representedObject as? UUID,
                  let instance = AppState.shared.instances.first(where: { $0.id == instanceID }) else { return }
            AppState.shared.selectInstance(instance)
        }
    }

    @objc func openSystemInBrowser(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let systemID = sender.representedObject as? String,
                  let instance = AppState.shared.selectedInstance else { return }

            let urlString = "\(instance.url)/system/\(systemID)"
            if let url = URL(string: urlString) {
                NSWorkspace.shared.open(url)
            }
        }
    }

    @objc func openDashboardInBrowser(_ sender: Any?) {
        Task { @MainActor in
            guard let instance = AppState.shared.selectedInstance,
                  let url = URL(string: instance.url) else { return }
            NSWorkspace.shared.open(url)
        }
    }

    @objc func systemClicked(_ sender: NSMenuItem) {
        Task { @MainActor in
            if let url = AppState.shared.selectedInstance?.url {
                NSPasteboard.general.clearContents()
                NSPasteboard.general.setString(url, forType: .string)
            }
        }
    }

    @objc func copyToClipboard(_ sender: NSMenuItem) {
        guard let text = sender.representedObject as? String else { return }
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(text, forType: .string)
    }

    @objc func quit(_ sender: Any?) {
        Task { @MainActor in
            NSApp.terminate(nil)
        }
    }
}
